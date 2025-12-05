import { useState } from 'react'
import { createPostFromBlog } from '../services/api'

interface BlogSubmissionFormProps {
  onPostCreated: () => void
}

const BlogSubmissionForm: React.FC<BlogSubmissionFormProps> = ({ onPostCreated }) => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setMessage({ text: 'Please enter a blog URL', type: 'error' })
      return
    }

    if (!validateUrl(url)) {
      setMessage({ text: 'Please enter a valid URL', type: 'error' })
      return
    }

    try {
      setLoading(true)
      setMessage(null)
      
      const response = await createPostFromBlog(url)
      
      setMessage({ 
        text: response.message || 'Blog post processing started successfully!', 
        type: 'success' 
      })
      setUrl('')
      
      // Refresh the posts list
      onPostCreated()
      
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to submit blog URL', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="blog-submission-form">
      <h2>Create Post from Blog</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="blogUrl">Blog URL:</label>
          <input
            id="blogUrl"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/blog-post"
            className="form-input"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className={`form-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Create Post'}
        </button>
      </form>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading && (
        <div className="processing-info">
          <p>⏳ Processing your blog URL. This may take a few minutes...</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogSubmissionForm