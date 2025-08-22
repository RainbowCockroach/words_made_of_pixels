import { useState, useEffect } from 'react'
import showdown from 'showdown'

interface Book {
  title: string
  author: string
  year: number
}

interface BooksData {
  [key: string]: Book
}

function App() {
  const [books, setBooks] = useState<BooksData>({})
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [bookContent, setBookContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const converter = new showdown.Converter()

  useEffect(() => {
    console.log('Fetching books...')
    fetch('/words_made_of_pixels/tales/_books.json')
      .then(response => {
        console.log('Response status:', response.status)
        return response.json()
      })
      .then((data: BooksData) => {
        console.log('Books data:', data)
        setBooks(data)
      })
      .catch(error => console.error('Error loading books:', error))
  }, [])

  const handleBookSelect = async (bookSlug: string) => {
    setSelectedBook(bookSlug)
    setLoading(true)
    
    try {
      const response = await fetch(`/words_made_of_pixels/tales/${bookSlug}.md`)
      const markdown = await response.text()
      const html = converter.makeHtml(markdown)
      setBookContent(html)
    } catch (error) {
      console.error('Error loading book content:', error)
      setBookContent('Error loading book content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Words Made of Pixels</h1>
      
      <div>
        <h2>Books</h2>
        <p>Books loaded: {Object.keys(books).length}</p>
        <ul>
          {Object.entries(books).map(([slug, book]) => (
            <li key={slug}>
              <button onClick={() => handleBookSelect(slug)}>
                {book.title} by {book.author} ({book.year})
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedBook && (
        <div>
          <h2>{books[selectedBook]?.title}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: bookContent }} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
