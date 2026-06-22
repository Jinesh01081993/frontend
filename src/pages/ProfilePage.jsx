import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

function ProfilePage({ currentUser, token, onLogout }) {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' });

    const authHeaders = useMemo(() => {
        return {
            Authorization: `Bearer ${token}`
        };
    }, [token]);

    const loadUsers = async () => {
        try {
            const response = await api.get('/users', {
                headers: authHeaders
            });

            setUsers(response.data.users || []);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to load users');
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const startEdit = (user) => {
        setEditingUserId(user.id);
        setEditForm({ name: user.name, email: user.email, password: '' });
    };

    const saveUser = async (userId) => {
        try {
            const response = await api.put(`/users/${userId}`, editForm, {
                headers: authHeaders
            });

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? response.data.user : user
                )
            );

            setEditingUserId(null);
            setMessage('User updated successfully');
            setTimeout(() => setMessage(''), 4000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update user');
        }
    };

    const createUser = async () => {
        if (!createForm.name || !createForm.email || !createForm.password) {
            setMessage('Name, email and password are required');
            return;
        }
        try {
            await api.post('/auth/signup', {
                name: createForm.name,
                email: createForm.email,
                password: createForm.password
            });
            setCreateForm({ name: '', email: '', password: '' });
            setShowCreateForm(false);
            setMessage('User created successfully');
            setTimeout(() => setMessage(''), 4000);
            loadUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create user');
        }
    };

    const deleteUser = async (userId) => {
        if (userId === currentUser.id) {
            setMessage('Logged in user cannot be deleted');
            return;
        }

        try {
            await api.delete(`/users/${userId}`, {
                headers: authHeaders
            });

            setUsers((prev) => prev.filter((user) => user.id !== userId));
            setMessage('User deleted successfully');
            setTimeout(() => setMessage(''), 4000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <main className="page">
            <section className="hero profileHero">
                <div>
                    <h1>Profile</h1>
                    <p>Logged in as <strong>{currentUser.email}</strong></p>
                </div>
            </section>

            <section className="card">
                <div className="cardHeader">
                    <div>
                        <h2>Users in Database</h2>
                        <p>You can create, update and delete users. Current user cannot be deleted.</p>
                    </div>

                    <div className="actionButtons">
                        <button type="button" onClick={() => setShowCreateForm((prev) => !prev)}>
                            {showCreateForm ? 'Cancel' : '+ Create User'}
                        </button>
                        <button type="button" onClick={loadUsers}>
                            Refresh
                        </button>
                    </div>
                </div>

                {showCreateForm && (
                    <div className="createForm">
                        <h3>Create New User</h3>
                        <div className="createFormFields">
                            <input
                                placeholder="Name"
                                value={createForm.name}
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <input
                                placeholder="Email"
                                type="email"
                                value={createForm.email}
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                            />
                            <input
                                placeholder="Password (min 6 chars)"
                                type="password"
                                value={createForm.password}
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                            />
                            <button type="button" onClick={createUser}>
                                Create
                            </button>
                        </div>
                    </div>
                )}

                {message && <p className="message">{message}</p>}

                <div className="tableWrap">
                    <table className="usersTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>New Password</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => {
                                const isCurrentUser = user.id === currentUser.id;
                                const isEditing = editingUserId === user.id;

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    value={editForm.name}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                <>
                                                    {user.name}
                                                    {isCurrentUser && <span className="selfTag">You</span>}
                                                </>
                                            )}
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <input
                                                    value={editForm.email}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            email: e.target.value
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.email
                                            )}
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="password"
                                                    placeholder="Leave blank to keep"
                                                    value={editForm.password}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({ ...prev, password: e.target.value }))
                                                    }
                                                />
                                            ) : (
                                                <span style={{ color: '#64748b', letterSpacing: '2px' }}>••••••</span>
                                            )}
                                        </td>

                                        <td>
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleString()
                                                : '-'}
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <div className="actionButtons">
                                                    <button type="button" onClick={() => saveUser(user.id)}>
                                                        Save
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingUserId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="actionButtons">
                                                    <button type="button" onClick={() => startEdit(user)}>
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="danger"
                                                        disabled={isCurrentUser}
                                                        onClick={() => deleteUser(user.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default ProfilePage;