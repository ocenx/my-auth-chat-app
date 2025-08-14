import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";

const Todo: React.FC = () => {
  const { currentUser } = useAuth();
  const db = getDatabase();

  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<{ id: string; text: string; completed: boolean }[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const todoRef = ref(db, `todos/${currentUser!.uid}`);
    onValue(todoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedTodos = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        }));
        setTodos(loadedTodos);
      } else {
        setTodos([]);
      }
    });
  }, [currentUser, db]);

  const addTask = () => {
    if (task.trim() === "" || !currentUser) return;
    const todoRef = ref(db, `todos/${currentUser!.uid}`);
    push(todoRef, { text: task, completed: false });
    setTask("");
  };

  const toggleTask = (id: string, completed: boolean) => {
    const taskRef = ref(db, `todos/${currentUser!.uid}/${id}`);
    update(taskRef, { completed: !completed });
  };

  const deleteTask = (id: string) => {
    const taskRef = ref(db, `todos/${currentUser!.uid}/${id}`);
    remove(taskRef);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">To-Do List</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Enter a task"
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span
              onClick={() => toggleTask(todo.id, todo.completed)}
              className={`cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""}`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTask(todo.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
