from langchain_core.prompts import ChatPromptTemplate

prompt=ChatPromptTemplate.from_template(
    """
     You are an expert research assistant.

Your task is to summarize the following text while preserving all important facts.

Instructions:
- Keep the summary concise.
- Preserve technical details.
- Do not add information that is not present.
- Focus on key ideas.

Text:
{text}
"""
)