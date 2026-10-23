from tools.loader_tool import load_webpages
from utils.text_splitter import split_document
from chains.summarize_chain import summarize_chain
from chains.report_chain import report_chain
from tools.search_tool import search_tool
from utils.documentFilter import filter_documents
import time




def generate_research_report(  topic:str):

    filename = topic.lower().replace(" ", "_")
    
    results = search_tool.invoke(topic)

    
    urls = [result["link"] for result in results[:2]]

    
    documents = load_webpages(urls)

    
    filtered_documents = filter_documents(documents)
   
    
    chunks = split_document(filtered_documents)
  
    
    summaries = []

    for chunk in chunks:

        summary = summarize_chain.invoke(
            {
                "text": chunk.page_content
            }
        )

        summaries.append(summary)

        time.sleep(0.5) 

    # Combine summaries
    combined_summaries = "\n\n".join(summaries)

    # Generate report
    report = report_chain.invoke(
        {
            "topic": topic,
            "summaries": combined_summaries
        }
    )
    


    return report 

