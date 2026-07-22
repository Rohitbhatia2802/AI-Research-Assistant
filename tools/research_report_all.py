from langchain_core.tools import tool

from services.research_service import generate_research_report
from services.save_pdf import save_pdf
from services.save_markdown import save_markdown


@tool
def research_report_all(topic: str) -> str:
    """
    ONLY use this tool when the user explicitly requests BOTH PDF and Markdown.
    """

    report = generate_research_report(topic)

    filename = topic.lower().replace(" ", "_")

    pdf_path = save_pdf(report, filename)
    markdown_path = save_markdown(report, filename)

    return (
        f"Research report generated successfully.\n"
        f"PDF saved at: {pdf_path}\n"
        f"Markdown saved at: {markdown_path}"
    )