from core.config import Config
from firecrawl import Firecrawl
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from openai import OpenAI
import base64
import uuid
import cloudinary
import cloudinary.uploader
from pymongo import MongoClient



# Write down all the functions from your IPYNB file

# Function-1 TO scrap the blog content from the input_url
async def scrap_blog_content(input_url: str) -> str:
    firecrawl = Firecrawl(api_key=Config.FIRECRAWL_API_KEY)
    scrape_result = firecrawl.scrape(input_url, formats=['markdown'])
    return scrape_result


## Helper function to extract AI content from various result formats
def get_ai_content(result):
    if hasattr(result, "content"):
        return result.content
    if isinstance(result, dict) and "messages" in result:
        msg = result["messages"][-1]
        return msg.content if hasattr(msg, "content") else msg.get("content", msg)
    return result


#Function 2: summarize the blog content
async def summarize_content(scrape_result: str) -> str:
   
   #This is the final result to be returned
   summary="Dummy test - function not implemented yet"
   
   # These are the instruftions for the AI model
   SYSTEM_PROMPT="You are a helpful assistant that summarizes content concisely."

   #Create the model instance 
   model = ChatOpenAI(
    model="gpt-4.1",
    api_key=Config.OPENAI_API_KEY,
    temperature=0.5,
    max_tokens=3000,
    timeout=30
)

   # Create the agent
   agent = create_agent(model, system_prompt=SYSTEM_PROMPT)
   
   # Run the agent to get the summary with scraped content as input
   result=agent.invoke(
     {"messages": [{"role": "user", "content": f"Please summarize the following content:\n{scrape_result}"}]}
    )

   # use the helper function to extract the content 
   summary = get_ai_content(result)

   # Finally return the summary
   
   return summary
   

# Function-3: LinkedIn Agent to create post on LinkedIn
async def create_linkedin_post(summary_result):
   
   # These are the instruftions for the AI model
   SYSTEM_PROMPT="You are a helpful assistant that creates professional LinkedIn posts concisely."

   #Create the model instance 
   model = ChatOpenAI(
    model="gpt-4.1",
    api_key=Config.OPENAI_API_KEY,
    temperature=0.5,
    max_tokens=3000,
    timeout=30
)

   # Create the agent
   agent = create_agent(model, system_prompt=SYSTEM_PROMPT)
   
   # Run the agent to get the summary with scraped content as input
   result=agent.invoke(
     {"messages": [{"role": "user", "content": f"Please create a LinkedIn post based on the following summary:\n{summary_result}"}]}
    )

   # use the helper function to extract the content 
   linkedin_post = get_ai_content(result)

   # Finally return the summary
   
   return linkedin_post
   
# Function 4: Instagram Agent to create post on Instagram
async def create_instagram_post(summary_result):
   
 
   # These are the instruftions for the AI model
   SYSTEM_PROMPT="You are a helpful assistant that creates casual Instagram posts concisely."

   #Create the model instance 
   model = ChatOpenAI(
    model="gpt-4.1",
    api_key=Config.OPENAI_API_KEY,
    temperature=0.5,
    max_tokens=3000,
    timeout=30
)

   # Create the agent
   agent = create_agent(model, system_prompt=SYSTEM_PROMPT)
   
   # Run the agent to get the summary with scraped content as input
   result=agent.invoke(
     {"messages": [{"role": "user", "content": f"Please create a instagram post based on the following summary:\n{summary_result}"}]}
    )

   # use the helper function to extract the content 
  
   instagram_post = get_ai_content(result)

   # Finally return the summary
   
   return instagram_post
   
# Function 5: Twitter Agent to create post on Twitter

async def create_twitter_post(summary_result):
   
   # These are the instruftions for the AI model
   SYSTEM_PROMPT="You are a helpful assistant that creates professional Twitter posts concisely."

   #Create the model instance 
   model = ChatOpenAI(
    model="gpt-4.1",
    api_key=Config.OPENAI_API_KEY,
    temperature=0.5,
    max_tokens=3000,
    timeout=30
)

   # Create the agent
   agent = create_agent(model, system_prompt=SYSTEM_PROMPT)
   
   # Run the agent to get the summary with scraped content as input
   result=agent.invoke(
     {"messages": [{"role": "user", "content": f"Please create a Twitter post based on the following summary:\n{summary_result}"}]}
    )

   # use the helper function to extract the content 
   twitter_post = get_ai_content(result)

   # Finally return the summary
   
   return twitter_post
   
#Function 6:Reciew the post content using GPT-4 Agent
async def review_posts(summary_result,linkedin_post,instagram_post,twitter_post):

   
   # These are the instruftions for the AI model
   SYSTEM_PROMPT="You are a helpful assistant that reviews the linkedin_post,instagram_post, and twitter_post concisely. Grammar: Check for spelling, punctuation, and sentence structure.  Style: Ensure tone and style match the target platform. Relevance: Verify content aligns with the provided summary. Length: Confirm posts meet platform character limits." 

   #Create the model instance 
   model = ChatOpenAI(
    model="gpt-4.1",
    api_key=Config.OPENAI_API_KEY,
    temperature=0.5,
    max_tokens=3000,
    timeout=30
)

   # Create the agent
   agent = create_agent(model, system_prompt=SYSTEM_PROMPT)
   
   # Run the agent to get the summary with scraped content as input
   result=agent.invoke(
     {"messages": [{"role": "user", "content": f"Please Review the linkedin_post,instagram_post, and twitter_post based on the following summary:\n{summary_result}\n{linkedin_post}\n{instagram_post}\n{twitter_post}"}]}
    )

   # use the helper function to extract the content 
   reviewed_posts = get_ai_content(result)

   # Finally return the summary
   
   return reviewed_posts
   
# Function-7: Create image for the post using DALL-E Agent

async def create_image(summary_result):
    client = OpenAI() 

    prompt = f"""Generate a clean and simple thumbnail image suitable for LinkedIn, Instagram, and Twitter posts. 
    Use minimal but strong colors, clean typography, and a visually appealing layout. Avoid clutter. 
    This is the blog summary for your reference: {summary_result}"""


    response = client.responses.create(
        model="gpt-5",
        input=prompt,
        tools=[{"type": "image_generation"}],
    )


    # Make filename unique by adding timestamp
    #filename = f"{filename}_{int(time.time())}.png"

    # Save the image to a file
    image_data = [
        output.result
        for output in response.output
        if output.type == "image_generation_call"
    ]
    # Generate a random Version 4 UUID
    new_uuid = uuid.uuid4()
        
    if image_data:
        image_base64 = image_data[0]
        with open(f"Images/image_{new_uuid}.png", "wb") as f:
            f.write(base64.b64decode(image_base64))
    
    return f"Images/image_{new_uuid}.png"

# Function 8: cloudinary upload function
async def upload_image_to_cloudinary(image_path: str) -> str:
    cloudinary.config( 
        cloud_name = Config.CLOUDINARY_CLOUD_NAME, 
        api_key = Config.CLOUDINARY_API_KEY, 
        api_secret = Config.CLOUDINARY_API_SECRET, 
        secure=True
    )

    cloudinary_response = cloudinary.uploader.upload(image_path)
    return cloudinary_response

# Function 9: Store the post data in MongoDB
#Write your function here to take the document and store it in MongoDB
async def store_in_mongodb(document):
    # Connect to MongoDB using the URI from the notebook globals
    client = MongoClient(Config.MONGODB_URI)
    db = client["content_creation_db"]
    collection = db["posts"]

    # Insert the document
    result = collection.insert_one(document)
    print(f"Document inserted with _id: {result.inserted_id}")
    return result.inserted_id

#let's write a getter function to get the list of all posts from MongoDB
async def get_all_posts():
    # Connect to MongoDB using the URI from the notebook globals
    client = MongoClient(Config.MONGODB_URI)
    db = client["content_creation_db"]
    collection = db["posts"]

    # Fetch all documents
    posts = list(collection.find())
    
    # Convert MongoDB objects to JSON serializable format
    for post in posts:
        # Convert ObjectId to string
        if '_id' in post:
            post['_id'] = str(post['_id'])
        
        # Convert datetime objects to ISO format strings
        if 'created_at' in post and hasattr(post['created_at'], 'isoformat'):
            post['created_at'] = post['created_at'].isoformat()
    
    return posts



#Scheduling the post in twitter using tweepy