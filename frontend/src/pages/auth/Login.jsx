
// // src/pages/auth/Login.jsx
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { Link, Navigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";

// // ✅ assets
// import expressNotoryLogo from "../../assets/expressNotoryLogo.png";


// const SocialIcon = ({ label, children }) => (
//   <button
//     type="button"
//     aria-label={label}
//     className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-sm border border-black/10 flex items-center justify-center transition"
//   >
//     {children}
//   </button>
// );

// // simple inline svg icons (no extra packages)
// const FacebookIcon = () => (
//   <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
//     <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.6 1.7-1.6h1.7V4.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2h-3v3.2h3V22h2.8z" />
//   </svg>
// );

// const TwitterIcon = () => (
//   <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
//     <path d="M19.9 7.3c0 .2 0 .4-.1.6-.6 6.2-5.3 10.7-11.1 10.7-2.2 0-4.2-.7-5.9-1.9h.8c1.8 0 3.4-.6 4.7-1.6-1.6 0-3-1.1-3.5-2.6.2 0 .4.1.7.1.3 0 .6 0 .9-.1-1.7-.3-3-1.9-3-3.7v-.1c.5.3 1.1.5 1.7.5-1-.7-1.6-1.9-1.6-3.2 0-.7.2-1.3.5-1.9 1.9 2.3 4.8 3.8 8 4-.1-.3-.1-.6-.1-.9 0-2.1 1.7-3.8 3.8-3.8 1.1 0 2 .5 2.7 1.2.8-.2 1.6-.5 2.3-.9-.3.9-.9 1.6-1.7 2 .7-.1 1.4-.3 2.1-.6-.5.7-1 1.3-1.6 1.8z" />
//   </svg>
// );

// const YouTubeIcon = () => (
//   <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
//     <path d="M21.6 7.2s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C15.9 3.7 12 3.7 12 3.7h0s-3.9 0-6.7.3c-.4.1-1.3.1-2.1 1-.6.7-.8 2.2-.8 2.2S2 9 2 10.8v2.4c0 1.8.4 3.6.4 3.6s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 6.4.3 6.4.3s3.9 0 6.7-.3c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.4-1.8.4-3.6v-2.4c0-1.8-.4-3.6-.4-3.6zM10 14.9V8.9l6 3-6 3z" />
//   </svg>
// );

// const LinkedInIcon = () => (
//   <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
//     <path d="M6.5 6.8c0 1-.8 1.8-1.8 1.8S2.9 7.8 2.9 6.8 3.7 5 4.7 5s1.8.8 1.8 1.8zM3.3 21h2.8V9.2H3.3V21zM9.1 9.2h2.7v1.6h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V21h-2.8v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.1V9.2z" />
//   </svg>
// );

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const { login, loading, error, isAuthenticated, user } = useAuth();

//   const [form, setForm] = useState({ phone: "", password: "" });

//   // ✅ markasta oo error ka yimaado backend-ka → toast + UI
//   useEffect(() => {
//     if (error) toast.error(error);
//   }, [error]);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.phone || !form.password) {
//       toast.error("Fadlan buuxi Tel & Password");
//       return;
//     }

//     // Haddii aad rabto rememberMe, halkan ayaad ku diri kartaa ama localStorage ku kaydin kartaa
//     // await login({ ...form, rememberMe });
//     await login(form); // backend expects { phone, password }
//   };

//   /* ================= ROLE BASED REDIRECT ================= */
//   if (isAuthenticated && user) {
//     if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
//     if (user.role === "USER") return <Navigate to="/user" replace />;
//   }

//   return (
//   <div className="relative min-h-screen flex items-center justify-center  p-4 overflow-hidden">
//     {/* ✅ Background Logo (Watermark) */}


//     {/* ✅ Content Card */}
//     <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden border border-black/10">
//       <div className="grid grid-cols-1 md:grid-cols-2">
//         {/* ================= LEFT: BRAND ================= */}

// <div className="bg-black text-white p-10 flex flex-col justify-center items-center">

//   {/* ✅ BIG EXPRESS NOTORY LOGO */}
//   <img
//     src={expressNotoryLogo}
//     alt="ExpressNotory"
//     className="h-32 w-auto object-contain mb-8"
//   />

//   <h2 className="text-2xl md:text-3xl font-bold text-center">
//     Express Notory System
//   </h2>

//   <p className="text-sm text-gray-300 mt-3 text-center max-w-sm">
//     Maamul heshiisyada & adeegyada si fudud oo degdeg ah.
//   </p>

//   {/* social icons */}
//   <div className="mt-8 flex items-center gap-3">
//     <SocialIcon label="Facebook"><FacebookIcon /></SocialIcon>
//     <SocialIcon label="Twitter"><TwitterIcon /></SocialIcon>
//     <SocialIcon label="YouTube"><YouTubeIcon /></SocialIcon>
//     <SocialIcon label="LinkedIn"><LinkedInIcon /></SocialIcon>
//   </div>
// </div>

//         {/* ================= RIGHT: FORM ================= */}
//         <div className="p-8 md:p-12">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-black">Soo Dhowow</h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Fadlan gal akoon kaaga. Buuxi foomka hoose.
//             </p>
//           </div>

//           {error && (
//             <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Akoonka / Tel
//               </label>
//               <Input
//                 type="text"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="Gali telefoonkaaga"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Nambar sireed
//               </label>

//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Gali password kaaga"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((v) => !v)}
//                   className="absolute right-3 top-2.5 text-sm text-black/80 hover:text-black"
//                 >
//                   {showPassword ? "Qari" : "Muuji"}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
//                 />
//                 I xusuusnow
//               </label>

//               <Link to="/forgotpassword" className="text-sm text-black hover:underline">
//                 Ma ilowday lambarka sirta?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-xl font-semibold transition disabled:opacity-60"
//             >
//               {loading ? "Sug..." : "GAL"}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// };

// export default Login;



// src/pages/auth/Login.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

// ✅ assets
import hormuudLogo from "../../assets/hormuud.png";

import becoLogo from "../../assets/beco.png";

const SocialIcon = ({ label, children }) => (
  <button
    type="button"
    aria-label={label}
    className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-sm border border-black/10 flex items-center justify-center transition"
  >
    {children}
  </button>
);

// simple inline svg icons (no extra packages)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.6 1.7-1.6h1.7V4.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2h-3v3.2h3V22h2.8z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M19.9 7.3c0 .2 0 .4-.1.6-.6 6.2-5.3 10.7-11.1 10.7-2.2 0-4.2-.7-5.9-1.9h.8c1.8 0 3.4-.6 4.7-1.6-1.6 0-3-1.1-3.5-2.6.2 0 .4.1.7.1.3 0 .6 0 .9-.1-1.7-.3-3-1.9-3-3.7v-.1c.5.3 1.1.5 1.7.5-1-.7-1.6-1.9-1.6-3.2 0-.7.2-1.3.5-1.9 1.9 2.3 4.8 3.8 8 4-.1-.3-.1-.6-.1-.9 0-2.1 1.7-3.8 3.8-3.8 1.1 0 2 .5 2.7 1.2.8-.2 1.6-.5 2.3-.9-.3.9-.9 1.6-1.7 2 .7-.1 1.4-.3 2.1-.6-.5.7-1 1.3-1.6 1.8z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M21.6 7.2s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C15.9 3.7 12 3.7 12 3.7h0s-3.9 0-6.7.3c-.4.1-1.3.1-2.1 1-.6.7-.8 2.2-.8 2.2S2 9 2 10.8v2.4c0 1.8.4 3.6.4 3.6s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 6.4.3 6.4.3s3.9 0 6.7-.3c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.4-1.8.4-3.6v-2.4c0-1.8-.4-3.6-.4-3.6zM10 14.9V8.9l6 3-6 3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M6.5 6.8c0 1-.8 1.8-1.8 1.8S2.9 7.8 2.9 6.8 3.7 5 4.7 5s1.8.8 1.8 1.8zM3.3 21h2.8V9.2H3.3V21zM9.1 9.2h2.7v1.6h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V21h-2.8v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.1V9.2z" />
  </svg>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, loading, error, isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({ phone: "", password: "" });

  // ✅ markasta oo error ka yimaado backend-ka → toast + UI
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!form.phone || !form.password) {
        toast.error("Fadlan buuxi Tel & Password");
        return;
      }

      // Haddii aad rabto rememberMe, halkan ayaad ku diri kartaa ama localStorage ku kaydin kartaa
      // await login({ ...form, rememberMe });
      await login(form); // backend expects { phone, password }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Change password failed");

    }

  };

  /* ================= ROLE BASED REDIRECT ================= */
  if (isAuthenticated && user) {
    if (user.role === "SUPER_ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "USER") return <Navigate to="/user" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      {/* ✅ Big Card */}
      <div className="w-full max-w-8xl bg-white rounded-2xl shadow-xl overflow-hidden border border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* ================= LEFT: IMAGE / BRAND ================= */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-200 p-10 flex flex-col justify-center">
            {/* subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_1px)] [background-size:18px_18px]" />

            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Galid | Nootaayo Boqole
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-md">
                Fadlan gal akoonkaaga si aad u maamusho heshiisyada & adeegyada.
              </p>

              {/* logos */}
              {/* <div className="mt-10 flex items-center gap-6">
                <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-4 flex items-center justify-center">
                  <img
                    src={hormuudLogo}
                    alt="Hormuud"
                    className="h-12 w-auto object-contain"
                  />
                </div>

                <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-4 flex items-center justify-center">
                  <img
                    src={becoLogo}
                    alt="Beco"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </div> */}

              {/* social icons */}
              <div className="mt-10 flex items-center gap-3">
                <SocialIcon label="Facebook">
                  <FacebookIcon />
                </SocialIcon>
                <SocialIcon label="Twitter">
                  <TwitterIcon />
                </SocialIcon>
                <SocialIcon label="YouTube">
                  <YouTubeIcon />
                </SocialIcon>
                <SocialIcon label="LinkedIn">
                  <LinkedInIcon />
                </SocialIcon>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: FORM ================= */}
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-black">Soo Dhowow</h1>
              <p className="text-sm text-gray-600 mt-1">
                Fadlan gal akoon kaaga. Buuxi foomka hoose.
              </p>
            </div>

            {/* ✅ Error message backend-ka (inline) */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Akoonka / Tel
                </label>
                <Input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Gali telefoonkaaga"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nambar sireed
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Gali password kaaga"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-2.5 text-sm text-black/80 hover:text-black"
                  >
                    {showPassword ? "Qari" : "Muuji"}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  I xusuusnow
                </label>

                <Link
                  to="/forgotpassword"
                  className="text-sm text-black hover:underline"
                >
                  Ma ilowday lambarka sirta?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold transition disabled:opacity-60"
              >
                {loading ? "Sug..." : "GAL"}
              </Button>

              {/* footer small */}
              <p className="text-center text-xs text-gray-500 mt-6">

              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
