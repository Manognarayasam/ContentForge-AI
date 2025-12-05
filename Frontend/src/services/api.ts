import axios from 'axios'
import type { Post } from '../types/Post'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for blog processing
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface CreatePostFromBlogRequest {
  input_url: string
}

export interface CreatePostFromBlogResponse {
  message: string
  post_id?: string
  status: string
}

export const createPostFromBlog = async (url: string): Promise<CreatePostFromBlogResponse> => {
  try {
    const response = await api.post('/create_post_from_blog', { input_url: url })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create post from blog')
    }
    throw new Error('An unexpected error occurred')
  }
}

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/get_all_posts')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts')
    }
    throw new Error('An unexpected error occurred')
  }
}