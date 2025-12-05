import { useNavigate } from 'react-router-dom'
import type { Post } from '../types/Post'

interface PostsListProps {
  posts: Post[]
  onRefresh: () => void
}

const PostsList: React.FC<PostsListProps> = ({ posts, onRefresh }) => {
  const navigate = useNavigate()
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'Unknown date'
    }
  }

  const getStatusBadgeClass = (status: Post['status']) => {
    switch (status) {
      case 'completed':
        return 'status-completed'
      case 'processing':
        return 'status-processing'
      case 'failed':
        return 'status-failed'
      case 'pending_review':
        return 'status-pending'
      default:
        return 'status-unknown'
    }
  }

  const getPostTitle = (post: Post) => {
    // Try to extract title from URL or use a default
    const urlParts = post.url.split('/')
    const lastPart = urlParts[urlParts.length - 1]
    if (lastPart && lastPart.length > 0) {
      return lastPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    return 'Blog Post'
  }

  const handleViewFullContent = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  if (posts.length === 0) {
    return (
      <div className="posts-list-empty">
        <p>No posts found. Create your first post by submitting a blog URL above!</p>
        <button onClick={onRefresh} className="refresh-button">
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="posts-list">
      <div className="posts-header">
        <span className="posts-count">
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </span>
        <button onClick={onRefresh} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <h3 className="post-title">{getPostTitle(post)}</h3>
              <span className={`status-badge ${getStatusBadgeClass(post.status)}`}>
                {post.status.replace('_', ' ')}
              </span>
            </div>

            {post.image && (
              <div className="post-image">
                <img 
                  src={post.image.url} 
                  alt="Generated content image"
                  className="content-image"
                />
              </div>
            )}

            <div className="post-content">
              <div className="content-section">
                <h4>Summary</h4>
                <p className="post-excerpt">
                  {post.summary_results.substring(0, 200) + 
                   (post.summary_results.length > 200 ? '...' : '')}
                </p>
              </div>

              <div className="social-posts">
                <div className="social-post">
                  <h5>LinkedIn Post</h5>
                  <p className="social-excerpt">
                    {post.linkedin_post.substring(0, 100) + 
                     (post.linkedin_post.length > 100 ? '...' : '')}
                  </p>
                </div>

                <div className="social-post">
                  <h5>Twitter Post</h5>
                  <p className="social-excerpt">
                    {post.twitter_post.substring(0, 100) + 
                     (post.twitter_post.length > 100 ? '...' : '')}
                  </p>
                </div>

                <div className="social-post">
                  <h5>Instagram Post</h5>
                  <p className="social-excerpt">
                    {post.instagram_post.substring(0, 100) + 
                     (post.instagram_post.length > 100 ? '...' : '')}
                  </p>
                </div>
              </div>
            </div>

            <div className="post-metadata">
              <div className="post-url">
                <span className="label">Source:</span>
                <a 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="post-link"
                >
                  {post.url.length > 50 ? post.url.substring(0, 50) + '...' : post.url}
                </a>
              </div>
              
              <div className="post-date">
                <span className="label">Created:</span>
                <span>{formatDate(post.created_at)}</span>
              </div>

              {post.image && (
                <div className="image-info">
                  <span className="label">Image:</span>
                  <span>{post.image.format.toUpperCase()} • {Math.round(post.image.size / 1024)}KB</span>
                </div>
              )}
            </div>

            <div className="post-actions">
              <button 
                className="view-details-btn"
                onClick={() => handleViewFullContent(post._id)}
              >
                View Full Content →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostsList