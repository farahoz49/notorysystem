// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { useSelector } from "react-redux";

// ✅ API Layer (axios toos ah ha isticmaalin)
import {
  getDashboardCurrentMonthApi,
  getAgreementsCurrentMonthApi,
} from "../api/dashboard.api.jsx";

// ✅ Black & White palette (grayscale)
const BW_COLORS = ["#111827", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB"];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";

  const [loading, setLoading] = useState(true);

  // data from backend
  const [month, setMonth] = useState("");
  const [totals, setTotals] = useState({ totalFee: 0, totalAgreements: 0 });
  const [serviceData, setServiceData] = useState([]);
  const [latest, setLatest] = useState([]);

  // optional: haddii aad rabto list full agreements current month
  const [agreements, setAgreements] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      // ✅ hal call (dashboard endpoint) — waa kan ugu muhiimsan
      const dash = await getDashboardCurrentMonthApi();
      setMonth(dash?.month || "");
      setTotals(dash?.totals || { totalFee: 0, totalAgreements: 0 });
      setServiceData(dash?.serviceData || []);
      setLatest(dash?.latest || []);

      // OPTIONAL: haddii aad u baahan tahay agreements full (charts kale)
      // const ags = await getAgreementsCurrentMonthApi();
      // setAgreements(ags || []);
    } catch (err) {
      console.error("Error fetching dashboard current month:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== CHARTS EXTRA (haddii aad rabto trend/area based on latest only) =====
  const feeLineData = useMemo(() => {
    // latest waa 5 kaliya; haddii aad rabto 10+ trend, soo qaado agreements current month
    const source = agreements.length ? agreements : latest;

    return source
      .slice()
      .sort((a, b) => new Date(a.agreementDate) - new Date(b.agreementDate))
      .map((a) => ({
        date: new Date(a.agreementDate).toLocaleDateString(),
        fee: Number(a.officeFee || 0),
        type: a.service,
      }))
      .slice(-10);
  }, [agreements, latest]);

  const monthlyChartData = useMemo(() => {
    // haddii agreements empty yahay, chart-kan wuu yara noqon karaa
    const source = agreements.length ? agreements : latest;

    const grouped = source.reduce((acc, a) => {
      const d = new Date(a.agreementDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!acc[key]) acc[key] = { month: key, agreements: 0, fees: 0 };
      acc[key].agreements += 1;
      acc[key].fees += Number(a.officeFee || 0);
      return acc;
    }, {});

    return Object.values(grouped).slice(-6);
  }, [agreements, latest]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-black flex items-center gap-3">
            <FaChartLine className="text-black" />
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Month: <span className="font-medium text-black">{month || "—"}</span>
          </p>
        </div>
      </div>

      {/* SERVICES CARDS (from backend serviceData) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {(serviceData || []).map((s, idx) => (
          <ServiceStat key={idx} title={s.name} value={s.value} />
        ))}
      </div>

      {/* ADMIN ONLY */}
      {isAdmin && (
        <>
          {/* Totals */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ServiceStat
              title="Total Revenue"
              value={`$${Number(totals.totalFee || 0).toLocaleString()}`}
              variant="revenue"
            />
            <ServiceStat
              title="Total Agreements"
              value={Number(totals.totalAgreements || 0)}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-black">
                <span>📊</span>
                Agreements by Service
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fill: "#111827" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#111827" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#111827" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-black">
                <span>🥧</span>
                Service Distribution
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={(serviceData || []).filter((d) => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={105}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {(serviceData || []).map((_, i) => (
                      <Cell key={i} fill={BW_COLORS[i % BW_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend Charts (optional) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-black">
                <span>📈</span>
                Revenue Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={feeLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fill: "#111827" }} />
                  <YAxis tick={{ fill: "#111827" }} />
                  <Tooltip formatter={(value) => [`$${value}`, "Fee"]} />
                  <Legend />
                  <Line type="monotone" dataKey="fee" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              {!agreements.length && (
                <p className="text-xs text-gray-500 mt-2">
                  (Trend-kan wuxuu ku saleysan yahay latest kaliya. Haddii aad rabto trend buuxa, enable
                  getAgreementsCurrentMonthApi.)
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-black">
                <span>📅</span>
                Monthly Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fill: "#111827" }} />
                  <YAxis tick={{ fill: "#111827" }} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "fees" ? `$${value}` : value,
                      name === "fees" ? "Fees" : "Agreements",
                    ]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="agreements" stroke="#111827" fill="#111827" fillOpacity={0.12} />
                  <Area type="monotone" dataKey="fees" stroke="#374151" fill="#374151" fillOpacity={0.12} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions + Latest (backend already gives latest) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 text-black">⚡ Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/reception" className="bg-black text-white p-4 rounded-xl hover:bg-gray-900 text-center transition">
                  New reception
                </Link>
                <Link to="/agreements" className="bg-white text-black border border-black/15 p-4 rounded-xl hover:bg-gray-50 text-center transition">
                  View All Agreements
                </Link>
                <Link to="/Reports" className="bg-white text-black border border-black/15 p-4 rounded-xl hover:bg-gray-50 text-center transition">
                  Reports
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-black">📋 Latest Agreements</h3>
                <Link to="/agreements" className="text-black hover:underline text-sm">
                  View All →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Ref No</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Service</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Fee</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(latest || []).map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50 transition">
                        <td className="p-3 font-medium text-black">
                          <Link to={`/agreement/${a._id}`} className="hover:underline">
                            {a.refNo}
                          </Link>
                        </td>
                        <td className="p-3 text-gray-800">{a.service}</td>
                        <td className="p-3 font-medium text-black">${a.officeFee || 0}</td>
                        <td className="p-3 text-gray-600">{new Date(a.agreementDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {!latest?.length && (
                      <tr>
                        <td className="p-3 text-gray-500" colSpan={4}>
                          No agreements found for this month.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ===== SERVICE STAT ===== */
const ServiceStat = ({ title, value, variant }) => {
  const base =
    "bg-white rounded-2xl border border-black/10 shadow-sm p-4 text-center hover:shadow transition";

  const pill =
    variant === "revenue"
      ? "text-black bg-gray-50 border border-black/10"
      : "text-black bg-white border border-black/10";

  return (
    <div className={base}>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-2xl font-bold px-2 py-1 rounded-xl ${pill}`}>{value}</p>
    </div>
  );
};

export default Dashboard;