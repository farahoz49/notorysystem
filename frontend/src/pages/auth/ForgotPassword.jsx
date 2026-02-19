// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { forgotPasswordApi } from "../../api/auth.api";

const isValidEmail = (v = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) return toast.error("Fadlan geli email-kaaga");
    if (!isValidEmail(cleanEmail)) return toast.error("Email-ka aad gelisay sax ma aha");

    try {
      setLoading(true);
      const res = await forgotPasswordApi({ email: cleanEmail });
      toast.success(res?.message || "Haddii account-ka jiro, link ayaa la diray ✅");

      // ✅ u gudub page-ka sharaxaada
      navigate("/check-email", { state: { email: cleanEmail } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Qalad ayaa dhacay");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-black/10 p-8">
        <h1 className="text-2xl font-bold text-black">Forgot Password</h1>
        <p className="text-sm text-gray-600 mt-1">
          Geli email-kaaga si laguuugu diro reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full py-3 rounded-xl">
            {loading ? "Sug..." : "Dir Reset Link"}
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-black hover:underline">
              Ku laabo Login
            </Link>
          </div>
        </form>

        <div className="mt-5 text-xs text-gray-500">
          Haddii aadan helin email-ka, ka fiiri <span className="font-semibold">Spam</span>.
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
