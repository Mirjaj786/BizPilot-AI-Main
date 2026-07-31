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
} from "react-icons/io5";

const SUGGESTIONS = [
  { icon: IoStatsChartOutline, text: "How much did I sell this week?" },
  { icon: IoAlertCircleOutline, text: "Which customer accounts have overdue payments?" },
  { icon: IoCartOutline, text: "Who is my best customer?" },
  { icon: IoBulbOutline, text: "Give me tips to grow my business" },
];

export default function AI() {
  const { settings, sales, customers } = useContext(StoreContext);
  const [messages, setMessages] = useState([
    {
      id: "m_welcome",
      sender: "ai",
      text: `### 👋 Hello! I am **BizFlow AI**, your business copilot.\n\nI analyze your CRM accounts, POS tickets, and action items in real-time to give you actionable insights.\n\n**Try asking me:**\n- *"How much did I sell?"*\n- *"Who is my top customer?"*\n- *"Show my pending tasks"*\n- *"Give me tips to grow my business"*`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { id: `u_${prev.length + 1}`, sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const aiReplyText = await aiService.askAI(text);
      setMessages((prev) => [...prev, { id: `ai_${prev.length + 1}`, sender: "ai", text: aiReplyText }]);
    } catch {
      setMessages((prev) => [...prev, { id: `err_${prev.length + 1}`, sender: "ai", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
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
        return <h4 key={idx} className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-3 mb-1 first:mt-0">{line.replace("### ", "")}</h4>;
      if (line.startsWith("## ") || line.startsWith("# "))
        return <h3 key={idx} className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-3 mb-1.5 first:mt-0">{line.replace(/^##? /, "")}</h3>;
      if (line.startsWith("- ") || line.startsWith("* "))
        return (
          <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
            <span className="text-purple-500">•</span>
            <span>{parseInlineBold(line.substring(2))}</span>
          </div>
        );
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^\d+/)[0];
        return (
          <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
            <span className="text-purple-600 font-bold">{num}.</span>
            <span>{parseInlineBold(line.replace(/^\d+\.\s/, ""))}</span>
          </div>
        );
      }
      if (!line.trim()) return <div key={idx} className="h-1.5" />;
      return <p key={idx} className="text-xs sm:text-sm leading-relaxed">{parseInlineBold(line)}</p>;
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
              BizFlow AI Copilot
            </h2>
            <p className="text-[11px] text-slate-400">
              Active Context: <span className="font-semibold text-slate-700 dark:text-slate-300">{settings?.businessName || "My Business"}</span> ({sales.length} sales, {customers.length} clients)
            </p>
          </div>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 border-x border-slate-200/80 dark:border-slate-800 overflow-x-auto">
        {SUGGESTIONS.map((item, idx) => {
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
            className={`flex items-start gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-2xs ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              {msg.sender === "user" ? <IoPersonOutline size={16} /> : <IoSparklesOutline size={16} />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm border shadow-2xs ${
                msg.sender === "user"
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
              BizFlow AI is analyzing your local shop database...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-b-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shadow-2xs"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI about sales, customers, pending dues, or tips..."
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
