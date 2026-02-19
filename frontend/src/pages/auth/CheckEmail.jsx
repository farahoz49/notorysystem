// src/pages/auth/CheckEmail.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

const CheckEmail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-black/10 p-8">
        <h1 className="text-2xl font-bold text-black">Hubi Email-kaaga</h1>

        <p className="text-sm text-gray-600 mt-2 leading-6">
          Waxaan kuu dirnay <span className="font-semibold">Reset Link</span>.
          {email ? (
            <>
              <br />
              Email: <span className="font-semibold text-black">{email}</span>
            </>
          ) : null}
        </p>

        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <div className="p-3 rounded-lg bg-gray-50 border">
            <div className="font-semibold text-black">Tallaabooyinka:</div>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Tag email-kaaga (Gmail ama email provider-kaaga).</li>
              <li>Raadi email-ka “Reset Password - Boqole Notary”.</li>
              <li>Haddii uusan muuqan, ka fiiri “Spam / Junk”.</li>
              <li>Riix “Reset Password” link-ga ku jira email-ka.</li>
              <li>Waxaad galeysaa page aad ku qori karto password cusub.</li>
            </ol>
          </div>

          <div className="text-xs text-gray-500">
            Link-ga reset-ka wuxuu shaqeynayaa <span className="font-semibold">10 daqiiqo</span>.
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1" onClick={() => navigate("/forgot-password")}>
            Dib u Dir
          </Button>
          <Link className="flex-1" to="/login">
            <Button className="w-full" variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
