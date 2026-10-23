from langchain_core.tools import tool

from services.research_service import generate_research_report
from services.save_markdown import save_markdown


@tool
def research_report_markdown(topic: str) -> str:
    """
    ONLY when the user says words like 'save as Markdown', 'export MD', or 'download Markdown'.
    This saves a .md file to disk. Do NOT call this for normal research questions.
    """

    report = generate_research_report(topic)

    filename = topic.lower().replace(" ", "_")

    markdown_path = save_markdown(report, filename)

    return (
        f"Research report generated successfully.\n"
        f"Markdown saved at: {markdown_path}"
    )