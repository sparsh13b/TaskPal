import { useTheme } from "../context/ThemeContext";

export default function StatCard({ title, value, icon, color }) {
  const { theme } = useTheme();

  return (
    <div style={{
      background: theme.cardBg,
      borderRadius: "16px",
      border: `1px solid ${theme.divider}`,
      padding: "24px",
      transition: "all 0.3s ease",
      cursor: "default",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: 500, color: theme.textMuted, transition: "color 0.4s" }}>
          {title}
        </p>
        <div style={{
          width: "36px", height: "36px",
          borderRadius: "10px",
          background: color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
      </div>
      <p style={{
        fontSize: "32px", fontWeight: 700,
        color: theme.textPrimary, lineHeight: 1,
        transition: "color 0.4s",
      }}>
        {value ?? 0}
      </p>
    </div>
  );
}
