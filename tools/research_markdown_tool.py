from langchain_core.tools import tool

from services.research_service import generate_research_report
from services.save_markdown import save_markdown


@tool
def research_report_markdown(topic: str) -> str:
    """
    ONLY use this tool when the user explicitly asks to save the report as Markdown.
    """

    report = generate_research_report(topic)

    filename = topic.lower().replace(" ", "_")

    markdown_path = save_markdown(report, filename)

    return (
        f"Research report generated successfully.\n"
        f"Markdown saved at: {markdown_path}"
    )