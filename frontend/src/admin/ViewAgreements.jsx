import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { formatDate } from "../components/numberToSomaliWords";
import { getAgreements } from "../api/reception.api";
import { deleteAgreement } from "../api/agreements.api";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const PAGE_SIZE = 100;

const selectClass =
  "px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-black focus:border-black";

const ViewAgreements = () => {
  const [agreements, setAgreements] = useState([]);

  // search & filter states
  const [searchBy, setSearchBy] = useState("refNo");
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [searchInput, setSearchInput] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";

  // ================= FETCH AGREEMENTS =================
  const fetchAgreements = async () => {
    try {
      const data = await getAgreements();
      setAgreements(data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch agreements");
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  // ================= SEARCH =================
  const handleSearch = () => {
    setSearchText(searchInput.trim());
    setCurrentPage(1);
  };

  // Enter key search
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // ================= DATE FILTER LOGIC =================
  const isInDateRange = (dateStr) => {
    if (!dateStr || dateFilter === "all") return true;

    const date = new Date(dateStr);
    const now = new Date();

    if (dateFilter === "today") {
      return date.toDateString() === now.toDateString();
    }

    if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo && date <= now;
    }

    if (dateFilter === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    return true;
  };

  // ================= FILTER + SEARCH + SORT =================
  const filteredAgreements = useMemo(() => {
    const text = searchText.toLowerCase();

    return (agreements || [])
      .filter((a) => {
        if (!isInDateRange(a.agreementDate)) return false;
        if (!text) return true;

        switch (searchBy) {
          case "refNo":
            return a.refNo?.toLowerCase().includes(text);

          case "ujeedo":
            return (
              a.agreementType?.toLowerCase().includes(text) ||
              a.serviceType?.toLowerCase().includes(text)
            );

          case "seller":
            return a.dhinac1?.sellers?.some((s) =>
              s.fullName?.toLowerCase().includes(text)
            );

          case "buyer":
            return a.dhinac2?.buyers?.some((b) =>
              b.fullName?.toLowerCase().includes(text)
            );

          default:
            return true;
        }
      })
      // latest first (refNo desc)
      .sort((a, b) => (b.refNo || "").localeCompare(a.refNo || ""));
  }, [agreements, searchBy, searchText, dateFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.max(1, Math.ceil(filteredAgreements.length / PAGE_SIZE));

  const paginatedData = filteredAgreements.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // if filter reduces pages, keep currentPage valid
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Ma hubtaa inaad delete gareynayso heshiiskan?")) return;

    try {
      await deleteAgreement(id);
      toast.success("Agreement deleted");
      fetchAgreements();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete agreement");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-5 mb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Agreements</h2>
            {/* <p className="text-sm text-gray-500">
              Ka raadi refNo, ujeeddo, seller ama buyer — kadibna filter date.
            </p> */}
          </div>

          {/* <div className="text-sm text-gray-600">
            Total: <span className="font-semibold text-black">{filteredAgreements.length}</span>
          </div> */}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Search By</label>
            <select
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
                setCurrentPage(1);
              }}
              className={selectClass}
            >
              <option value="refNo">Ref No</option>
              <option value="ujeedo">Ujeeddo</option>
              <option value="seller">Darafka Kowaad (Seller)</option>
              <option value="buyer">Darafka Labaad (Buyer)</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Search</label>
            <Input
              type="text"
              placeholder="Qor wax aad raadinayso..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSearch} className="px-8">
              Search
            </Button>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={selectClass}
              >
                <option value="all">Dhammaan</option>
                <option value="today">Maanta</option>
                <option value="week">Isbuucan</option>
                <option value="month">Bishan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Ref No</th>
                <th className="p-3 text-left whitespace-nowrap">Ujeeddo</th>
                <th className="p-3 text-left whitespace-nowrap">Darafka Kowaad</th>
                <th className="p-3 text-left whitespace-nowrap">Darafka Labaad</th>
                <th className="p-3 text-left whitespace-nowrap">Taarikh</th>
                {isAdmin && <th className="p-3 text-left whitespace-nowrap">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((a) => (
                <tr key={a._id} className="border-t border-black/10 hover:bg-black/5">
                  <td className="p-3">
                    <Link
                      to={`/agreement/${a._id}`}
                      className="font-semibold text-black underline underline-offset-4 hover:opacity-80"
                    >
                      {a.refNo}
                    </Link>
                  </td>

                  <td className="p-3">
                    <span className="font-medium text-black">
                      {a.agreementType} {a.serviceType}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">
                    {a.dhinac1?.sellers?.map((s) => s.fullName).join(", ") || "N/A"}
                  </td>

                  <td className="p-3 text-gray-700">
                    {a.dhinac2?.buyers?.map((b) => b.fullName).join(", ") || "N/A"}
                  </td>

                  <td className="p-3 text-gray-700">{formatDate(a.agreementDate)}</td>

                  {isAdmin && (
                    <td className="p-3">
                      <Button
                        variant="danger"
                        className="px-4 py-2 rounded-xl"
                        onClick={() => handleDelete(a._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="text-center p-6 text-gray-500">
                    lama helin wax xog ah
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-4 border-t border-black/10">
          <span className="text-sm text-gray-700">
            Page <span className="font-semibold text-black">{currentPage}</span> of{" "}
            <span className="font-semibold text-black">{totalPages}</span>
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl border border-black/20 bg-white text-black hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl border border-black/20 bg-white text-black hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAgreements;
