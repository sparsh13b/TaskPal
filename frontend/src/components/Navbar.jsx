import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function Navbar() {
  const { user, logout, updateUser } = useAuth();
  const { theme, setTheme, themeKey, themeKeys, themes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === "/";

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [activeOrgName, setActiveOrgName] = useState("");
  const orgRef = useRef(null);
  const themeRef = useRef(null);

  // Fetch orgs when user is logged in
  useEffect(() => {
    if (!user || !user.activeOrganization) {
      setOrgs([]);
      setActiveOrgName("");
      return;
    }
    const fetchOrgs = async () => {
      try {
        const res = await api.get("/org/me");
        setOrgs(res.data.orgs || []);
        const active = (res.data.orgs || []).find(
          o => o._id === res.data.activeOrganization
        );
        setActiveOrgName(active?.name || "");
      } catch {
        setOrgs([]);
      }
    };
    fetchOrgs();
  }, [user?.activeOrganization]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (orgRef.current && !orgRef.current.contains(e.target)) setOrgDropdownOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const handleHowItWorks = (e) => {
    e.preventDefault();
    if (isLanding) {
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleSwitchOrg = async (orgId) => {
    try {
      const res = await api.patch("/org/switch", { orgId });
      updateUser({
        organizations: res.data.user.organizations,
        activeOrganization: res.data.user.activeOrganization,
      });
      setOrgDropdownOpen(false);
      navigate("/dashboard");
    } catch { /* silently fail */ }
  };

  // Swatch colors for the palette preview
  const swatchColors = {
    light: ["#f5f5f0", "#111", "#22c55e"],
    dark: ["#0a0a0a", "#fff", "#22c55e"],
    ocean: ["#0f172a", "#38bdf8", "#f1f5f9"],
    forest: ["#0a1a0a", "#4ade80", "#e8f5e8"],
    sunset: ["#1a0a1e", "#f472b6", "#fce7f3"],
  };

  return (
    <nav style={{
      position: "fixed", top: "14px", left: "50%",
      transform: "translateX(-50%)", zIndex: 999,
      width: "calc(100% - 48px)", maxWidth: "840px",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px",
        background: theme.navBg, backdropFilter: "blur(12px)",
        borderRadius: "16px", boxShadow: theme.navShadow,
        border: `1px solid ${theme.navBorder}`,
        transition: "all 0.4s ease",
      }}>
        {/* App Name */}
        <Link to="/" style={{
          textDecoration: "none", fontSize: "18px", fontWeight: 700,
          color: theme.textPrimary, transition: "color 0.4s",
        }}>
          TaskPal
        </Link>

        {/* Right buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* How it works */}
          {!user && (
            <a href="#how-it-works" onClick={handleHowItWorks} style={{
              padding: "8px 16px", fontSize: "13px", fontWeight: 500,
              color: theme.textSecondary, textDecoration: "none",
              borderRadius: "8px", cursor: "pointer", transition: "color 0.4s",
            }}>
              How it works
            </a>
          )}

          {/* Dashboard */}
          {user && (
            <Link to="/dashboard" style={{
              padding: "8px 16px", fontSize: "13px", fontWeight: 500,
              color: theme.textSecondary, textDecoration: "none",
              borderRadius: "8px", transition: "color 0.4s",
            }}>
              Dashboard
            </Link>
          )}

          {/* Org Switcher */}
          {user && activeOrgName && (
            <div ref={orgRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setOrgDropdownOpen(!orgDropdownOpen); setThemeDropdownOpen(false); }}
                style={{
                  padding: "6px 12px", fontSize: "12px", fontWeight: 600,
                  color: theme.accent,
                  background: `${theme.accent}15`,
                  border: `1px solid ${theme.accent}40`,
                  borderRadius: "8px", cursor: "pointer",
                  transition: "all 0.3s", display: "flex",
                  alignItems: "center", gap: "4px", whiteSpace: "nowrap",
                }}
              >
                {activeOrgName}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {orgDropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  minWidth: "200px", background: theme.cardBg,
                  borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  border: `1px solid ${theme.divider}`, overflow: "hidden", zIndex: 1000,
                  transition: "all 0.3s",
                }}>
                  <div style={{
                    padding: "8px 12px", fontSize: "11px", fontWeight: 600,
                    color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>Your Projects</div>
                  {orgs.map(org => (
                    <button key={org._id} onClick={() => handleSwitchOrg(org._id)} style={{
                      width: "100%", padding: "10px 12px", fontSize: "13px",
                      fontWeight: org._id === user.activeOrganization ? 600 : 400,
                      color: org._id === user.activeOrganization ? theme.accent : theme.textSecondary,
                      background: "transparent", border: "none", cursor: "pointer",
                      textAlign: "left", transition: "background 0.15s",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = theme.hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {org._id === user.activeOrganization && <span style={{ color: theme.accent, fontSize: "12px" }}>✓</span>}
                      {org.name}
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${theme.divider}` }}>
                    <button onClick={() => { setOrgDropdownOpen(false); navigate("/org-setup"); }} style={{
                      width: "100%", padding: "10px 12px", fontSize: "13px", fontWeight: 500,
                      color: theme.textMuted, background: "transparent", border: "none",
                      cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = theme.hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >+ Join Another Project</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User name / Login */}
          {user ? (
            <span style={{
              padding: "8px 16px", fontSize: "13px", fontWeight: 500,
              color: theme.textSecondary, borderRadius: "8px",
            }}>{user.name || user.email || "User"}</span>
          ) : (
            <Link to="/login" style={{
              padding: "8px 16px", fontSize: "13px", fontWeight: 500,
              color: theme.textSecondary, textDecoration: "none",
              borderRadius: "8px", transition: "color 0.4s",
            }}>Login</Link>
          )}

          {/* Logout / Sign Up */}
          {user ? (
            <button onClick={handleLogout} style={{
              padding: "8px 18px", fontSize: "13px", fontWeight: 600,
              color: theme.btnText, background: theme.btnBg,
              border: "none", borderRadius: "8px", cursor: "pointer",
              transition: "all 0.3s",
            }}>Logout</button>
          ) : (
            <Link to="/register" style={{
              padding: "8px 18px", fontSize: "13px", fontWeight: 600,
              color: theme.btnText, background: theme.btnBg,
              textDecoration: "none", borderRadius: "8px", transition: "all 0.3s",
            }}>Sign Up</Link>
          )}

          {/* Theme Palette Selector */}
          <div ref={themeRef} style={{ position: "relative", marginLeft: "8px" }}>
            <button
              onClick={() => { setThemeDropdownOpen(!themeDropdownOpen); setOrgDropdownOpen(false); }}
              style={{
                padding: "7px 10px", background: "none",
                border: `1px solid ${theme.divider}`,
                borderRadius: "8px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "3px",
                transition: "all 0.3s",
              }}
              title="Change theme"
            >
              {/* Three dots representing current theme colors */}
              {(swatchColors[themeKey] || swatchColors.light).map((color, i) => (
                <div key={i} style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: color,
                  border: `1px solid ${theme.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                }} />
              ))}
            </button>

            {themeDropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                minWidth: "180px", background: theme.cardBg,
                borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                border: `1px solid ${theme.divider}`, overflow: "hidden", zIndex: 1000,
              }}>
                <div style={{
                  padding: "8px 12px", fontSize: "11px", fontWeight: 600,
                  color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.5px",
                }}>Theme</div>
                {themeKeys.map(key => {
                  const t = themes[key];
                  return (
                    <button
                      key={key}
                      onClick={() => { setTheme(key); setThemeDropdownOpen(false); }}
                      style={{
                        width: "100%", padding: "10px 12px", fontSize: "13px",
                        fontWeight: key === themeKey ? 600 : 400,
                        color: key === themeKey ? theme.accent : theme.textSecondary,
                        background: "transparent", border: "none", cursor: "pointer",
                        textAlign: "left", transition: "background 0.15s",
                        display: "flex", alignItems: "center", gap: "10px",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = theme.hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {/* Color swatch */}
                      <div style={{ display: "flex", gap: "3px" }}>
                        {(swatchColors[key]).map((c, i) => (
                          <div key={i} style={{
                            width: "10px", height: "10px", borderRadius: "50%",
                            background: c,
                            border: `1px solid ${theme.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
                          }} />
                        ))}
                      </div>
                      <span>{t.emoji} {t.name}</span>
                      {key === themeKey && <span style={{ marginLeft: "auto", fontSize: "12px", color: theme.accent }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
