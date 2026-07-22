from langchain_core.output_parsers import StrOutputParser

from config import llm
from prompts.report_prompt import report_prompt

report_chain = (
    report_prompt
    | llm
    | StrOutputParser()
)