import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData = await login(form.email, form.password);
      navigate(userData?.activeOrganization ? "/dashboard" : "/org-setup");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", transition: "background 0.4s ease",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h1 style={{
          fontSize: "28px", fontWeight: 700,
          color: theme.textPrimary, textAlign: "center",
          marginBottom: "36px", transition: "color 0.4s ease",
        }}>Login</h1>

        {error && (
          <div style={{
            padding: "12px 16px",
            background: `${theme.accent}10`,
            border: "1px solid",
            borderColor: "rgba(239,68,68,0.2)",
            borderRadius: "12px", marginBottom: "20px", textAlign: "center",
          }}>
            <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            background: theme.inputBg, borderRadius: "14px",
            border: `1px solid ${theme.inputBorder}`,
            boxShadow: theme.isDark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.04)",
            marginBottom: "16px", transition: "all 0.3s ease", overflow: "hidden",
          }}>
            <input type="email" placeholder="email-user@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: "100%", padding: "16px 20px", fontSize: "15px",
                color: theme.textPrimary, background: "transparent",
                border: "none", outline: "none", fontFamily: "inherit",
                transition: "color 0.4s ease",
              }}
              onFocus={(e) => { e.target.parentElement.style.borderColor = theme.inputFocusBorder; }}
              onBlur={(e) => { e.target.parentElement.style.borderColor = theme.inputBorder; }}
            />
          </div>

          <div style={{
            background: theme.inputBg, borderRadius: "14px",
            border: `1px solid ${theme.inputBorder}`,
            boxShadow: theme.isDark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.04)",
            marginBottom: "28px", transition: "all 0.3s ease", overflow: "hidden",
          }}>
            <input type="password" placeholder="Please enter your password."
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                width: "100%", padding: "16px 20px", fontSize: "15px",
                color: theme.textPrimary, background: "transparent",
                border: "none", outline: "none", fontFamily: "inherit",
                transition: "color 0.4s ease",
              }}
              onFocus={(e) => { e.target.parentElement.style.borderColor = theme.inputFocusBorder; }}
              onBlur={(e) => { e.target.parentElement.style.borderColor = theme.inputBorder; }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "16px", fontSize: "15px", fontWeight: 600,
            fontFamily: "inherit", color: theme.btnText, background: theme.btnBg,
            border: "none", borderRadius: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, transition: "all 0.2s ease",
          }}
            onMouseEnter={(e) => { if (!loading) e.target.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.opacity = "1"; }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{
          textAlign: "center", marginTop: "24px", fontSize: "13px",
          color: theme.textMuted, transition: "color 0.4s ease",
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{
            color: theme.textPrimary, fontWeight: 600,
            textDecoration: "none", transition: "color 0.4s ease",
          }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
