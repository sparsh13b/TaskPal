import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function OrgSetup() {
    const { updateUser } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [mode, setMode] = useState(null);       // "create" or "join"
    const [orgName, setOrgName] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [result, setResult] = useState(null);    // For showing invite code after create
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [existingOrgs, setExistingOrgs] = useState([]);
    const [loadingOrgs, setLoadingOrgs] = useState(true);

    // Fetch user's existing orgs on mount
    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await api.get("/org/me");
                setExistingOrgs(res.data.orgs || []);
            } catch {
                setExistingOrgs([]);
            } finally {
                setLoadingOrgs(false);
            }
        };
        fetchOrgs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!orgName.trim()) { setError("Organization name is required"); return; }
        setLoading(true); setError("");

        try {
            const res = await api.post("/org/create", { name: orgName.trim() });
            updateUser({
                organizations: res.data.user.organizations,
                activeOrganization: res.data.user.activeOrganization,
            });
            setResult(res.data.org);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create organization");
        } finally { setLoading(false); }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim()) { setError("Invite code is required"); return; }
        setLoading(true); setError("");

        try {
            const res = await api.post("/org/join", { inviteCode: inviteCode.trim() });
            updateUser({
                organizations: res.data.user.organizations,
                activeOrganization: res.data.user.activeOrganization,
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid invite code");
        } finally { setLoading(false); }
    };

    const handleSwitchOrg = async (orgId) => {
        try {
            const res = await api.patch("/org/switch", { orgId });
            updateUser({
                organizations: res.data.user.organizations,
                activeOrganization: res.data.user.activeOrganization,
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to switch organization");
        }
    };

    // After org creation — show invite code before going to dashboard
    if (result) {
        return (
            <div style={{
                minHeight: "100vh", background: theme.bg, display: "flex",
                alignItems: "center", justifyContent: "center", padding: "24px",
                transition: "background 0.4s ease"
            }}>
                <div style={{
                    background: theme.cardBg, borderRadius: "16px", padding: "48px",
                    maxWidth: "450px", width: "100%",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.1)", textAlign: "center"
                }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                    <h2 style={{ color: theme.textPrimary, fontSize: "24px", marginBottom: "8px" }}>
                        {result.name} Created!
                    </h2>
                    <p style={{ color: theme.textMuted, marginBottom: "24px" }}>
                        Share this invite code with your team members:
                    </p>
                    <div style={{
                        background: theme.hoverBg, borderRadius: "12px",
                        padding: "20px", fontSize: "28px", fontWeight: "700",
                        letterSpacing: "4px", color: theme.accent, fontFamily: "monospace",
                        border: `2px dashed ${theme.accent}40`
                    }}>
                        {result.inviteCode}
                    </div>
                    <p style={{ color: theme.textMuted, fontSize: "13px", marginTop: "12px" }}>
                        Team members will enter this code when they register
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            marginTop: "32px", width: "100%", padding: "14px",
                            background: theme.btnBg, color: theme.btnText, border: "none",
                            borderRadius: "10px", fontSize: "16px", fontWeight: "600",
                            cursor: "pointer", transition: "transform 0.2s"
                        }}
                        onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
                        onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    >
                        Go to Dashboard →
                    </button>
                </div>
            </div>
        );
    }

    if (loadingOrgs) {
        return (
            <div style={{
                minHeight: "100vh", background: theme.bg, display: "flex",
                alignItems: "center", justifyContent: "center"
            }}>
                <p style={{ color: theme.textMuted }}>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh", background: theme.bg, display: "flex",
            alignItems: "center", justifyContent: "center", padding: "24px",
            transition: "background 0.4s ease"
        }}>
            <div style={{
                background: theme.cardBg, borderRadius: "16px", padding: "48px",
                maxWidth: "450px", width: "100%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ color: theme.textPrimary, fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "8px" }}>
                    {existingOrgs.length > 0 ? "Your Organizations" : "Set Up Your Organization"}
                </h2>
                <p style={{ color: theme.textMuted, textAlign: "center", marginBottom: "32px", fontSize: "14px" }}>
                    {existingOrgs.length > 0
                        ? "Switch to an existing project or join a new one"
                        : "Create a new organization or join an existing one"}
                </p>

                {/* EXISTING ORGS LIST */}
                {existingOrgs.length > 0 && !mode && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                        {existingOrgs.map(org => (
                            <button
                                key={org._id}
                                onClick={() => handleSwitchOrg(org._id)}
                                style={{
                                    padding: "14px 20px", background: theme.hoverBg,
                                    color: theme.textPrimary, border: `1px solid ${theme.inputBorder}`,
                                    borderRadius: "10px", fontSize: "15px", fontWeight: "500",
                                    cursor: "pointer", transition: "all 0.2s",
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    textAlign: "left",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = theme.accent;
                                    e.currentTarget.style.background = theme.inputBg;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = theme.inputBorder;
                                    e.currentTarget.style.background = theme.hoverBg;
                                }}
                            >
                                <span>{org.name}</span>
                                <span style={{ fontSize: "12px", color: theme.textMuted }}>
                                    {org.memberCount} member{org.memberCount !== 1 ? "s" : ""} →
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* ACTION BUTTONS — create or join */}
                {!mode && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button
                            onClick={() => { setMode("create"); setError(""); }}
                            style={{
                                padding: "16px 24px", background: theme.btnBg, color: theme.btnText,
                                border: "none", borderRadius: "10px", fontSize: "16px",
                                fontWeight: "600", cursor: "pointer", transition: "transform 0.2s"
                            }}
                            onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
                            onMouseLeave={e => e.target.style.transform = "scale(1)"}
                        >
                            ✨ Create Organization/Project
                        </button>
                        <button
                            onClick={() => { setMode("join"); setError(""); }}
                            style={{
                                padding: "16px 24px", background: "transparent",
                                color: theme.textPrimary, border: `2px solid ${theme.inputBorder}`,
                                borderRadius: "10px", fontSize: "16px", fontWeight: "600",
                                cursor: "pointer", transition: "all 0.2s"
                            }}
                            onMouseEnter={e => { e.target.style.transform = "scale(1.02)"; e.target.style.borderColor = theme.textPrimary; }}
                            onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.borderColor = theme.inputBorder; }}
                        >
                            🔗 Join with Invite Code
                        </button>
                    </div>
                )}

                {/* CREATE FORM */}
                {mode === "create" && (
                    <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <input
                            type="text"
                            placeholder="Organization/Project Name"
                            value={orgName}
                            onChange={e => setOrgName(e.target.value)}
                            style={{
                                padding: "14px 16px", background: theme.inputBg, color: theme.textPrimary,
                                border: `2px solid ${theme.inputBorder}`, borderRadius: "10px",
                                fontSize: "15px", outline: "none", transition: "border 0.3s"
                            }}
                            onFocus={e => e.target.style.borderColor = theme.inputFocusBorder}
                            onBlur={e => e.target.style.borderColor = theme.inputBorder}
                        />
                        {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "14px", background: theme.btnBg, color: theme.btnText,
                                border: "none", borderRadius: "10px", fontSize: "16px",
                                fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1, transition: "all 0.2s"
                            }}
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode(null); setError(""); }}
                            style={{
                                background: "none", border: "none", color: theme.textMuted,
                                cursor: "pointer", fontSize: "14px", textDecoration: "underline"
                            }}
                        >
                            ← Back
                        </button>
                    </form>
                )}

                {/* JOIN FORM */}
                {mode === "join" && (
                    <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <input
                            type="text"
                            placeholder="Enter Invite Code"
                            value={inviteCode}
                            onChange={e => setInviteCode(e.target.value.toUpperCase())}
                            style={{
                                padding: "14px 16px", background: theme.inputBg, color: theme.textPrimary,
                                border: `2px solid ${theme.inputBorder}`, borderRadius: "10px",
                                fontSize: "18px", fontWeight: "600", letterSpacing: "3px",
                                fontFamily: "monospace", textAlign: "center",
                                outline: "none", transition: "border 0.3s"
                            }}
                            onFocus={e => e.target.style.borderColor = theme.accent}
                            onBlur={e => e.target.style.borderColor = theme.inputBorder}
                        />
                        {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "14px", background: theme.accent, color: "#fff",
                                border: "none", borderRadius: "10px", fontSize: "16px",
                                fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1, transition: "all 0.2s"
                            }}
                        >
                            {loading ? "Joining..." : "Join Organization"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode(null); setError(""); }}
                            style={{
                                background: "none", border: "none", color: theme.textMuted,
                                cursor: "pointer", fontSize: "14px", textDecoration: "underline"
                            }}
                        >
                            ← Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
