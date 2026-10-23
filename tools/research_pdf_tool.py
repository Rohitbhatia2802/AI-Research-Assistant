from langchain_core.tools import tool

from services.research_service import generate_research_report
from services.save_pdf import save_pdf


@tool
def research_report_pdf(topic: str) -> str:
    """
    ONLY when the user says words like 'save as PDF', 'export PDF', or 'download PDF'.
    This saves a .pdf file to disk. Do NOT call this for normal research questions.
    """

    report = generate_research_report(topic)

    filename = topic.lower().replace(" ", "_")

    pdf_path = save_pdf(report, filename)

    return (
        f"Research report generated successfully.\n"
        f"PDF saved at: {pdf_path}"
    )