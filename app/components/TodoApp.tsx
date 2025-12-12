"use client";

import React, { useEffect, useState } from "react";
import styles from "../todo.module.scss";

type Todo = { id: string; text: string; done: boolean };

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("todos:v1");
      if (raw) setTodos(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("todos:v1", JSON.stringify(todos));
    } catch (e) {
      console.error(e);
    }
  }, [todos]);

  function addTodo(e?: React.FormEvent) {
    e?.preventDefault();
    const value = text.trim();
    if (!value) return;
    const newTodo: Todo = { id: String(Date.now()), text: value, done: false };
    setTodos((s) => [newTodo, ...s]);
    setText("");
  }

  function toggleTodo(id: string) {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTodo(id: string) {
    setTodos((s) => s.filter((t) => t.id !== id));
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>To-Do List</h1>

      <form className={styles.form} onSubmit={addTodo}>
        <input
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Yeni görev ekle..."
          aria-label="Yeni görev"
        />
        <button className={styles.addButton} type="submit">
          Ekle
        </button>
      </form>

      <ul className={styles.list}>
        {todos.length === 0 && <li className={styles.empty}>Görev yok — başlangıç yapın.</li>}
        {todos.map((t) => (
          <li key={t.id} className={styles.item}>
            <label className={styles.label}>
              <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
              <span className={t.done ? styles.done : undefined}>{t.text}</span>
            </label>
            <button className={styles.delete} onClick={() => removeTodo(t.id)} aria-label="Sil">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
