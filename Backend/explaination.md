# Implementing an Async FastAPI Endpoint for Blog Content Processing

This document explains how to build a Python FastAPI endpoint that accepts a blog post URL, processes the content through a multi-step AI pipeline, and stores the results in MongoDB. The workflow is based on the provided architectural diagram and project code.

## System Overview
- **Input:** Blog post URL (string)
- **Processing:** Asynchronous pipeline with agents for scraping, summarization, social post generation, review, and image creation
- **Output:** All generated content and metadata stored in MongoDB

## Pipeline Steps
1. **Web Scraper Agent**
   - Fetches HTML from the input URL
   - Extracts the main article text
   - Uses Firecrawl API for scraping
2. **Content Summarizer (LLM)**
   - Summarizes the scraped content using a language model (e.g., OpenAI GPT via LangChain)
   - Returns concise key points
3. **Social Media Agents**
   - Generate platform-specific posts:
     - LinkedIn (professional)
     - Instagram (casual)
     - Twitter/X (short tweet/thread)
   - Each uses a tailored system prompt and the summary as input
4. **Review Agent**
   - Checks grammar, style, relevance, and length for each post
   - Ensures content matches platform requirements
5. **Image Generation Agent**
   - Creates an infographic-style image using Gemini or OpenAI image models
   - Stores the image in Cloudinary and saves the URL
6. **MongoDB Storage**
   - All outputs (posts, image URL, metadata) are saved in a single MongoDB document
   - No versioning required; schema includes fields for each output and metadata

## FastAPI Endpoint Design
- **Route:** `POST /process-blog`
- **Request Body:** `{ "url": "<blog_post_url>" }`
- **Processing:**
  - Each step runs asynchronously (using `async def` and background tasks)
  - Error handling ensures failures in one step do not block others
  - Returns a job/status ID for long-running tasks
- **Response:**
  - Success: `{ "status": "completed", "data": { ... } }`
  - Failure: `{ "status": "error", "message": "..." }`

## Mapping to Project Code
- The notebook (`project.ipynb`) contains code for each agent and MongoDB storage
- Each function (scraping, summarizing, post creation, review, image generation, storage) should be refactored into async FastAPI route handlers or background tasks
- Use `motor` (async MongoDB driver) for database operations
- Use `httpx` or `aiohttp` for async HTTP requests to external APIs

## Error Handling & Scalability
- Use FastAPI's `BackgroundTasks` or Celery for heavy/long-running jobs
- Validate input URL before processing
- Log errors and return informative status messages

## Example MongoDB Document Structure
```
{
  "url": "<input_url>",
  "summary_results": "...",
  "linkedin_post": "...",
  "instagram_post": "...",
  "twitter_post": "...",
  "review_post": "...",
  "image": {
    "url": "...",
    "public_id": "...",
    "format": "...",
    "size": 12345
  },
  "created_at": "2025-11-23T12:00:00Z",
  "status": "pending_review"
}
```

## Recommendations
- Use environment variables for API keys and database URIs
- Modularize each agent as a separate function/class for maintainability
- Test each step independently before integrating into the endpoint
- Consider adding authentication and rate limiting for production

## Plan to Convert project.ipynb into a Modular FastAPI Endpoint

This plan outlines the steps and approach to refactor the notebook code into a production-ready, modular FastAPI service that exposes an asynchronous endpoint for blog post processing.

---

### 1. Analyze and Extract Notebook Logic
- Review each cell in project.ipynb to identify distinct functional blocks:
  - Environment/config loading
  - Web scraping (Firecrawl)
  - Content summarization (LangChain/OpenAI)
  - Social media post generation (LinkedIn, Instagram, Twitter)
  - Review agent (LLM-based editing)
  - Image generation (OpenAI/Gemini, Cloudinary upload)
  - MongoDB document creation and storage

---

### 2. Define FastAPI Project Structure
- Create a new directory structure:
  ```
  content_creation_api/
    ├── main.py
    ├── api/
    │     └── endpoints.py
    ├── services/
    │     ├── scraping.py
    │     ├── summarization.py
    │     ├── social_posts.py
    │     ├── review.py
    │     ├── image_generation.py
    │     └── storage.py
    ├── models/
    │     └── schemas.py
    ├── config.py
    ├── requirements.txt
    └── utils.py
  ```
- Use environment variables for secrets and config (via python-dotenv or FastAPI settings).

---

### 3. Modularize Each Pipeline Step
- **Scraping Service:**  
  - Move Firecrawl logic to services/scraping.py
  - Implement async scraping function
- **Summarization Service:**  
  - Move LangChain/OpenAI summarization logic to services/summarization.py
  - Implement async summarization function
- **Social Media Post Services:**  
  - LinkedIn, Instagram, Twitter logic to services/social_posts.py
  - Each as a separate async function
- **Review Service:**  
  - LLM-based review logic to services/review.py
  - Async review function
- **Image Generation Service:**  
  - OpenAI/Gemini image generation and Cloudinary upload to services/image_generation.py
  - Async image creation and upload
- **Storage Service:**  
  - MongoDB logic to services/storage.py
  - Use motor for async DB operations

---

### 4. Define Pydantic Models
- Create request and response schemas in models/schemas.py
- Define MongoDB document structure

---

### 5. Implement FastAPI Endpoint
- In api/endpoints.py, define a POST /process-blog endpoint:
  - Accepts { "url": "<blog_post_url>" }
  - Orchestrates the pipeline using async calls to service functions
  - Handles errors and returns status/data

---

### 6. Orchestration and Error Handling
- Use async/await for all I/O-bound operations
- Consider FastAPI BackgroundTasks or Celery for long-running jobs
- Implement logging and error reporting

---

### 7. Testing and Validation
- Write unit tests for each service module
- Test endpoint with valid/invalid URLs
- Validate MongoDB document creation

---

### 8. Deployment and Production Readiness
- Add requirements and setup scripts
- Containerize with Docker if needed
- Add authentication/rate limiting if required

---

### 9. Documentation
- Document API usage, environment setup, and each module
- Provide example requests/responses

---

### Summary
This approach ensures maintainable, testable, and scalable code by separating concerns into service modules, using async operations, and leveraging FastAPI’s strengths for API development.

---




