export default function TaskFilters({ filters, setFilters, users }) {
  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border shadow-sm">
      
      <select
        className="border px-3 py-2 rounded"
        value={filters.status}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </select>

      <select
        className="border px-3 py-2 rounded"
        value={filters.priority}
        onChange={(e) =>
          setFilters({ ...filters, priority: e.target.value })
        }
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        className="border px-3 py-2 rounded"
        value={filters.assignee}
        onChange={(e) =>
          setFilters({ ...filters, assignee: e.target.value })
        }
      >
        <option value="">All Assignees</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>
    </div>
  );
}
