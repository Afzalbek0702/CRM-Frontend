import { useAuth } from "../context/authContext";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { goBack } from "../utils/navigate.js";


export default function Profile() {
    const { user, logout } = useAuth();
    const { tenant } = useParams();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const HandleClick = () => {
        navigate(`/login`)
    }

    if (!user) return <div className="profile-loading">Loading profile...</div>;

    return (
        <>
            <button className="btn1" onClick={goBack}>
                ← Ortga
            </button>

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
                        <button className="edit-btn"
                            onClick={HandleClick}
                        // onClick={logout}
                        >
                            Logout

                        </button>

                    </div>

                </div>
            </div>
        </>
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