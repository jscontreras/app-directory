'use client';

import { useState } from 'react';
import styles from './TodoList.module.css';

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
    <div className={styles.widget}>
      <h2 className={styles.title}>Todo List</h2>
      <ul className={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.item}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className={styles.checkbox}
            />
            <span className={todo.done ? styles.done : ''}>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
