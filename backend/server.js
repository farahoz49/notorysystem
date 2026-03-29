import express from 'express';
import conectBD from './config/db.js';
import userRouter from './routes/UserRoute.js';
import cookieParser from 'cookie-parser';
import TokenRoute from './routes/TokenRoute.js';
import aggrementRoutes from './routes/agreementroutes.js';
import personRoutes from './routes/PersonRoutes.js';
import MootoRoutes from './routes/MootoRoutes.js';
import SaamiRoutes from './routes/SaamiRoutes.js';
import wakaladRoutes from './routes/wakaladRoutes.js';
import tasdiiqRoutes from './routes/tasdiiqRoutes.js';
import dhulBanaanRoutes from './routes/dhulBanaanRoutes.js';
import GuriDhisanRoutes from './routes/GuriDhisanRoutes.js';
import Wakaalad_Gaar_ahRoutes from './routes/Wakaalad_Gaar_ahRoute.js';
import baabuurRoutes from './routes/BaabuurRoute.js';
import wakaaladSaamiRoutes from "./routes/wakaaladSaamiroutes.js";
import nationalityRoutes from "./routes/nationalityRoutes.js";
import Daaminulmaal from "./routes/DaaminulmaalRoute.js";
import settingroutes from "./routes/settingroutes.js";
import shaqaleysiinRoutes from "./routes/shaqaleysiinroutes.js";
import xayiraadSaamiRoutes from "./routes/xayiraadSaamiRoutes.js";
import asasidShirkadRoutes from "./routes/asasidShirkadRoutes.js";
import sponsorshipRoutes from "./routes/sponsorshipRoutes.js";
import kiroRoute from "./routes/kiroRoute.js";
import damiinMobileRoutes from "./routes/damiinMobileRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use('/api/users', userRouter);
app.use('/api/transactions', aggrementRoutes);
app.use('/api/agreements', aggrementRoutes);
app.use("/api/persons", personRoutes);
app.use("/api/Mootos", MootoRoutes);
app.use("/api/Saamis", SaamiRoutes);
app.use("/api/wakaalads", wakaladRoutes);
app.use("/api/tasdiiqs", tasdiiqRoutes);
app.use("/api/dhul-banaan", dhulBanaanRoutes);
app.use("/api/GuriDhisan", GuriDhisanRoutes);
app.use("/api/Wakaalad_Gaar_ah", Wakaalad_Gaar_ahRoutes);
app.use("/api/baabuur", baabuurRoutes);
app.use("/api/daaminulmaal", Daaminulmaal);
app.use("/api/wakaalad-saami", wakaaladSaamiRoutes);
app.use("/api/Shaqaaleysiin", shaqaleysiinRoutes);
app.use("/api/XayiraadSaami", xayiraadSaamiRoutes);
app.use("/api/settings", settingroutes);
app.use("/api/nationalities", nationalityRoutes);
app.use('/api/forgetpassword', TokenRoute);
app.use("/api/asasidshirkad", asasidShirkadRoutes);
app.use("/api/Sponsorship", sponsorshipRoutes);
app.use("/api/Kireeyn", kiroRoute);
app.use("/api/damiinmobile", damiinMobileRoutes);

// frontend dist path
const frontendDistPath = path.join(__dirname, "../frontend/dist");

// serve frontend files
app.use(express.static(frontendDistPath));

// react routes
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

conectBD();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});