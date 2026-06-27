import { useState, useEffect, type FormEvent } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<Filter>('all');
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    setTodos([...todos, { id: nextId, text: newTodo.trim(), completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  return (
    <div className="app">
      <h1>📝 Todo App</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
              <span className="todo-text">{todo.text}</span>
            </label>
            <button className="delete" onClick={() => deleteTodo(todo.id)} aria-label={`Delete "${todo.text}"`}>
              ×
            </button>
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <div className="footer">
          <span>{todos.filter((t) => !t.completed).length} items left</span>
          <div className="filters">
            <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
            <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
            <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
          </div>
          <button onClick={clearCompleted} className="clear-btn">Clear Completed</button>
        </div>
      )}
    </div>
  );
}

export default App;
