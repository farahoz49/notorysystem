import React, { useEffect, useState } from "react";
import axios from "axios";
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

// ✅ Black & White palette (grayscale)
const BW_COLORS = ["#111827", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB"];

const Dashboard = () => {
  const [agreements, setAgreements] = useState([]);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPersons: 0,
    todayAgreements: 0,
    weekAgreements: 0,
    monthAgreements: 0,
    totalFee: 0,
  });

  const [dateFilter, setDateFilter] = useState("all");
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [agreementsRes, personsRes] = await Promise.all([
        axios.get(`/api/agreements?filter=${dateFilter}`),
        axios.get("/api/persons"),
      ]);

      const ags = agreementsRes.data || [];
      const prs = personsRes.data || [];

      setAgreements(ags);
      setPersons(prs);
      calculateStats(ags, prs);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (agreementList, personsList) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const todayCount = agreementList.filter((a) => new Date(a.agreementDate) >= today).length;
    const weekCount = agreementList.filter((a) => new Date(a.agreementDate) >= weekAgo).length;
    const monthCount = agreementList.filter((a) => new Date(a.agreementDate) >= monthAgo).length;

    const totalFee = agreementList.reduce((sum, a) => sum + Number(a.officeFee || 0), 0);

    setStats({
      totalPersons: personsList.length,
      todayAgreements: todayCount,
      weekAgreements: weekCount,
      monthAgreements: monthCount,
      totalFee,
    });
  };

  // ===== HELPERS =====
  const countByService = (service) => agreements.filter((a) => a.service === service).length;

  // ===== CHART DATA =====
  const serviceData = [
    { name: "Wareejin", value: countByService("Wareejin") },
    { name: "Wakaalad", value: countByService("Wakaalad") },
    { name: "Damaanad", value: countByService("Damaanad") },
    { name: "Caddeyn", value: countByService("Caddeyn") },
    { name: "Heshiisyo", value: countByService("Heshiisyo") },
    { name: "Rahan", value: countByService("Rahan") },
  ];

  const feeLineData = agreements
    .slice()
    .sort((a, b) => new Date(a.agreementDate) - new Date(b.agreementDate))
    .map((a) => ({
      date: new Date(a.agreementDate).toLocaleDateString(),
      fee: Number(a.officeFee || 0),
      type: a.service,
    }))
    .slice(-10);

  const monthlyData = agreements.reduce((acc, agreement) => {
    const date = new Date(agreement.agreementDate);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!acc[monthYear]) acc[monthYear] = { month: monthYear, agreements: 0, fees: 0 };

    acc[monthYear].agreements += 1;
    acc[monthYear].fees += Number(agreement.officeFee || 0);
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData).slice(-6);

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
        <h2 className="text-3xl font-bold text-black flex items-center gap-3">
          <FaChartLine className="text-black" />
          Dashboard Overview
        </h2>
      </div>

      {/* USER + ADMIN: 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <ServiceStat title="Wareejin" value={countByService("Wareejin")} />
        <ServiceStat title="Wakaalad" value={countByService("Wakaalad")} />
        <ServiceStat title="Damaanad" value={countByService("Damaanad")} />
        <ServiceStat title="Caddeyn" value={countByService("Caddeyn")} />
        <ServiceStat title="Heshiisyo" value={countByService("Heshiisyo")} />
        <ServiceStat title="Rahan" value={countByService("Rahan")} />
      </div>

      {/* ADMIN ONLY */}
      {isAdmin && (
        <>
          {/* Total Revenue */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ServiceStat title="Total Revenue" value={`$${stats.totalFee.toLocaleString()}`} variant="revenue" />
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
                    data={serviceData.filter((d) => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={105}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {serviceData.map((_, i) => (
                      <Cell key={i} fill={BW_COLORS[i % BW_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend Charts */}
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

          {/* Quick Actions + Latest */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 text-black">⚡ Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/reception"
                  className="bg-black text-white p-4 rounded-xl hover:bg-gray-900 text-center transition"
                >
                  New reception
                </Link>
                <Link
                  to="/agreement"
                  className="bg-white text-black border border-black/15 p-4 rounded-xl hover:bg-gray-50 text-center transition"
                >
                  View All Agreements
                </Link>
                <Link
                  to="/Reports"
                  className="bg-white text-black border border-black/15 p-4 rounded-xl hover:bg-gray-50 text-center transition"
                >
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
                    {agreements.slice(0, 5).map((a) => (
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