import { useState, useEffect } from 'react'
import './App.css'
import BlogSubmissionForm from './components/BlogSubmissionForm'
import PostsList from './components/PostsList'
import type { Post } from './types/Post'
import { getAllPosts } from './services/api'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllPosts()
      setPosts(data)
    } catch (err) {
      setError('Failed to fetch posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostCreated = () => {
    // Refresh the posts list when a new post is created
    fetchPosts()
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Content Creation Platform</h1>
        <p>Transform blog URLs into structured content</p>
      </header>

      <main className="app-main">
        <section className="submission-section">
          <BlogSubmissionForm onPostCreated={handlePostCreated} />
        </section>

        <section className="posts-section">
          <h2>All Posts</h2>
          {error && <div className="error">{error}</div>}
          {loading ? (
            <div className="loading">Loading posts...</div>
          ) : (
            <PostsList posts={posts} onRefresh={fetchPosts} />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
