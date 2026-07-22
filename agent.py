from langchain.agents import create_agent
from config import llm
from tools.research_tool import research_tool
from tools.research_pdf_tool import research_report_pdf
from tools.research_markdown_tool import research_report_markdown
from tools.research_report_all import research_report_all


agent=create_agent(
    model=llm,
    tools=[
        research_tool,
        research_report_markdown,
        research_report_pdf,
        research_report_all
        ]
)