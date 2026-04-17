import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')

    if (!savedTodos) {
      setTodos([{ id: 1, text: 'React learning', completed: false }])
    } else {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  const addTodo = (e) => {
    e.preventDefault()

    if (inputValue.trim() === '') {
      alert('Enter todos...')
      return
    }

    const nextId = todos.length + 1

    const newTodo = {
      id: nextId,
      text: inputValue,
      completed: false
    } 

    const updateTodos = [...todos, newTodo]

    setTodos(updateTodos)
    setInputValue('')

    localStorage.setItem('todos', JSON.stringify(updateTodos))
  }

  const toggleComplete = (id) => {
    const newTodos = todos.map(todo => 
      todo.id === id
      ? {...todo, completed: !todo.completed}
      : todo
    )

    setTodos(newTodos)

    localStorage.setItem('todos', JSON.stringify(newTodos))
  } 

  const deleteTodo = (id) => {
    const deleteTodo = todos.filter(todo =>
      todo.id !== id
    )

    setTodos(deleteTodo)
    localStorage.setItem('todos', JSON.stringify(deleteTodo))
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h1>Todo List</h1>
      <p>Numbers of todos: {todos.length}</p>

      <form onSubmit={addTodo} style={{ height: '50px', marginBottom: '20px', display: 'flex', flexDirection: 'row', gap: '5px' }}>
        <input
          type='text'
          value={inputValue}
          placeholder='Enter your todo...'
          onChange={(e) => setInputValue(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>add</button>
      </form>

      <ul style={listStyle}>
        {todos.map(todo => (
          <li key={todo.id} style={listItemStyle}>
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
              style={{ marginRight: '10px' }}
            />
            <span style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#999' : '#000'
            }}>
              {todo.text}
            </span>
            <button
              onClick={() =>  deleteTodo(todo.id)}
              style={deleteButtonStyle}
            >
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999' }}>
          🎉 모든 할 일을 완료했습니다!
        </p>
      )}
    </div>
  )
}

const inputStyle = {
  width: '70%',
  padding: '10px',
  marginRight: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px'
}

const buttonStyle = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px'
}

const listStyle = {
  listStyle: 'none',
  padding: 0
}

const listItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  marginBottom: '8px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  gap: '10px'
}

const deleteButtonStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px'
}

export default App
