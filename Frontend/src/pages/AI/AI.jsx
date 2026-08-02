import { useState, useRef, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { aiService } from "../../services/aiService.js";
import {
  IoSendOutline,
  IoSparklesOutline,
  IoPersonOutline,
  IoStatsChartOutline,
  IoAlertCircleOutline,
  IoBulbOutline,
  IoCartOutline,
  IoMicOutline,
  IoMicOffOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";

const LANGUAGES = [
  { id: "en", label: "English", flag: "🇬🇧", langCode: "en-US" },
  { id: "hi", label: "हिंदी", flag: "🇮🇳", langCode: "hi-IN" },
  { id: "bn", label: "বাংলা", flag: "🇧🇩", langCode: "bn-IN" },
];

const SUGGESTIONS_MAP = {
  en: [
    { icon: IoStatsChartOutline, text: "How much did I sell this week?" },
    { icon: IoAlertCircleOutline, text: "Which customer accounts have overdue payments?" },
    { icon: IoCartOutline, text: "Who is my best customer?" },
    { icon: IoBulbOutline, text: "Give me tips to grow my business" },
  ],
  hi: [
    { icon: IoStatsChartOutline, text: "इस सप्ताह कितनी बिक्री हुई?" },
    { icon: IoAlertCircleOutline, text: "किन ग्राहकों का भुगतान बकाया है?" },
    { icon: IoCartOutline, text: "मेरा सबसे अच्छा ग्राहक कौन है?" },
    { icon: IoBulbOutline, text: "व्यवसाय बढ़ाने के टिप्स दें" },
  ],
  bn: [
    { icon: IoStatsChartOutline, text: "এই সপ্তাহে কত বিক্রি হয়েছে?" },
    { icon: IoAlertCircleOutline, text: "কোন কোন কাস্টমারের টাকা বাকি আছে?" },
    { icon: IoCartOutline, text: "আমার সেরা কাস্টমার কে?" },
    { icon: IoBulbOutline, text: "ব্যবসা বাড়ানোর টিপস দিন" },
  ],
};

const WELCOME_MESSAGES = {
  en: `### 👋 Hello! I am **BizPilot AI**, your business copilot.\n\nI analyze your CRM accounts, POS tickets, and action items in real-time to give you actionable insights.\n\n**Try asking me:**\n- *"How much did I sell?"*\n- *"Who is my top customer?"*\n- *"Show my pending tasks"*\n- *"Give me tips to grow my business"*`,
  hi: `### 👋 नमस्ते! मैं **BizPilot AI**, आपका बिज़नेस कोपायलट हूँ।\n\nमैं आपकी दुकान के सभी खातों, बिक्री और कार्यों का विश्लेषण करके सटीक सलाह देता हूँ।\n\n**मुझसे पूछें:**\n- *"इस सप्ताह कितनी बिक्री हुई?"*\n- *"किसका भुगतान बकाया है?"*\n- *"मेरा सबसे अच्छा ग्राहक कौन है?"*\n- *"व्यापार बढ़ाने के उपाय बताएं"*`,
  bn: `### 👋 নমস্কার! আমি **BizPilot AI**, আপনার ব্যবসায়িক ক পাইলট।\n\nআমি আপনার খাতা, বিক্রি এবং কাস্টমার ডাটা বিশ্লেষণ করে সঠিক পরামর্শ তৈরি করি।\n\n**জিজ্ঞাসা করুন:**\n- *"এই সপ্তাহে কত বিক্রি হয়েছে?"*\n- *"কার কার টাকা বাকি আছে?"*\n- *"আমার সেরা কাস্টমার কে?"*\n- *"ব্যবসা বাড়ানোর টিপস দিন"*`,
};

export default function AI() {
  const { settings, sales, customers } = useContext(StoreContext);
  const [aiLanguage, setAiLanguage] = useState(() => localStorage.getItem("bf_ai_lang") || "en");
  const [messages, setMessages] = useState([
    {
      id: "m_welcome",
      sender: "ai",
      text: WELCOME_MESSAGES[localStorage.getItem("bf_ai_lang") || "en"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleLanguageChange = (langId) => {
    setAiLanguage(langId);
    localStorage.setItem("bf_ai_lang", langId);
    setMessages((prev) => [
      ...prev,
      {
        id: `lang_change_${Date.now()}`,
        sender: "ai",
        text: WELCOME_MESSAGES[langId],
      },
    ]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speakText = (text) => {
    if (!voiceSpeechEnabled || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown characters and split into clean sentences
    const cleanText = text.replace(/[*#`_\-]/g, " ").replace(/\s+/g, " ").trim();
    if (!cleanText) return;

    const currentLangObj = LANGUAGES.find((l) => l.id === aiLanguage) || LANGUAGES[0];

    // Split text by punctuation including English (.!?) and Bengali/Hindi Danda (।)
    const rawSentences = cleanText.split(/(?<=[.!?।\n])/g).map((s) => s.trim()).filter(Boolean);

    // Ensure chunks are short (<120 chars) so Web Speech API never times out
    const chunks = [];
    for (const raw of rawSentences) {
      if (raw.length <= 120) {
        chunks.push(raw);
      } else {
        const subParts = raw.split(/(?<=[,:,;])\s*/g);
        for (const sub of subParts) {
          if (sub.length <= 120) {
            chunks.push(sub);
          } else {
            const words = sub.split(" ");
            let current = "";
            for (const w of words) {
              if ((current + " " + w).length > 100) {
                if (current) chunks.push(current);
                current = w;
              } else {
                current = current ? current + " " + w : w;
              }
            }
            if (current) chunks.push(current);
          }
        }
      }
    }

    if (chunks.length === 0) return;

    let chunkIndex = 0;
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang === currentLangObj.langCode || v.lang.startsWith(currentLangObj.id)
    );

    const speakNextChunk = () => {
      if (chunkIndex >= chunks.length) return;

      const chunk = chunks[chunkIndex].trim();
      if (!chunk) {
        chunkIndex++;
        speakNextChunk();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = currentLangObj.langCode;
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        chunkIndex++;
        setTimeout(speakNextChunk, 40);
      };

      utterance.onerror = () => {
        chunkIndex++;
        setTimeout(speakNextChunk, 40);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser version. Please try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const currentLangObj = LANGUAGES.find((l) => l.id === aiLanguage) || LANGUAGES[0];
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLangObj.langCode;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const simulateTypingEffect = (aiMsgId, fullText) => {
    const lines = fullText.split("\n");
    let currentLineIndex = 0;
    let accumulatedText = "";

    const timer = setInterval(() => {
      if (currentLineIndex < lines.length) {
        accumulatedText += (currentLineIndex === 0 ? "" : "\n") + lines[currentLineIndex];
        currentLineIndex++;

        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: accumulatedText } : m))
        );
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        clearInterval(timer);
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, isTyping: false } : m))
        );
        speakText(fullText);
      }
    }, 40);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsgId = `u_${Date.now()}`;
    const aiMsgId = `ai_${Date.now()}`;

    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const aiReplyText = await aiService.askAI(text, aiLanguage);
      setLoading(false);
      setMessages((prev) => [...prev, { id: aiMsgId, sender: "ai", text: "", isTyping: true }]);
      simulateTypingEffect(aiMsgId, aiReplyText);
    } catch {
      setLoading(false);
      const errText =
        aiLanguage === "hi"
          ? "क्षमा करें, डेटा प्राप्त करने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
          : aiLanguage === "bn"
          ? "দুঃখিত, তথ্য আনতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Sorry, I encountered an error retrieving data. Please try again.";
      setMessages((prev) => [...prev, { id: `err_${Date.now()}`, sender: "ai", text: errText }]);
    }
  };

  const parseInlineBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const formatMessageText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### "))
        return <h4 key={idx} className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-3.5 mb-1.5 first:mt-0">{line.replace("### ", "")}</h4>;
      if (line.startsWith("## ") || line.startsWith("# "))
        return <h3 key={idx} className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-4 mb-2 first:mt-0">{line.replace(/^##? /, "")}</h3>;
      if (line.startsWith("- ") || line.startsWith("* "))
        return (
          <div key={idx} className="flex gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed">
            <span className="text-purple-500 font-bold">•</span>
            <span>{parseInlineBold(line.substring(2))}</span>
          </div>
        );
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^\d+/)[0];
        return (
          <div key={idx} className="flex gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed">
            <span className="text-purple-600 font-extrabold">{num}.</span>
            <span>{parseInlineBold(line.replace(/^\d+\.\s/, ""))}</span>
          </div>
        );
      }
      if (!line.trim()) return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-sm sm:text-base leading-relaxed mt-1 font-normal">{parseInlineBold(line)}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold shadow-xs">
            <IoSparklesOutline size={20} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              BizPilot AI Copilot
            </h2>
            <p className="text-[11px] text-slate-400">
              Active Dashboard Context: <span className="font-semibold text-slate-700 dark:text-slate-300">{settings?.businessName || "My Business"}</span> ({sales.length} sales • {settings?.currency || "₹"}{sales.reduce((a, s) => a + (s.status === "Paid" ? Number(s.total || s.amount || 0) : 0), 0).toLocaleString()} revenue • {customers.length} clients)
            </p>
          </div>
        </div>

        {/* Right side controls: Language Selector & Voice Toggle */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => handleLanguageChange(lang.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aiLanguage === lang.id
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
                title={`Switch AI language to ${lang.label}`}
              >
                <span>{lang.flag}</span>
                <span className="hidden sm:inline">{lang.label}</span>
              </button>
            ))}
          </div>

          {/* Voice Readout Toggle */}
          <button
            type="button"
            onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              voiceSpeechEnabled
                ? "bg-purple-600 text-white border-purple-600 ring-2 ring-purple-600/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
            title="Toggle AI Voice Audio Answers"
          >
            {voiceSpeechEnabled ? <IoVolumeHighOutline size={16} /> : <IoVolumeMuteOutline size={16} />}
            <span className="hidden sm:inline">{voiceSpeechEnabled ? "Voice On" : "Voice Off"}</span>
          </button>
        </div>
      </div>

      {/* Localized Suggestion Chips */}
      <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 border-x border-slate-200/80 dark:border-slate-800 overflow-x-auto">
        {(SUGGESTIONS_MAP[aiLanguage] || SUGGESTIONS_MAP.en).map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.text)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-purple-300 hover:text-purple-600 transition-all shadow-2xs shrink-0 cursor-pointer"
            >
              <Icon size={14} className="text-purple-500" />
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/40 border-x border-slate-200/80 dark:border-slate-800 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-3xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-2xs ${msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-600 text-white"
                }`}
            >
              {msg.sender === "user" ? <IoPersonOutline size={18} /> : <IoSparklesOutline size={18} />}
            </div>

            <div
              className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base border shadow-2xs ${msg.sender === "user"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                }`}
            >
              {msg.sender === "user" ? msg.text : formatMessageText(msg.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white font-bold">
              <IoSparklesOutline size={16} className="animate-spin" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl text-xs text-slate-400 font-medium">
              BizPilot AI is analyzing your local shop database...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-b-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 sm:gap-3 shadow-2xs"
      >
        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all cursor-pointer shrink-0 ${
            isListening
              ? "bg-red-600 text-white border-red-600 animate-pulse ring-4 ring-red-600/30"
              : "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100"
          }`}
          title={isListening ? "Listening... Speak your command now" : "Click to Speak (Voice Command)"}
        >
          {isListening ? <IoMicOffOutline size={18} /> : <IoMicOutline size={18} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening to your voice..." : "Ask AI or speak via mic..."}
          className="bf-input flex-1"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer shrink-0"
        >
          <IoSendOutline size={16} />
        </button>
      </form>
    </div>
  );
}
