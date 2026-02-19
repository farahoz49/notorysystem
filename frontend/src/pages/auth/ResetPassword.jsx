import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { resetPasswordApi } from "../../api/auth.api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return toast.error("Token ma helin. Link-ga sax ma aha.");
    if (password !== confirm) return toast.error("Password-ka isma la mid aha");

    try {
      setLoading(true);
      const res = await resetPasswordApi(token, password);
      toast.success(res?.message || "Password waa la beddelay ✅");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Link-ga wuu dhacay ama qalad ayaa dhacay");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-black/10 p-8">
        <h1 className="text-2xl font-bold text-black">Reset Password</h1>
        <p className="text-sm text-gray-600 mt-1">Geli password cusub.</p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Cusub</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xaqiiji Password</label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full py-3 rounded-xl">
            {loading ? "Sug..." : "Beddel Password"}
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-black hover:underline">
              Ku laabo Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
