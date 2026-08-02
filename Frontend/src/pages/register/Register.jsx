import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import Button from "../../components/Button/Button.jsx";
import { StoreContext } from "../../context/StoreContext.jsx";
import { authService } from "../../services/authService.js";

const BUSINESS_TYPES = [
  "Retail & Grocery",
  "Pharmacy & Healthcare",
  "Restaurant & Cafe",
  "Local Services & Salon",
  "Coaching & Education",
  "Other Merchant",
];

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    businessName: "",
    fullName: "",
    email: "",
    businessType: "Retail & Grocery",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setLoading(true);
    try {
      const response = await authService.googleLogin(credentialResponse.credential);
      if (response && response.user) {
        registerUser(response.user);
        toast.success("Account created via Google! Welcome to BizPilot AI.");
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
    if (!formData.email || !formData.password || !formData.businessName || !formData.fullName) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.businessName,
        formData.businessType
      );
      if (response && response.user) {
        registerUser(response.user);
      }
      toast.success("Account created! Welcome to BizPilot AI.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Store / Business Name
        </label>
        <input
          type="text"
          required
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          placeholder="e.g. Verma General Store"
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Owner Full Name
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Amit Verma"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Business Type
          </label>
          <select
            value={formData.businessType}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
          >
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Work Email
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="owner@store.com"
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Create Password
        </label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="At least 8 characters"
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full mt-2 font-bold"
      >
        Register Free Account
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
          Already using BizPilot AI ?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}
