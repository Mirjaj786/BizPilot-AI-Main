import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { GoogleLogin } from "@react-oauth/google";
import Button from "../../components/Button/Button.jsx";
import { StoreContext } from "../../context/StoreContext.jsx";
import { authService } from "../../services/authService.js";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(StoreContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setLoading(true);
    try {
      const response = await authService.googleLogin(credentialResponse.credential);
      if (response && response.user) {
        loginUser(response.user);
        toast.success("Welcome back! Google Sign-in successful.");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.email || !form.password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(form.email, form.password);
      if (response && response.user) {
        loginUser(response.user);
        toast.success("Welcome back to BizPilot AI!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="name@business.com"
            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Password
          </label>
        </div>
        <div className="relative">
          <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="remember"
          defaultChecked
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
          Remember me on this device
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full mt-2 font-bold"
      >
        Sign In to Workspace
      </Button>

      <div className="relative my-3 flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-slate-700 w-full"></div>
        <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-medium absolute">OR</span>
      </div>

      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google Sign-In Failed")}
          useOneTap
          shape="pill"
          theme="filled_blue"
        />
      </div>

      <div className="pt-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don't have a BizFlow account yet?{" "}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
}
