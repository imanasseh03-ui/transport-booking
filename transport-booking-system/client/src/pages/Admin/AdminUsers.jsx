import { useEffect, useState } from "react";
import { getUsers } from "../../api/adminApi";
import "./AdminUsers.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const data = await getUsers();
            setUsers(data.users || []);
        } catch (error) {
            console.error(error);
            alert("Failed to load users.");
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = users.filter((user) => {
        const value = search.toLowerCase();

        return (
            user.full_name.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value) ||
            user.phone.includes(value)
        );
    });

    if (loading) return <h2>Loading users...</h2>;

    return (
        <section className="admin-users">
            <div className="users-header">
                <div>
                    <h1>Users Management</h1>
                    <p>{users.length} registered users</p>
                </div>
            </div>

            <input
                className="user-search"
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Joined</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5">No users found.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{user.created_at.slice(0, 10)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AdminUsers;