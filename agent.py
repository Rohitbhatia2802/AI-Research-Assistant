from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from config import llm
from tools.research_tool import research_tool
from tools.research_pdf_tool import research_report_pdf
from tools.research_markdown_tool import research_report_markdown
from tools.research_report_all import research_report_all


checkpointer = MemorySaver()

agent=create_react_agent(
    model=llm,
    tools=[
        research_tool,
        research_report_markdown,
        research_report_pdf,
        research_report_all
        ],
    prompt=(
        "You are a research assistant. You MUST call a tool for every request.\n\n"
        "IMPORTANT RULES FOR TOOL SELECTION:\n"
        "1. By DEFAULT, always call 'research_tool'. This is the standard tool for any research question.\n"
        "2. ONLY call 'research_report_pdf' if the user explicitly says 'save as PDF', 'export PDF', or 'download PDF'.\n"
        "3. ONLY call 'research_report_markdown' if the user explicitly says 'save as Markdown', 'export MD', or 'download MD'.\n"
        "4. ONLY call 'research_report_all' if the user explicitly says 'save as both' or 'export both'.\n\n"
        "If the user's message does NOT contain words like 'save', 'export', 'download', 'PDF', or 'Markdown', "
        "you MUST use 'research_tool'. Never use an export tool unless the user explicitly asks to save a file."
    ),
    checkpointer=checkpointer,
)
