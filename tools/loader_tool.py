import os

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
os.environ["USER_AGENT"] = USER_AGENT

from langchain_community.document_loaders import WebBaseLoader

def load_webpages(urls: list[str]):
    """
    Load webpages and return a list of langchain documents, handling errors gracefully.
    """
    documents = []
    for url in urls:
        try:
            loader = WebBaseLoader(
                web_paths=[url],
                header_template={"User-Agent": USER_AGENT}
            )
            docs = loader.load()
            documents.extend(docs)
        except Exception as e:
            print(f"Failed to load {url}: {e}")
            continue

    return documents