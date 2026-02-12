import { useEffect, useState } from "react";
import api from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import CreateTaskModal from "../components/CreateTaskModal";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.assignee) params.assignee = filters.assignee;

    api.get("/tasks", { params }).then((res) => setTasks(res.data));
  }, [filters]);

  const markComplete = async (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, status: "completed" } : t
      )
    );
    await api.patch(`/tasks/${id}`, { status: "completed" });
  };

  const createTask = async (data) => {
    const res = await api.post("/tasks", data);
    setTasks((prev) => [res.data.task, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + New Task
          </button>
        </div>

        <TaskFilters
          filters={filters}
          setFilters={setFilters}
          users={users}
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onComplete={markComplete}
            />
          ))}
        </div>

        <CreateTaskModal
          open={showModal}
          onClose={() => setShowModal(false)}
          users={users}
          onCreate={createTask}
        />
      </div>
    </div>
  );
}
