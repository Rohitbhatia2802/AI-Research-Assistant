from langchain.tools import tool
from services.research_service import generate_research_report


@tool
def research_tool(topic:str)->str:
    """
    ONLY use this tool when the user wants a research report.
    Do NOT use it if the user requests PDF or Markdown.
    """
    result=generate_research_report(topic)

    return result["report"]

