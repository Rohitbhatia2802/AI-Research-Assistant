import time
from tools.loader_tool import load_webpages
from utils.text_splitter import split_document
from chains.summarize_chain import summarize_chain
from chains.report_chain import report_chain
from tools.search_tool import search_tool
from utils.documentFilter import filter_documents


def generate_research_report(topic: str) -> str:
    """
    End-to-end research pipeline:
    search → scrape → filter → chunk → summarise → generate report.
    Includes fallback to search snippets if scraping yields no usable content.
    """

    # 1. Search the web for relevant sources
    try:
        results = search_tool.invoke(topic)
    except Exception as e:
        print(f"Search tool error: {e}")
        results = []

    # Collect snippets from search results as reliable fallback context
    search_snippets = []
    urls = []
    if isinstance(results, list):
        for r in results:
            if isinstance(r, dict):
                link = r.get("link")
                snippet = r.get("snippet", "")
                title = r.get("title", "")
                if link and len(urls) < 3:
                    urls.append(link)
                if snippet:
                    search_snippets.append(f"- {title}: {snippet}")

    # 2. Scrape webpages
    documents = []
    if urls:
        documents = load_webpages(urls)

    # 3. Filter documents (removes empty, errors, pure noise)
    filtered_documents = filter_documents(documents) if documents else []

    # 4. Split documents into chunks
    chunks = split_document(filtered_documents) if filtered_documents else []

    # 5. Summarize chunks (capped at 5 to stay within rate limits)
    summaries = []
    for chunk in chunks[:5]:
        try:
            summary = summarize_chain.invoke({"text": chunk.page_content})
            if summary and summary.strip():
                summaries.append(summary.strip())
            time.sleep(0.4)
        except Exception as e:
            print(f"Summarize chunk error: {e}")
            continue

    # Combine chunk summaries
    combined_summaries = "\n\n".join(summaries)

    # 6. Fallback to search snippets if webpage scraping yielded no content
    if not combined_summaries.strip():
        if search_snippets:
            combined_summaries = "Key Web Findings:\n" + "\n".join(search_snippets)
        else:
            combined_summaries = f"Foundational concepts and principles regarding {topic}."

    # 7. Generate final comprehensive research report
    report = report_chain.invoke(
        {
            "topic": topic,
            "summaries": combined_summaries,
        }
    )

    return report
