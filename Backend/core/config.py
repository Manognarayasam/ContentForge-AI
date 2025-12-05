import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # API keys / credentials
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GOOGLE_APPLICATION_CREDENTIALS = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")

    # Database and project settings
    MONGODB_URI = os.environ.get("MONGODB_URI", "")
    PROJECT_NAME = os.environ.get("PROJECT_NAME", "")
    FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY", "")
    CLOUDINARY_URL = os.environ.get("CLOUDINARY_URL", "")

    CLOUDINARY_CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY = os.environ.get("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "")