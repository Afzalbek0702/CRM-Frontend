import { useAuth } from "../context/authContext";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
    const { user, logout } = useAuth();
    const { tenant } = useParams();
    const [editing, setEditing] = useState(false);

    if (!user) return <div className="profile-loading">Loading profile...</div>;

    return (
        <div className="profile-container">

            <div className="profile-card">

                <div className="profile-header">
                    <div className="avatar">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h2>{user.username}</h2>
                        <p className="role">{user.role}</p>
                    </div>


                </div>

                <div className="profile-section">
                    <h3>Account Information</h3>

                    <div className="profile-grid">
                        {/* <ProfileField label="User ID" value={user.id} /> */}
                        <ProfileField label="Phone" value={user.phone} />
                        {/* <ProfileField label="Teacher ID" value={user.teacher_id || "None"} /> */}
                        <ProfileField label="Role" value={user.role} />
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Tenant</h3>

                    <div className="profile-grid">
                        <ProfileField label="Tenant Name" value={tenant || "—"} />
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Account Metadata</h3>

                    <div className="profile-grid">
                        <ProfileField
                            label="Created At"
                            value={new Date(user.created_at).toLocaleDateString()}
                        />
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Logout</h3>
                    <button className="edit-btn" onClick={logout}>
                        Logout

                    </button>

                </div>

            </div>
        </div>
    );
}

function ProfileField({ label, value }) {
    return (
        <div className="profile-field">
            <span className="label">{label}</span>
            <span className="value">{value}</span>
        </div>
    );
}