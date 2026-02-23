import { useState } from "react";
import toast from "react-hot-toast";
import { changePasswordApi } from "../../api/auth.api"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return toast.error("Fadlan buuxi dhammaan fields-ka");
    }

    if (form.newPassword.length < 6) {
      return toast.error("Password cusub ugu yaraan 6 xaraf ha noqdo");
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Password-yada cusub isma la mid aha");
    }

    try {
      setLoading(true);
      const res = await changePasswordApi(form);
      toast.success(res?.message || "Password waa la beddelay ");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      toast.error(error?.response?.data?.message || "Change password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-2 text-black">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Si ammaan ah u beddel password-kaaga.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            type={show ? "text" : "password"}
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
          />

          <Input
            type={show ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
          />

          <Input
            type={show ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={show}
                onChange={() => setShow(!show)}
              />
              Show Password
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;