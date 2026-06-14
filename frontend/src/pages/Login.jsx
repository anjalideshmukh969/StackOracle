import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, TrendingUp, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (apiError) setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");

    try {
      // —— Replace with your real API call ——
      // const res = await axios.post("/api/auth/login", { email: form.email, password: form.password });
      // const { token, user } = res.data;
      // localStorage.setItem("token", token);

      // Demo: simulate API delay
      await new Promise((r) => setTimeout(r, 1000));

      // Demo: fake credential check against localStorage users
      const users = JSON.parse(localStorage.getItem("so_users") || "[]");
      const found = users.find((u) => u.email === form.email && u.password === form.password);
      if (!found) throw new Error("Invalid email or password.");

      const token = btoa(JSON.stringify({ id: found.id, email: found.email, name: found.name }));
      if (remember) localStorage.setItem("so_token", token);
      else sessionStorage.setItem("so_token", token);

      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-xl">

          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-[15px] leading-none">StockOracle</p>
              <p className="text-indigo-400 text-[10px] font-semibold tracking-[1.5px] uppercase mt-0.5">AI Forecasting</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-6">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-[13px]">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.6px] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className={`w-full bg-white/[0.05] border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200
                    focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/30
                    ${errors.email
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-white/[0.09] focus:border-indigo-500/50"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-[11.5px] mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.6px] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Your password"
                  className={`w-full bg-white/[0.05] border rounded-xl pl-10 pr-11 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200
                    focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/30
                    ${errors.password
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-white/[0.09] focus:border-indigo-500/50"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-[11.5px] mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.password}
                </p>
              )}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-white/20 bg-white/[0.05] peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all duration-150 flex items-center justify-center">
                    {remember && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[13px] text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-[13px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold
                shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:opacity-90
                active:scale-[0.985] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-slate-600 text-xs">New here?</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Switch to register */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Create one free
            </Link>
          </p>

        </div>

        {/* Footer note */}
        <p className="text-center text-slate-700 text-xs mt-6">
          Protected by 256-bit encryption · StockOracle © {new Date().getFullYear()}
        </p>

      </div>
    </div>
  );
}