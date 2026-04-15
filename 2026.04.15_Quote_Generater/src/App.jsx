import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import RandomIndex from './RandomIndex'

function App() {
  const [newQuoteText, setNewQuoteText] = useState('')

  const [newAuthor, setNewAuthor] = useState('')

  const [quotes, setQuotes] = useState([])

  const [currentQuote, setCurrentQuote] = useState({
    text: '명언',
    author: '명인',
    likes: 0
  })

  useEffect(() => {
    const savedQuotes = localStorage.getItem('quote')
    let parsedData = []

    if (savedQuotes) {
      parsedData = JSON.parse(savedQuotes)
    } else {
      parsedData = [
        { id: 1, text: "오늘 할 수 있다고 믿는다면 이미 절반은 성공한 것이다", author: "공자", likes: 0 },
        { id: 2, text: "실패는 성공의 어머니이다", author: "나폴레옹 힐", likes: 0 },
        { id: 3, text: "포기하지 않는 자만이 마침내 승리한다", author: "아인슈타인", likes: 0 }
      ]
    }

    setQuotes(parsedData)
    setCurrentQuote(parsedData[0])
  }, [])

  const addQuote = (e) => {
    e.preventDefault()  
    
    if (newQuoteText.trim() === '' || newAuthor.trim() === '') {
      alert('Enter quote and author')
      return
    }

    const nextId = quotes.length + 1

    const newQuote = {
      id: nextId,
      text: newQuoteText,
      author: newAuthor,
      likes: 0
    }

    const updateNewQuote = [...quotes, newQuote]

    setQuotes(updateNewQuote)
    setNewQuoteText('')
    setNewAuthor('')
    
    localStorage.setItem('quote', JSON.stringify(updateNewQuote))
  }

  const randomCurrentQuote = () => {
    const randomIndex = RandomIndex(quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }

  const increaseLikes = () => {
    const updateLikesQuote = quotes.map(quote => 
      quote.id === currentQuote.id
      ? { ...quote, likes: quote.likes + 1 }
      : quote
    )
    setQuotes(updateLikesQuote)

    setCurrentQuote({ ...currentQuote, likes: currentQuote.likes + 1 })

    localStorage.setItem('quote', JSON.stringify(updateLikesQuote))
  }

  return (
    <div style={{ width: '700px', textAlign: 'center', margin: '20px auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Quote Generator</h1>
      <div className='main-section'>
        <div 
          className='quote-section'
          style={{ 
            border: '1px solid #ccc', 
            borderRadius: '10px', 
            padding: '30px',
            margin: '20px 0',
            backgroundColor: '#f9f9f9'
        }}>
          <p style={{ fontSize: '24px', fontStyle: 'italic' }}>
            "{currentQuote.text}"
          </p>
          <p style={{ fontSize: '18px', color: '#666' }}>
            - {currentQuote.author} -
          </p>  
        </div>
        <div className='like-section' style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <button onClick={increaseLikes} style={buttonStyle}>❤️ {currentQuote.likes}</button>
          <button style={buttonStyle} onClick={randomCurrentQuote}>New Quote</button>
        </div>
      </div>
        
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px'}}>
        <h3>New Quote</h3>
        <form onSubmit={addQuote}>
          <div>
            <label>Quote:</label>
            <textarea 
              value={newQuoteText}
              onChange={(e) => setNewQuoteText(e.target.value)}
              style={inputStyle}
              placeholder='Enter your quote...'
              rows='3'
            />
          </div>
          <div>
            <label>Author:</label>
            <input
              type='text'
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              style={inputStyle}
              placeholder='Enter author of quote...'
            />
          </div>

          <button type='submit' style={buttonStyle}>Send</button>
          <button type='button' style={buttonStyle} onClick={() => {
            setNewAuthor('') 
            setNewQuoteText('')
            }}>Reset</button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '10px 0',
  boxSizing: 'border-box'
}

const buttonStyle = {
  margin: '10px 5px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: 'white'
}

export default App
