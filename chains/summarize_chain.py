from langchain_core.output_parsers import StrOutputParser
from config import llm
from prompts.summarize_prompt import prompt

summarize_chain=(
    prompt | llm | StrOutputParser()
)