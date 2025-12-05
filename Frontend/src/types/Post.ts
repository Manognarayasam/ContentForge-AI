export interface Post {
  _id: string
  url: string
  summary_results: string
  linkedin_post: string
  instagram_post: string
  twitter_post: string
  review_post: string
  image: {
    url: string
    public_id: string
    format: string
    size: number
  }
  created_at: string
  status: 'pending_review' | 'completed' | 'failed' | 'processing'
}