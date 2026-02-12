export default function TaskCard({ task, onComplete }) {
  const priorityColors = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Assigned to: {task.assignedTo.name}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Due: {new Date(task.dueDate).toDateString()}
        </p>

        {task.status !== "completed" && (
          <button
            onClick={() => onComplete(task._id)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}
