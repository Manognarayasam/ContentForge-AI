import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Post } from '../types/Post'
import { getAllPosts } from '../services/api'

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const posts = await getAllPosts()
        const foundPost = posts.find(p => p._id === id)
        if (foundPost) {
          setPost(foundPost)
        } else {
          setError('Post not found')
        }
      } catch (err) {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'Unknown date'
    }
  }

  const getPostTitle = (post: Post) => {
    const urlParts = post.url.split('/')
    const lastPart = urlParts[urlParts.length - 1]
    if (lastPart && lastPart.length > 0) {
      return lastPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    return 'Blog Post'
  }

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading">Loading post...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <div className="error">{error || 'Post not found'}</div>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Posts
        </button>
      </div>
    )
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Posts
        </button>
        <div className="post-detail-title-section">
          <h1 className="post-detail-title">{getPostTitle(post)}</h1>
          <div className="post-detail-meta">
            <span className={`status-badge status-${post.status.replace('_', '-')}`}>
              {post.status.replace('_', ' ')}
            </span>
            <span className="post-detail-date">
              Created: {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="post-detail-content">
        <div className="source-info">
          <h3>Source</h3>
          <a 
            href={post.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="source-link"
          >
            {post.url}
          </a>
        </div>

        {post.image && (
          <div className="post-detail-image">
            <h3>Generated Image</h3>
            <img 
              src={post.image.url} 
              alt="Generated content image"
              className="detail-image"
            />
            <div className="image-meta">
              Format: {post.image.format.toUpperCase()} • Size: {Math.round(post.image.size / 1024)}KB
            </div>
          </div>
        )}

        <div className="content-section">
          <h3>Summary</h3>
          <div className="content-text">
            {post.summary_results.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="social-content">
          <h3>Generated Social Media Posts</h3>
          
          <div className="social-platform">
            <h4>LinkedIn Post</h4>
            <div className="social-content-text">
              {post.linkedin_post.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          <div className="social-platform">
            <h4>Twitter Post</h4>
            <div className="social-content-text">
              {post.twitter_post.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          <div className="social-platform">
            <h4>Instagram Post</h4>
            <div className="social-content-text">
              {post.instagram_post.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="review-section">
          <h3>Content Review</h3>
          <div className="content-text">
            {post.review_post.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail