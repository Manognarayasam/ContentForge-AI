from fastapi import FastAPI
from fastapi import HTTPException
from datetime import datetime
from services.helper_functions import (
    scrap_blog_content,
    summarize_content,
    create_linkedin_post,
    create_instagram_post,
    create_twitter_post,
    review_posts,
    create_image,
    upload_image_to_cloudinary,
    store_in_mongodb,
    get_all_posts
)
import logging
from fastapi.middleware.cors import CORSMiddleware
logging.basicConfig(level=logging.INFO)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello FastAPI!"}

#CROS 
    

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/create_post_from_blog")
async def create_post_from_blog(payload: dict):
    input_url = payload.get("input_url")
    if not input_url:
        logging.error("input_url is missing in payload")
        raise HTTPException(status_code=400, detail="input_url is required")
    logging.info(f"Received input_url: {input_url}")

    # Step 0: Scrape the blog content from the input_url
    logging.info("Scraping blog content...")
    blog_content = await scrap_blog_content(input_url)
    logging.info("Blog content scraped successfully.")

    # Step 1: Summarize the blog content from the input_url
    logging.info("Summarizing blog content...")
    summary_result = await summarize_content(blog_content)
    logging.info("Blog content summarized.")

    # Step 2: Create posts using the summarized content
    logging.info("Creating LinkedIn post...")
    linkedin_post = await create_linkedin_post(summary_result)
    logging.info("LinkedIn post created.")

    logging.info("Creating Instagram post...")
    instagram_post = await create_instagram_post(summary_result)
    logging.info("Instagram post created.")

    logging.info("Creating Twitter post...")
    twitter_post = await create_twitter_post(summary_result)
    logging.info("Twitter post created.")

    # Step 3: Review the post content
    logging.info("Reviewing post content...")
    review = await review_posts(summary_result, linkedin_post, instagram_post, twitter_post)
    logging.info("Post content reviewed.")

    # Step 4: Create image for the post
    logging.info("Generating image for the post...")
    image = await create_image(summary_result)
    logging.info("Image generated.")

    # Step 5: Upload the image to Cloudinary
    logging.info("Uploading image to Cloudinary...")
    cloudinary_response = await upload_image_to_cloudinary(image)
    logging.info(f"Image uploaded to Cloudinary: {cloudinary_response.get('secure_url')}")

    document = {
        "url": input_url,
        "summary_results": summary_result,
        "linkedin_post": linkedin_post,
        "instagram_post": instagram_post,
        "twitter_post": twitter_post,
        "review_post": review,
        "image": {
            "url": cloudinary_response["secure_url"],
            "public_id": cloudinary_response["public_id"],
            "format": cloudinary_response["format"],
            "size": cloudinary_response.get("bytes", None)
        },
        "created_at": datetime.utcnow(),
        "status": "pending_review"
    }

    # Step 6: Store the post data in MongoDB
    logging.info("Storing post data in MongoDB...")
    db_response = await store_in_mongodb(document)
    logging.info("Post data stored in MongoDB.")

    return f"process successfully completed. {db_response}"

# Let's add an endpoint to get all posts from the database
@app.get("/get_all_posts")
async def get_all_posts_endpoint():
    try:
        posts = await get_all_posts()
        return posts
    except Exception as e:
        logging.error(f"Error fetching posts: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch posts")