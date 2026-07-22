import os

from reportlab.platypus import SimpleDocTemplate
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet


def save_pdf(report: str, filename: str):
    """
    Save the research report as a PDF.

    Args:
        report: Final research report.
        filename: Name of the PDF without extension.
    """

    os.makedirs("reports", exist_ok=True)

    filepath = os.path.join("reports", f"{filename}.pdf")

    document = SimpleDocTemplate(filepath)

    styles = getSampleStyleSheet()

    story = []

    for line in report.split("\n"):

        if line.strip():

            story.append(
                Paragraph(line, styles["BodyText"])
            )

    document.build(story)

    return filepath