from langchain.tools import tool
from services.research_service import generate_research_report


@tool
def research_tool(topic:str)->str:
    """
    DEFAULT tool. Use this for any research request.
    This tool searches the web, summarizes findings, and returns a text response.
    It does NOT save any files. No PDF, no Markdown files are created.
    """
    result=generate_research_report(topic)

    return result

