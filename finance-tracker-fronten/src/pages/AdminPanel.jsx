import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/Transactions.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u)); 
      await api.put(`admin/users/${userId}`, { role: newRole });
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
      fetchUsers(); 
    }
  };
const handleDeleteUser = async (userId) => {
  if (!window.confirm("Delete this user permanently?")) return;

  try {
    await api.delete(`admin/users/${userId}`);
    setUsers(users.filter(u => u.id !== userId)); 
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 400) {
      alert(err.response.data.message); 
    } else {
      alert("Cannot delete user due to server error");
    }
  }
};


  return (
    <>
      <Navbar />
      <div className="transactions-container">
        <h2 className="text-2xl font-bold mb-4">User Management (Admin)</h2>

        {loading ? <p>Loading users...</p> : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="form-select"
                      style={{ padding: '0.25rem' }}
                    >
                      <option value="user">User</option>
                      <option value="read-only">Read-Only</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="action-btn delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
