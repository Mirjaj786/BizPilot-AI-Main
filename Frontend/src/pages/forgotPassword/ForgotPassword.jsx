import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMailOutline, IoArrowBackOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import Button from "../../components/Button/Button.jsx";
import { authService } from "../../services/authService.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSent(true);
      toast.success(res?.message || "Password reset link sent to your email!");
    } catch (error) {
      toast.error(error?.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {sent ? (
        <div className="text-center py-4 space-y-4">
          <IoCheckmarkCircleOutline size={56} className="mx-auto text-emerald-500 animate-bounce" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Check Your Email Inbox
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            We've sent a password reset link to <strong className="text-blue-600 dark:text-blue-400 font-semibold">{email}</strong>. The link expires in 15 minutes.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSent(false)}
              className="w-full font-bold"
            >
              Resend Reset Link
            </Button>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors pt-2"
            >
              <IoArrowBackOutline size={15} /> Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Account Email Address
            </label>
            <div className="relative">
              <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@business.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full font-bold mt-2"
          >
            Send Password Reset Link
          </Button>

          <div className="pt-3 text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <IoArrowBackOutline size={16} /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
