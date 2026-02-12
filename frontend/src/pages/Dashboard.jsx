import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedByMe, setExpandedByMe] = useState(false);
  const [expandedToMe, setExpandedToMe] = useState(false);
  const chartRef = useRef(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", dueDate: "", priority: "Medium", assignedTo: "" });
  const [taskError, setTaskError] = useState("");
  const [taskSuccess, setTaskSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch users when modal opens
  useEffect(() => {
    if (!showModal) return;
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.users || res.data);
      } catch {
        console.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [showModal]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskError("");
    setTaskSuccess("");

    if (!taskForm.title.trim() || !taskForm.dueDate || !taskForm.assignedTo) {
      setTaskError("Please fill title, due date, and assign to a user");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/tasks", taskForm);
      setTaskSuccess("Task assigned successfully!");
      setTaskForm({ title: "", description: "", dueDate: "", priority: "Medium", assignedTo: "" });
      // Refresh dashboard stats
      setLoading(true);
      await fetchStats();
      setTimeout(() => {
        setShowModal(false);
        setTaskSuccess("");
      }, 1200);
    } catch (err) {
      setTaskError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkComplete = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: "completed" });
      // Refresh dashboard stats
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to mark task complete", err);
    }
  };

  // D3 donut chart
  useEffect(() => {
    if (!stats || !chartRef.current) return;

    const { pending, completed, overdue } = stats.statusBreakdown;
    const data = [
      { label: "Pending", value: pending, color: "#f59e0b" },
      { label: "Completed", value: completed, color: "#10b981" },
      { label: "Overdue", value: overdue, color: "#ef4444" },
    ].filter(d => d.value > 0);

    if (data.length === 0) return;

    const width = 220, height = 220, radius = 90;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.value).sort(null).padAngle(0.03);
    const arc = d3.arc().innerRadius(55).outerRadius(radius);

    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => d.data.color)
      .attr("stroke", theme.cardBg)
      .attr("stroke-width", 2)
      .transition()
      .duration(800)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t));
      });

    // Center text
    const total = pending + completed + overdue;
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-4px")
      .attr("fill", theme.textPrimary)
      .attr("font-size", "28px")
      .attr("font-weight", "700")
      .attr("font-family", "Poppins, sans-serif")
      .text(total);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "18px")
      .attr("fill", theme.textMuted)
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("font-family", "Poppins, sans-serif")
      .text("Total");

  }, [stats, theme]);

  const priorityColor = (p) => {
    if (p === "High") return "#ef4444";
    if (p === "Medium") return "#f59e0b";
    return "#10b981";
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // Common input style for modal
  const modalInputStyle = {
    width: "100%", padding: "12px 16px", fontSize: "14px", color: theme.textPrimary,
    background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
    borderRadius: "10px", outline: "none", fontFamily: "inherit", transition: "all 0.3s", boxSizing: "border-box",
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.4s" }}>
        <p style={{ color: theme.textMuted, fontSize: "16px" }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.4s" }}>
        <p style={{ color: "#ef4444", fontWeight: 500 }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, transition: "background 0.4s ease", paddingTop: "80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px 60px 24px" }}>

        {/* Header */}
        <div className="dash-header" style={{ marginBottom: "36px", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: theme.textPrimary, transition: "color 0.4s" }}>
              Dashboard
            </h1>
            <p style={{ fontSize: "14px", color: theme.textMuted, marginTop: "6px", transition: "color 0.4s" }}>
              Overview of your tasks and progress
            </p>
          </div>
          <button
            onClick={() => { setShowModal(true); setTaskError(""); setTaskSuccess(""); }}
            style={{
              position: "absolute", right: 0,
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 22px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "inherit",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(239,68,68,0.35)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(239,68,68,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(239,68,68,0.35)"; }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Assign a Task
          </button>
        </div>

        {/* Assign Task Modal */}
        {showModal && (
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: "460px",
                background: theme.cardBg,
                borderRadius: "20px",
                border: `1px solid ${theme.divider}`,
                padding: "32px",
                boxShadow: theme.isDark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.12)",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: theme.textPrimary, marginBottom: "24px", textAlign: "center", transition: "color 0.4s" }}>
                Assign a New Task
              </h2>

              {taskError && (
                <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", marginBottom: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500 }}>{taskError}</p>
                </div>
              )}

              {taskSuccess && (
                <div style={{ padding: "10px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "10px", marginBottom: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#10b981", fontWeight: 500 }}>{taskSuccess}</p>
                </div>
              )}

              <form onSubmit={handleTaskSubmit}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: theme.textMuted, marginBottom: "6px", transition: "color 0.4s" }}>Task Title *</label>
                  <input type="text" placeholder="e.g. Prepare presentation"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    style={modalInputStyle}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: theme.textMuted, marginBottom: "6px", transition: "color 0.4s" }}>Description</label>
                  <textarea placeholder="Optional description..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    rows={3}
                    style={{ ...modalInputStyle, resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: theme.textMuted, marginBottom: "6px", transition: "color 0.4s" }}>Due Date *</label>
                    <input type="date" value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: theme.textMuted, marginBottom: "6px", transition: "color 0.4s" }}>Priority</label>
                    <select value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      style={{ ...modalInputStyle, cursor: "pointer" }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: theme.textMuted, marginBottom: "6px", transition: "color 0.4s" }}>Assign To *</label>
                  <select value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    style={{ ...modalInputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select a user...</option>
                    {users.filter((u) => u._id !== currentUser?.id).map((u) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{
                    flex: 1, padding: "14px", fontSize: "14px", fontWeight: 600, fontFamily: "inherit",
                    background: "none", color: theme.textMuted, border: `1px solid ${theme.divider}`,
                    borderRadius: "12px", cursor: "pointer", transition: "all 0.2s",
                  }}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{
                    flex: 1, padding: "14px", fontSize: "14px", fontWeight: 600, fontFamily: "inherit",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#fff", border: "none",
                    borderRadius: "12px", cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1, transition: "all 0.2s",
                  }}>{submitting ? "Assigning..." : "Assign Task"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stat Cards Row */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <StatCard title="Total Tasks" value={stats.totalTasks} color="#6366f1"
            icon={<svg width="18" height="18" fill="none" stroke="#6366f1" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard title="Assigned by You" value={stats.tasksAssignedByMe} color="#3b82f6"
            icon={<svg width="18" height="18" fill="none" stroke="#3b82f6" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
          />
          <StatCard title="Assigned to You" value={stats.tasksAssignedToMe} color="#8b5cf6"
            icon={<svg width="18" height="18" fill="none" stroke="#8b5cf6" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          <StatCard title="Completed" value={stats.completedTasks} color="#10b981"
            icon={<svg width="18" height="18" fill="none" stroke="#10b981" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* Pending Cards + Chart Row */}
        <div className="pending-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "16px", marginBottom: "24px", alignItems: "start" }}>

          {/* Pending — Assigned by You */}
          <div style={{
            background: theme.cardBg, borderRadius: "16px", border: `1px solid ${theme.divider}`,
            overflow: "hidden", transition: "all 0.3s ease",
          }}>
            <button
              onClick={() => setExpandedByMe(!expandedByMe)}
              style={{
                width: "100%", padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: theme.textMuted, marginBottom: "6px", transition: "color 0.4s" }}>
                  Pending — Assigned by You
                </p>
                <p style={{ fontSize: "26px", fontWeight: 700, color: "#f59e0b", lineHeight: 1 }}>
                  {stats.pendingByMe}
                </p>
              </div>
              <svg width="20" height="20" fill="none" stroke={theme.textMuted} viewBox="0 0 24 24" strokeWidth={2}
                style={{ transform: expandedByMe ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedByMe && stats.pendingByMeList && (
              <div style={{ borderTop: `1px solid ${theme.divider}`, padding: "8px 16px 16px 16px", maxHeight: "280px", overflowY: "auto" }}>
                {stats.pendingByMeList.length === 0 ? (
                  <p style={{ fontSize: "13px", color: theme.textMuted, padding: "12px 8px" }}>No pending tasks</p>
                ) : (
                  stats.pendingByMeList.map((task, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 8px",
                      borderBottom: i < stats.pendingByMeList.length - 1 ? `1px solid ${theme.hoverBg}` : "none",
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: "13px", fontWeight: 600, color: theme.textPrimary, transition: "color 0.4s",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                        }}>
                          {task.title}
                        </p>
                        <p style={{ fontSize: "11px", color: theme.textMuted, marginTop: "2px", transition: "color 0.4s" }}>
                          → {task.assignedTo?.name || "Unknown"}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "12px" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: 600, color: priorityColor(task.priority),
                          background: theme.hoverBg, padding: "3px 8px", borderRadius: "6px",
                        }}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: "11px", color: theme.textMuted }}>{formatDate(task.dueDate)}</span>
                        <button
                          onClick={() => handleMarkComplete(task._id)}
                          title="Mark as completed"
                          style={{
                            width: "26px", height: "26px",
                            borderRadius: "8px",
                            border: "1px solid rgba(16,185,129,0.3)",
                            background: "rgba(16,185,129,0.1)",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#10b981"; e.currentTarget.querySelector("svg").style.stroke = "#fff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; e.currentTarget.querySelector("svg").style.stroke = "#10b981"; }}
                        >
                          <svg width="14" height="14" fill="none" stroke="#10b981" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Pending — Assigned to You */}
          <div style={{
            background: theme.cardBg, borderRadius: "16px", border: `1px solid ${theme.divider}`,
            overflow: "hidden", transition: "all 0.3s ease",
          }}>
            <button
              onClick={() => setExpandedToMe(!expandedToMe)}
              style={{
                width: "100%", padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: theme.textMuted, marginBottom: "6px", transition: "color 0.4s" }}>
                  Pending — Assigned to You
                </p>
                <p style={{ fontSize: "26px", fontWeight: 700, color: "#f59e0b", lineHeight: 1 }}>
                  {stats.pendingToMe}
                </p>
              </div>
              <svg width="20" height="20" fill="none" stroke={theme.textMuted} viewBox="0 0 24 24" strokeWidth={2}
                style={{ transform: expandedToMe ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedToMe && stats.pendingToMeList && (
              <div style={{ borderTop: `1px solid ${theme.divider}`, padding: "8px 16px 16px 16px", maxHeight: "280px", overflowY: "auto" }}>
                {stats.pendingToMeList.length === 0 ? (
                  <p style={{ fontSize: "13px", color: theme.textMuted, padding: "12px 8px" }}>No pending tasks</p>
                ) : (
                  stats.pendingToMeList.map((task, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 8px",
                      borderBottom: i < stats.pendingToMeList.length - 1 ? `1px solid ${theme.hoverBg}` : "none",
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: "13px", fontWeight: 600, color: theme.textPrimary, transition: "color 0.4s",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                        }}>
                          {task.title}
                        </p>
                        <p style={{ fontSize: "11px", color: theme.textMuted, marginTop: "2px", transition: "color 0.4s" }}>
                          from {task.createdBy?.name || "Unknown"}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "12px" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: 600, color: priorityColor(task.priority),
                          background: theme.hoverBg, padding: "3px 8px", borderRadius: "6px",
                        }}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: "11px", color: theme.textMuted }}>{formatDate(task.dueDate)}</span>
                        <button
                          onClick={() => handleMarkComplete(task._id)}
                          title="Mark as completed"
                          style={{
                            width: "26px", height: "26px",
                            borderRadius: "8px",
                            border: "1px solid rgba(16,185,129,0.3)",
                            background: "rgba(16,185,129,0.1)",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#10b981"; e.currentTarget.querySelector("svg").style.stroke = "#fff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; e.currentTarget.querySelector("svg").style.stroke = "#10b981"; }}
                        >
                          <svg width="14" height="14" fill="none" stroke="#10b981" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* D3 Donut Chart */}
          <div style={{
            background: theme.cardBg, borderRadius: "16px", border: `1px solid ${theme.divider}`,
            padding: "20px", transition: "all 0.3s ease",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: theme.textMuted, marginBottom: "12px", transition: "color 0.4s" }}>
              Status Breakdown
            </p>
            <div ref={chartRef} />
            {/* Legend */}
            <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
              {[
                { label: "Pending", color: "#f59e0b" },
                { label: "Done", color: "#10b981" },
                { label: "Overdue", color: "#ef4444" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }} />
                  <span style={{ fontSize: "11px", color: theme.textMuted }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overdue indicator */}
        {stats.overdueTasks > 0 && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: "14px",
            padding: "16px 24px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444" }}>
              {stats.overdueTasks} overdue task{stats.overdueTasks > 1 ? "s" : ""} need attention
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
