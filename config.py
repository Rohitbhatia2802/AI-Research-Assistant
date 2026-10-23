import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

# Uses Groq hosted inference. Default model can be customized via GROQ_MODEL in .env
groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

llm = ChatGroq(
    model=groq_model,
    temperature=0
)