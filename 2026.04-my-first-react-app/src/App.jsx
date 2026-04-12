import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const increment = () => {
    if (count < 10) {
      setCount(count + 1)
    }
  }
  const decrement = () => {
    if (count > 0) {
      setCount(count - 1)
    }
  }
  const secondIncrement = () => {
    if (count < 10) {
      setCount(count + 2)
    }
  }
  const reset = () => setCount(0)

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Counter App</h1>
      <h2 style={{ fontSize: '48px' }}>{count}</h2>

      <button onClick={increment} style={buttonStyle}>+1</button>
      <button onClick={decrement} style={buttonStyle}>-1</button>
      <button onClick={secondIncrement} style={buttonStyle}>+2</button>
      <button onClick={reset} style={{ ...buttonStyle, background: 'orange' }}>Reset</button>

      <p>count: {count}</p>
    </div>
  )
}

const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  fontSize: '18px',
  cursor: 'pointer'
}

export default App
