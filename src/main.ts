import { Converter } from 'showdown'

interface Book {
  title: string
  author: string
  year: number
}

type BooksData = Record<string, Book>

class BookApp {
  private books: BooksData = {}
  private converter: Converter

  constructor() {
    this.converter = new Converter()
    this.init()
  }

  async init() {
    await this.loadBooks()
    this.displayBookList()
    this.setupEventListeners()
  }

  async loadBooks() {
    try {
      const response = await fetch('./tales/_books.json')
      this.books = await response.json()
    } catch (error) {
      console.error('Error loading books:', error)
    }
  }

  displayBookList() {
    const bookListElement = document.getElementById('book-list')!
    bookListElement.innerHTML = '<h2>Books</h2>'
    
    const ul = document.createElement('ul')
    
    for (const [slug, book] of Object.entries(this.books)) {
      const li = document.createElement('li')
      const link = document.createElement('a')
      link.href = '#'
      link.textContent = `${book.title} by ${book.author} (${book.year})`
      link.dataset.slug = slug
      li.appendChild(link)
      ul.appendChild(li)
    }
    
    bookListElement.appendChild(ul)
  }

  setupEventListeners() {
    document.getElementById('book-list')!.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' && (target as HTMLAnchorElement).dataset.slug) {
        e.preventDefault()
        await this.displayBook((target as HTMLAnchorElement).dataset.slug!)
      }
    })
  }

  async displayBook(slug: string) {
    try {
      const response = await fetch(`./tales/${slug}.md`)
      const markdown = await response.text()
      const html = this.converter.makeHtml(markdown)
      
      document.getElementById('book-content')!.innerHTML = html
    } catch (error) {
      console.error('Error loading book:', error)
      document.getElementById('book-content')!.innerHTML = '<p>Error loading book content.</p>'
    }
  }
}

new BookApp()
