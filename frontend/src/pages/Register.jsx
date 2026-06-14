import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, TrendingUp, AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";

// ─── Password strength helper ─────────────────────────────────────────────────
const getStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
};

const strengthConfig = [
  { label: "Too weak",  color: "bg-red-500",    text: "text-red-400"    },
  { label: "Weak",      color: "bg-orange-500",  text: "text-orange-400" },
  { label: "Good",      color: "bg-yellow-400",  text: "text-yellow-400" },
  { label: "Strong",    color: "bg-emerald-500", text: "text-emerald-400"},
  { label: "Very strong", color: "bg-emerald-400", text: "text-emerald-400" },
];

// ─── Reusable input ───────────────────────────────────────────────────────────
function InputField({ label, icon: Icon, type = "text", value, onChange, placeholder, error, rightEl, autoComplete }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.6px] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-white/[0.05] border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200
            focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/30
            ${error
              ? "border-red-500/50 focus:ring-red-500/20"
              : "border-white/[0.09] focus:border-indigo-500/50"
            }
            ${rightEl ? "pr-11" : ""}`}
        />
        {rightEl}
      </div>
      {error && (
        <p className="text-red-400 text-[11.5px] mt-1.5 flex items-center gap-1">
          <AlertCircle size={11} className="flex-shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { checks, score } = getStrength(form.password);
  const strengthInfo = strengthConfig[score] || strengthConfig[0];

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (apiError) setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Enter your full name (min 2 characters).";
    if (!form.email.trim())
      e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.password)
      e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    else if (score < 2)
      e.password = "Choose a stronger password.";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords don't match.";
    if (!agreed)
      e.agreed = "You must agree to the terms to continue.";
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
      // const res = await axios.post("/api/auth/register", {
      //   name: form.name.trim(),
      //   email: form.email,
      //   password: form.password,
      // });
      // localStorage.setItem("token", res.data.token);

      // Demo: simulate API delay + duplicate email check
      await new Promise((r) => setTimeout(r, 900));

      const users = JSON.parse(localStorage.getItem("so_users") || "[]");
      if (users.find((u) => u.email === form.email))
        throw new Error("An account with this email already exists.");

      const newUser = { id: Date.now(), name: form.name.trim(), email: form.email, password: form.password };
      users.push(newUser);
      localStorage.setItem("so_users", JSON.stringify(users));

      const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, name: newUser.name }));
      localStorage.setItem("so_token", token);

      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const requirementItems = [
    { key: "length",  label: "At least 8 characters" },
    { key: "upper",   label: "One uppercase letter"   },
    { key: "number",  label: "One number"             },
    { key: "special", label: "One special character"  },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-indigo-600/10 blur-[130px]" />
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
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-slate-500 text-sm mt-1">Start forecasting with AI-powered insights</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-6">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-[13px]">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Full Name */}
            <InputField
              label="Full name"
              icon={User}
              value={form.name}
              onChange={set("name")}
              placeholder="Jane Smith"
              error={errors.name}
              autoComplete="name"
            />

            {/* Email */}
            <InputField
              label="Email address"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
            />

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
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                          i < score ? strengthInfo.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-medium ${strengthInfo.text}`}>
                    {strengthInfo.label}
                  </p>
                </div>
              )}

              {/* Password requirements */}
              {form.password.length > 0 && (
                <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1">
                  {requirementItems.map(({ key, label }) => (
                    <div key={key} className={`flex items-center gap-1.5 text-[11px] transition-colors ${checks[key] ? "text-emerald-400" : "text-slate-600"}`}>
                      {checks[key]
                        ? <CheckCircle2 size={11} className="flex-shrink-0" />
                        : <XCircle size={11} className="flex-shrink-0" />
                      }
                      {label}
                    </div>
                  ))}
                </div>
              )}

              {errors.password && (
                <p className="text-red-400 text-[11.5px] mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.6px] mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`w-full bg-white/[0.05] border rounded-xl pl-10 pr-11 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200
                    focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/30
                    ${errors.confirmPassword
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : form.confirmPassword && form.confirmPassword === form.password
                        ? "border-emerald-500/40 focus:ring-emerald-500/20"
                        : "border-white/[0.09] focus:border-indigo-500/50"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showConfirm ? "Hide" : "Show"}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {/* Match tick */}
                {form.confirmPassword && form.confirmPassword === form.password && (
                  <CheckCircle2 size={15} className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-400" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-[11.5px] mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) setErrors((p) => ({ ...p, agreed: "" }));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-white/20 bg-white/[0.05] peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all duration-150 flex items-center justify-center">
                    {agreed && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[13px] text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors" onClick={(e) => e.preventDefault()}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors" onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-red-400 text-[11.5px] mt-1.5 flex items-center gap-1 ml-6">
                  <AlertCircle size={11} /> {errors.agreed}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold
                shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:opacity-90
                active:scale-[0.985] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account →"
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-slate-600 text-xs">Already a member?</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Switch to login */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Sign in
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