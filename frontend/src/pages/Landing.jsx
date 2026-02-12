import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
  const { theme } = useTheme();

  const sectionBg = theme.isDark ? "#111" : "#fafaf8";
  const iconBg = theme.btnBg;
  const iconStroke = theme.btnText;
  const btnHoverBg = theme.isDark ? "#ddd" : "#333";

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, transition: "background 0.4s ease, color 0.4s ease" }}>

      {/* Hero Section — full viewport */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Animated gradient orbs */}
        <div className="blob-1" style={{
          position: "absolute", top: "-80px", right: "10%",
          width: "400px", height: "400px",
          background: theme.isDark
            ? `radial-gradient(circle, ${theme.accent}20 0%, transparent 70%)`
            : "radial-gradient(circle, rgba(200,180,140,0.3) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", filter: "blur(40px)",
        }} />
        <div className="blob-2" style={{
          position: "absolute", bottom: "-60px", left: "5%",
          width: "350px", height: "350px",
          background: theme.isDark
            ? "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(150,190,220,0.25) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", filter: "blur(40px)",
        }} />
        <div className="blob-3" style={{
          position: "absolute", top: "20%", left: "50%",
          width: "300px", height: "300px",
          background: theme.isDark
            ? "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(220,200,160,0.2) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", filter: "blur(50px)",
        }} />

        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <p className="fade-in-up fade-in-up-delay-1" style={{
            fontSize: "13px", fontWeight: 500, color: theme.textMuted,
            textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px",
            transition: "color 0.4s ease",
          }}>
            Workspace Task Management Tool
          </p>

          <h1 className="fade-in-up fade-in-up-delay-2 hero-heading" style={{
            fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800,
            color: theme.textPrimary, lineHeight: 1.2, marginBottom: "20px",
            transition: "color 0.4s ease",
          }}>
            Organize your team,
            <br />
            assign tasks seamlessly.
          </h1>

          <p className="fade-in-up fade-in-up-delay-3 hero-sub" style={{
            fontSize: "16px", color: theme.textSecondary, lineHeight: 1.7,
            maxWidth: "550px", margin: "0 auto 32px auto",
            transition: "color 0.4s ease",
          }}>
            A workspace collaboration tool where teams register, assign tasks
            to colleagues with priorities and due dates, and receive automated
            email notifications.
          </p>

          <Link
            to="/register"
            className="fade-in-up fade-in-up-delay-4"
            style={{
              display: "inline-block",
              padding: "14px 40px",
              background: theme.btnBg,
              color: theme.btnText,
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "12px",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = btnHoverBg)}
            onMouseLeave={(e) => (e.target.style.background = theme.btnBg)}
          >
            Get Started!
          </Link>
        </div>
      </section>

      {/* Features Section — full viewport with orbital animation */}
      <section id="how-it-works" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 24px", background: sectionBg, transition: "background 0.4s ease",
        position: "relative", overflow: "hidden",
      }}>

        {/* Orbital rings with icons */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: 0, height: 0, pointerEvents: "none",
        }}>
          {/* Orbit 1 — User icon */}
          <div className={`orbit-ring orbit-1 ${theme.isDark ? "orbit-ring-dark" : ""}`}>
            <div className="orbit-icon" style={{ background: theme.isDark ? "#1a1a2e" : "#fff", transition: "background 0.4s" }}>
              <svg width="18" height="18" fill="none" stroke={theme.isDark ? "#818cf8" : "#6366f1"} viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
          </div>

          {/* Orbit 2 — Bell icon */}
          <div className={`orbit-ring orbit-2 ${theme.isDark ? "orbit-ring-dark" : ""}`}>
            <div className="orbit-icon" style={{ background: theme.isDark ? "#1a1a2e" : "#fff", transition: "background 0.4s" }}>
              <svg width="18" height="18" fill="none" stroke={theme.isDark ? "#f472b6" : "#ec4899"} viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>

          {/* Orbit 3 — Notepad icon */}
          <div className={`orbit-ring orbit-3 ${theme.isDark ? "orbit-ring-dark" : ""}`}>
            <div className="orbit-icon" style={{ background: theme.isDark ? "#1a1a2e" : "#fff", transition: "background 0.4s" }}>
              <svg width="18" height="18" fill="none" stroke={theme.isDark ? "#34d399" : "#10b981"} viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>

          {/* Orbit 4 — Gmail/Mail icon */}
          <div className={`orbit-ring orbit-4 ${theme.isDark ? "orbit-ring-dark" : ""}`}>
            <div className="orbit-icon" style={{ background: theme.isDark ? "#1a1a2e" : "#fff", transition: "background 0.4s" }}>
              <svg width="18" height="18" fill="none" stroke={theme.isDark ? "#fbbf24" : "#f59e0b"} viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content on top of orbits */}
        <div style={{ maxWidth: "900px", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{
              fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700,
              color: theme.textPrimary, marginBottom: "10px", transition: "color 0.4s ease",
            }}>
              How It Works
            </h2>
            <p style={{ fontSize: "15px", color: theme.textMuted, transition: "color 0.4s ease" }}>
              Simple, powerful features for seamless team collaboration
            </p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke={iconStroke} viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "User Registration",
                desc: "Team members register on the platform and instantly appear in the workspace user list for task assignments.",
              },
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke={iconStroke} viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: "Task Assignment",
                desc: "Assign tasks to any registered user. Set priorities (High / Medium / Low) and define due dates.",
              },
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke={iconStroke} viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Email Notifications",
                desc: "Assignees receive instant email with task details, priority, due date, and who assigned the work.",
              },
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke={iconStroke} viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Smart Deadline Reminders",
                desc: "When a task's due date is less than a day away, we automatically send a reminder email so nothing slips through the cracks.",
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: theme.isDark ? `${theme.cardBg}d9` : "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "16px",
                  border: `1px solid ${theme.divider}`,
                  padding: "36px 24px",
                  textAlign: "center",
                  transition: "box-shadow 0.3s, transform 0.3s, background 0.4s, border-color 0.4s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 30px ${theme.accent}15`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "52px", height: "52px",
                  background: iconBg, borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px auto",
                  transition: "background 0.4s ease",
                }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: theme.textPrimary, marginBottom: "8px", transition: "color 0.4s ease" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "13px", color: theme.textMuted, lineHeight: 1.6, transition: "color 0.4s ease" }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — full viewport */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", background: theme.bg, transition: "background 0.4s ease",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, color: theme.textPrimary, marginBottom: "12px", transition: "color 0.4s ease" }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: "15px", color: theme.textMuted, marginBottom: "28px", transition: "color 0.4s ease" }}>
            Join teams already using TaskPal to stay on track.
          </p>
          <Link
            to="/register"
            style={{
              display: "inline-block",
              padding: "14px 40px",
              background: theme.btnBg,
              color: theme.btnText,
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "12px",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = btnHoverBg)}
            onMouseLeave={(e) => (e.target.style.background = theme.btnBg)}
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${theme.divider}`,
        padding: "20px 24px", textAlign: "center",
        background: theme.bg, transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <p style={{ fontSize: "13px", color: theme.textMuted, transition: "color 0.4s ease", margin: 0 }}>
            © 2026 TaskPal.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: theme.textMuted }}>
              Contributions are welcome <span style={{ color: "#ef4444" }}>❤️</span>
            </span>
            <a
              href="https://github.com/sparsh13b/TaskPal"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.textPrimary,
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
