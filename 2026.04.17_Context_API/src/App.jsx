import { createContext, useContext, useState } from "react"
import './App.css'

const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function Header() {
  const { isDark } = useContext(ThemeContext)

  return (
    <header style={{
      padding: '20px',
      backgroundColor: isDark ? '#333' : '#f0f0f0',
      textAlign: 'center'
    }}>
      <h1 style={{color: isDark ? '#fff' : '#000'}}>🎨 Theme Changing App</h1>
    </header>
  )
}

function ThemeButton() {
  const { isDark, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '10px 20px',
        fontSize: '18px',
        cursor: 'pointer',
        backgroundColor: isDark ? '#555' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  )
}

function ContentCard( {title, description }) {
  const { isDark } = useContext(ThemeContext)

  return (
    <div style={{
      padding: '20px',
      margin: '10px 0',
      borderRadius: '10px',
      backgroundColor: isDark ? '#444' : '#fff',
      color: isDark ? '#eee' : '#333',
      border: isDark ? '1px solid #666' : '1px solid #ddd',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function MainContent() {
  const { isDark } = useContext(ThemeContext)

  return (
    <main style={{
      padding: '20px',
      minHeight: '400px',
      backgroundColor: isDark ? '#222' : '#fff',
      color: isDark ? '#fff' : '#000'
    }}>
      <ContentCard
        title="Context API란?" 
        description="props drilling 없이 컴포넌트 트리 전체에 데이터를 전달하는 방법입니다."
      />
      <ContentCard 
        title="useContext" 
        description="Context에서 값을 읽어올 때 사용하는 Hook입니다."
      />
      <ContentCard 
        title="테마 변경" 
        description="지금처럼 다크모드/라이트모드 전환에 자주 사용됩니다."
      />
    </main>
  )
}

function Footer() {
  const { isDark } = useContext(ThemeContext)
  
  return (
    <footer style={{
      padding: '15px',
      textAlign: 'center',
      backgroundColor: isDark ? '#333' : '#f0f0f0',
      color: isDark ? '#ccc' : '#666'
    }}>
      <p>Theme Context 레제 | Day 7</p>
    </footer>
  )
}

function App() {
  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <ThemeButton />
        </div>
        <MainContent />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App