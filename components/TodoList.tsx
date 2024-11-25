'use client';

import { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project proposal', done: false },
    { id: 2, text: 'Review team performance', done: true },
    { id: 3, text: 'Prepare for client meeting', done: false },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  return (
    <div className="rounded-lg bg-black p-4 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-purple-600">Todo List</h2>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={todo.done ? 'text-gray-400 line-through' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
