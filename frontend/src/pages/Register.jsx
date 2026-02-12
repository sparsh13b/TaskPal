import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputWrapStyle = {
    background: theme.inputBg,
    borderRadius: "14px",
    border: `1px solid ${theme.inputBorder}`,
    boxShadow: theme.isDark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.04)",
    marginBottom: "16px",
    transition: "all 0.3s ease",
    overflow: "hidden",
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    fontSize: "15px",
    color: theme.textPrimary,
    background: "transparent",
    border: "none",
    outline: "none",
    fontFamily: "inherit",
    transition: "color 0.4s ease",
  };

  const handleFocus = (e) => {
    e.target.parentElement.style.borderColor = theme.inputFocusBorder;
  };

  const handleBlur = (e) => {
    e.target.parentElement.style.borderColor = theme.inputBorder;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(form.name, form.email, form.password);
      navigate("/org-setup");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
        }}>Create Account</h1>

        {error && (
          <div style={{
            padding: "12px 16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "12px", marginBottom: "20px", textAlign: "center",
          }}>
            <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={inputWrapStyle}>
            <input type="text" placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          <div style={inputWrapStyle}>
            <input type="email" placeholder="email-user@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          <div style={{ ...inputWrapStyle, marginBottom: "28px" }}>
            <input type="password" placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{
          textAlign: "center", marginTop: "24px", fontSize: "13px",
          color: theme.textMuted, transition: "color 0.4s ease",
        }}>
          Already have an account?{" "}
          <Link to="/login" style={{
            color: theme.textPrimary, fontWeight: 600,
            textDecoration: "none", transition: "color 0.4s ease",
          }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
