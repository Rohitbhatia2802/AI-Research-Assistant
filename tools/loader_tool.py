from langchain_community.document_loaders import WebBaseLoader

def load_webpages(urls: list[str]):
    """
    Load webpages and return a list of langchain documents
    """
    loader=WebBaseLoader(urls)
    documents= loader.load()

    return documents