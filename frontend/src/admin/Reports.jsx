// src/pages/Report.jsx
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { formatDate } from "../helpers/formatDate";
import { getAgreementsReportApi } from "../api/reports.api";
import { getAllUsersApi } from "../api/users.api";

const selectClass =
  "px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-black focus:border-black w-full";

const Report = () => {
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === "ADMIN";

  const today = new Date().toISOString().slice(0, 10);

  // ✅ Filters
  const [office, setOffice] = useState("Main office");
  const [service, setService] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [createdBy, setCreatedBy] = useState("all"); // admin only

  // ✅ Data
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({ officeFee: 0 });
  const [loading, setLoading] = useState(false);

  // ✅ marka hore ha soo bandhigin
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ admin users
  const [users, setUsers] = useState([]);

  // Load users for admin dropdown
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const u = await getAllUsersApi();
        setUsers(u || []);
      } catch (e) {
        console.log("getAllUsersApi error:", e);
      }
    })();
  }, [isAdmin]);

  const titleRange = useMemo(() => {
    if (!from || !to) return "";
    const f = new Date(from);
    const t = new Date(to);
    const fmt = (d) =>
      d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    return `Tr. Inta u dhaxeysa ${fmt(f)} - ${fmt(t)}`;
  }, [from, to]);

  const handleSearch = async () => {
    if (!from || !to) {
      toast.error("Fadlan dooro: laga bilaabo & ilaa taariikh");
      return;
    }

    setLoading(true);
    try {
      const data = await getAgreementsReportApi({
        from,
        to,
        service,
        createdBy: isAdmin ? createdBy : undefined,
      });

      setRows(data?.rows || []);
      setTotals(data?.totals || { officeFee: 0 });
      setHasSearched(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Report fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setOffice("Main office");
    setService("all");
    setFrom("");
    setTo("");
    setCreatedBy("all");
    setRows([]);
    setTotals({ officeFee: 0 });
    setHasSearched(false);
  };

  const exportPDF = () => {
    if (!hasSearched) {
      toast.error("Marka hore Raadi samee si PDF loo sameeyo");
      return;
    }

    // ✅ HAL DOC KALIYA (A4 Portrait, mm)
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    // ===== HEADER =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Mashruucyada", 10, 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(office, 10, 22);
    if (titleRange) doc.text(titleRange, 10, 28);

    const userText = isAdmin
      ? `User: ${createdBy === "all"
        ? "Dhamaan"
        : users.find((u) => u._id === createdBy)?.username || createdBy
      }`
      : `User: ${user?.username || ""}`;

    doc.text(userText, 10, 34);
    doc.text(`Adeega: ${service === "all" ? "Dhamaan" : service}`, 10, 40);

    // ===== TABLE BODY =====
    const body = rows.map((r, idx) => [
      String(idx + 1),
      r.refNo || "",
      r.service || "",
      r.daraf1 || "",
      r.daraf2 || "",
      //  String(r.officeFee ?? 0),
      formatDate(r.taariikh),
      ...(isAdmin ? [r.createdBy || ""] : []),
    ]);

    autoTable(doc, {
      startY: 45, // ✅ header ka dib (mm)
      head: [[
        "S/N",
        "Rep. Nambar",
        "Adeega",
        "Darafka 1aad",
        "Darafka 2aad",
        // "Khidmada",
        "Taariikh",
        ...(isAdmin ? ["CreatedBy"] : []),
      ]],
      body,

      // ✅ A4 settings
      margin: { top: 15, left: 10, right: 10, bottom: 15 },
      pageBreak: "auto",
      rowPageBreak: "avoid",

      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: { fillColor: [0, 0, 0], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },

      // ✅ widths (A4 portrait)
      columnStyles: {
        0: { cellWidth: 10 },  // S/N
        1: { cellWidth: 30 }, // Ref
        2: { cellWidth: 18 }, // Service
        3: { cellWidth: 38 }, // Daraf1
        4: { cellWidth: 38 }, // Daraf2
        // 5: { cellWidth: 16, halign: "right" }, // Fee
        6: { cellWidth: 25 }, // Date
        ...(isAdmin ? { 7: { cellWidth: 22 } } : {}), // CreatedBy
      },
    });

    // ===== TOTALS =====
    const finalY = doc.lastAutoTable?.finalY || 45;
    const y = Math.min(finalY + 8, 280); // A4 height ~297mm

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const totalFeeText = isAdmin ? (totals?.officeFee ?? 0) : 0;
    doc.text(`Wadar Khidmada: ${totalFeeText}`, 10, y);

    doc.save(`Mashruucyada_${from}_${to}.pdf`);
  };
  return (
    <div className="max-w-8xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-5 mb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Warbixinta</h2>
            <p className="text-sm text-gray-600">
              {titleRange || "Dooro filter-ka kadib raadi"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading} className="px-8">
              {loading ? "Loading..." : "Raadi"}
            </Button>
            <Button onClick={resetAll} className="px-8">
              Nadiifi
            </Button>
            <Button onClick={exportPDF} disabled={!hasSearched} className="px-8">
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Filters (nidaamsan sida aad rabtay) */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <input type="radio" checked readOnly />
          <span className="text-sm font-medium">Mashruuc yada</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Office */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Dooro Xafiis</label>
            <select className={selectClass} value={office} onChange={(e) => setOffice(e.target.value)}>
              <option value="Main office">Main office</option>
            </select>
          </div>

          {/* Service */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Adeega</label>
            <select className={selectClass} value={service} onChange={(e) => setService(e.target.value)}>
              <option value="all">Dhamaan</option>
              <option value="Wareejin">Wareejin</option>
              <option value="Wakaalad">Wakaalad</option>
              <option value="Damaanad">Damaanad</option>
              <option value="Caddeyn">Caddeyn</option>
              <option value="Heshiisyo">Heshiisyo / Xeerar</option>
            </select>
          </div>

          {/* User (Admin only) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">User</label>
            <select
              className={selectClass}
              value={isAdmin ? createdBy : "mine"}
              onChange={(e) => setCreatedBy(e.target.value)}
              disabled={!isAdmin}
            >
              {isAdmin ? (
                <>
                  <option value="all">Dhamaan</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username}
                    </option>
                  ))}
                </>
              ) : (
                <option value="mine">{user?.username}</option>
              )}
            </select>
          </div>

          {/* From */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">laga bilaabo taariikh</label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>

          {/* To */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">ilaa taariikh</label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          {/* Quick buttons */}
          {/* <div className="flex gap-2 items-end">
            <button
              type="button"
              onClick={() => {
                setFrom(today);
                setTo(today);
              }}
              className="px-4 py-2 rounded-xl border border-black/20 bg-white text-black hover:bg-black hover:text-white transition"
            >
              Maanta
            </button>

            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const start = new Date();
                start.setDate(now.getDate() - 7);
                setFrom(start.toISOString().slice(0, 10));
                setTo(now.toISOString().slice(0, 10));
              }}
              className="px-4 py-2 rounded-xl border border-black/20 bg-white text-black hover:bg-black hover:text-white transition"
            >
              Isbuucan
            </button>
          </div> */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">S/N</th>
                <th className="p-3 text-left whitespace-nowrap">Rep. Nambar</th>
                <th className="p-3 text-left whitespace-nowrap">Adeega</th>
                <th className="p-3 text-left whitespace-nowrap">Darafka 1aad</th>
                <th className="p-3 text-left whitespace-nowrap">Darafka 2aad</th>
                <th className="p-3 text-left whitespace-nowrap">Khidmada</th>
                <th className="p-3 text-left whitespace-nowrap">Taariikh</th>
                {isAdmin && <th className="p-3 text-left whitespace-nowrap">CreatedBy</th>}
              </tr>
            </thead>

            <tbody>
              {!hasSearched && (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="text-center p-10 text-gray-500">
                    Fadlan dooro filter-ka (taariikh + adeeg) kadib taabo <b>Raadi</b>.
                  </td>
                </tr>
              )}

              {hasSearched &&
                rows.map((r, idx) => (
                  <tr key={r._id} className="border-t border-black/10 hover:bg-black/5">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3 font-semibold">{r.refNo}</td>
                    <td className="p-3">{r.service}</td>
                    <td className="p-3 text-gray-800">{r.daraf1}</td>
                    <td className="p-3 text-gray-800">{r.daraf2}</td>
                    <td className="p-3">{r.officeFee}</td>
                    <td className="p-3">{formatDate(r.taariikh)}</td>
                    {isAdmin && <td className="p-3">{r.createdBy}</td>}
                  </tr>
                ))}

              {hasSearched && rows.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="text-center p-10 text-gray-500">
                    Wax xog ah lama helin (date/service/user filters).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasSearched && (
          <div className="p-4 border-t border-black/10 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Total Records: <span className="font-semibold text-black">{rows.length}</span>
            </div>
            <div className="text-sm text-gray-700">
              Wadar Khidmada:{" "}
              <span className="font-bold text-black">
                {isAdmin ? (totals?.officeFee ?? 0) : 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;