// src/pages/Users.jsx
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useSelector } from "react-redux";
import { getUsers ,registerUser,

  updateUserById,
  deleteUserById,
  approveUserById,
  deactivateUserById,
 } from "../api/users.api";


const Users = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // query states
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // selected (bulk)
  const [selectedIds, setSelectedIds] = useState([]);

  // simple modal-ish form states
  const [mode, setMode] = useState(null); // null | "add" | "edit"
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "USER",
    status: "active",
    password: "",
    confirmPassword: "",
  });

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      admin: users.filter((u) => u.role === "ADMIN").length,
      user: users.filter((u) => u.role === "USER").length,
    };
  }, [users]);

  const fetchUsers = async (page = pagination.page) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit, search, sort, order };
      const data = await getUsers(params);

      setUsers(data?.data || []);
      if (data?.pagination) setPagination(data.pagination);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, order]);

  // helpers
  const resetForm = () =>
    setForm({
      username: "",
      email: "",
      phone: "",
      role: "USER",
      status: "active",
      password: "",
      confirmPassword: "",
    });

  const openAdd = () => {
    resetForm();
    setSelectedUser(null);
    setMode("add");
  };

  const openEdit = (u) => {
    setSelectedUser(u);
    setForm({
      username: u.username || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "USER",
      status: u.status || "active",
      password: "",
      confirmPassword: "",
    });
    setMode("edit");
  };

  const validateAdd = () => {
    if (!form.username.trim()) return "Username is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.password) return "Password is required";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const validateEdit = () => {
    if (!form.username.trim()) return "Username is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.phone.trim()) return "Phone is required";
    return null;
  };

  // actions
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "add") {
        const err = validateAdd();
        if (err) return toast.error(err);

        const payload = {
          username: form.username,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: "active",
          password: form.password,
        };

        const res = await registerUser(payload);
        toast.success(res?.message || "User created");
        setMode(null);
        resetForm();
        fetchUsers(1);
      }

      if (mode === "edit" && selectedUser?._id) {
        const err = validateEdit();
        if (err) return toast.error(err);

        const payload = {
          username: form.username,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: form.status,
        };

        const res = await updateUserById(selectedUser._id, payload);
        toast.success(res?.message || "User updated");
        setMode(null);
        setSelectedUser(null);
        fetchUsers(pagination.page);
      }
    } catch (e2) {
      toast.error(e2?.response?.data?.message || "Request failed");
    }
  };

  const onDelete = async (u) => {
    if (!window.confirm(`Delete ${u.username}?`)) return;
    try {
      const res = await deleteUserById(u._id);
      toast.success(res?.message || "User deleted");
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const onBulkDelete = async () => {
    if (selectedIds.length === 0) return toast.error("Select users first");
    if (!window.confirm(`Delete ${selectedIds.length} users?`)) return;

    try {
      await Promise.all(selectedIds.map((id) => deleteUserById(id)));
      toast.success("Deleted successfully");
      setSelectedIds([]);
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Bulk delete failed");
    }
  };

  const onApprove = async (id) => {
    try {
      const res = await approveUserById(id);
      toast.success(res?.message || "Activated");
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Activate failed");
    }
  };

  const onDeactivate = async (id) => {
    try {
      const res = await deactivateUserById(id);
      toast.success(res?.message || "Deactivated");
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Deactivate failed");
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === users.length) setSelectedIds([]);
    else setSelectedIds(users.map((u) => u._id));
  };

  const changePage = (p) => {
    if (p < 1 || p > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: p }));
    fetchUsers(p);
  };

  const StatusChip = ({ status }) => {
    const isActive = String(status || "").toLowerCase() === "active";
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border
          ${isActive ? "bg-white text-black border-black/30" : "bg-gray-100 text-gray-800 border-black/20"}`}
      >
        {isActive ? "active" : "inactive"}
      </span>
    );
  };

  const RoleChip = ({ role }) => {
    const isAdmin = String(role || "").toUpperCase() === "ADMIN";
    return (
     <span
  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border
    ${
      role === "SUPER_ADMIN"
        ? "bg-black text-white border-black"
        : role === "ADMIN"
        ? "bg-gray-200 text-black border-black/30"
        : "bg-white text-black border-black/30"
    }`}
>
  {role}
</span>
    );
  };
  const visibleUsers =
    currentUser?.role === "ADMIN"
      ? users.filter((u) => u.role !== "SUPER_ADMIN")
      : users;

  return (
    
    <div className="max-w-8xl mx-auto p-6">

      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black">Users</h2>
          
        </div>

        <div className="flex gap-2">
          <Button
            onClick={openAdd}
            className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900 active:scale-[0.99] transition"
          >
            + Add User
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="border border-black/10 rounded-2xl overflow-x-auto bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading...</div>
        ) : visibleUsers.length === 0 ? (
          <div className="p-3 text-center text-gray-600">No users found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-black/10">
              <tr className="text-left text-sm text-gray-700">
                <th className="p-3">#</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map((u, index) => (
                <tr key={u._id} className="border-t border-black/5 text-sm hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-black">{index + 1}</td>
                  <td className="p-3 font-medium text-black">{u.username}</td>
                  <td className="p-3 text-gray-800">{u.email}</td>
                  <td className="p-3 text-gray-800">{u.phone}</td>

                  <td className="p-3">
                    <RoleChip role={u.role} />
                  </td>

                  <td className="p-3">
                    <StatusChip status={u.status} />
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </Button>

                      {u.status === "inactive" ? (
                        <Button
                          onClick={() => onApprove(u._id)}
                        >
                          On
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onDeactivate(u._id)}
                        >
                          Off
                        </Button>
                      )}

                     <Button
  onClick={() => u.role !== "SUPER_ADMIN" && onDelete(u)}
  disabled={u.role === "SUPER_ADMIN"}
  className={`px-3 py-1.5 rounded-lg transition
    ${
      u.role === "SUPER_ADMIN"
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-black text-white hover:bg-gray-900"
    }`}
>
  Delete
</Button>
                     
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* pagination */}
        {pagination.pages > 1 && (
          <div className="p-3 border-t border-black/10 flex items-center justify-between text-sm text-gray-700">
            <div>
              Page {pagination.page} / {pagination.pages} • Total {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 border border-black/20 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1.5 border border-black/20 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* modal (simple) */}
      {mode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 border border-black/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-black">
                {mode === "add" ? "Add User" : "Edit User"}
              </h3>
              <Button
                onClick={() => {
                  setMode(null);
                  setSelectedUser(null);
                }}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <Input
                className="border border-black/20 rounded-xl px-3 py-2 w-full bg-white text-black focus:ring-2 focus:ring-black/20"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              />
              <Input
                className="border border-black/20 rounded-xl px-3 py-2 w-full bg-white text-black focus:ring-2 focus:ring-black/20"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
              <Input
                className="border border-black/20 rounded-xl px-3 py-2 w-full bg-white text-black focus:ring-2 focus:ring-black/20"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />

              <div className="flex gap-3">
                <select
                  className="border border-black/20 rounded-xl px-3 py-2 w-full bg-white text-black"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                >
                  <option value="USER">user</option>
                  <option value="ADMIN">admin</option>
                </select>

                {mode === "edit" && (
                  <select
                    className="border border-black/20 rounded-xl px-3 py-2 w-full bg-white text-black"
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                )}
              </div>

              {mode === "add" && (
                <>
                  <Input
                    className="border border-black/20 rounded-xl px-3 py-2 w-full bg-white text-black focus:ring-2 focus:ring-black/20"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  />
                  <Input
                    className="border border-black/20 rounded-xl px-3 py-2 w-full bg-white text-black focus:ring-2 focus:ring-black/20"
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  />
                </>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setMode(null);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900"
                >
                  {mode === "add" ? "Create" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;