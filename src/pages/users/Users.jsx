// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\users\Users.jsx

import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Shield, User, Trash2, Pencil } from "lucide-react";
import { userUpdateSchema } from "../../validation/userSchema";
import PageHeader from "../../components/ui/PageHeader";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [error, setError] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "ROLE_ADMIN") {
      loadUsers();
    }
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      const res = await api.get("/api/users/me");
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to load current user", err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (e) {
      console.error("Failed to load users", e);
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditRole(user.role);
    setError("");
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setError("");
  };

  const saveEdit = async (id) => {
    const validation = userUpdateSchema.safeParse({
      name: editName,
      role: editRole
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      await api.put(`/api/admin/users/${id}`, {
        name: editName.trim(),
        role: editRole
      });
      setEditingUserId(null);
      setError("");
      loadUsers();
    } catch (e) {
      console.error("Update failed", e);
      setError("Update failed. Please try again.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteUserId(id);
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/api/admin/users/${deleteUserId}`);
      setDeleteUserId(null);
      loadUsers();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading users...</div>
      </div>
    );
  }

  if (currentUser.role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-red-500" size={40} />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 text-sm mt-2">
            Only administrators can view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="User Management" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Manage platform users and roles
          </p>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {users.length} users
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-gray-600 font-medium">User</th>
                  <th className="text-left p-4 text-gray-600 font-medium hidden sm:table-cell">Email</th>
                  <th className="text-left p-4 text-gray-600 font-medium">Role</th>
                  <th className="text-left p-4 text-gray-600 font-medium hidden md:table-cell">Created</th>
                  <th className="text-left p-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <User size={16} className="text-gray-600" />
                      </div>
                      {editingUserId === u.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-white border border-gray-300 px-2 py-1 rounded text-sm w-28 sm:w-auto"
                        />
                      ) : (
                        <span className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                          {u.name}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-gray-500 hidden sm:table-cell truncate max-w-[150px]">
                      {u.email}
                    </td>

                    <td className="p-4">
                      {editingUserId === u.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="bg-white border border-gray-300 px-2 py-1 rounded text-sm"
                        >
                          <option value="ROLE_DEVELOPER">DEVELOPER</option>
                          <option value="ROLE_ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === "ROLE_ADMIN"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}>
                          {u.role.replace("ROLE_", "")}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-gray-400 hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 flex gap-3">
                      {editingUserId === u.id ? (
                        <>
                          <button onClick={() => saveEdit(u.id)} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(u)} className="text-blue-600 hover:text-blue-700 p-1">
                            <Pencil size={16} />
                          </button>
                          {u.id !== currentUser.id && (
                            <button onClick={() => confirmDelete(u.id)} className="text-red-600 hover:text-red-700 p-1">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete User</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex flex-col xs:flex-row justify-end gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm order-2 xs:order-1">
                Cancel
              </button>
              <button onClick={deleteUser} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm order-1 xs:order-2">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  