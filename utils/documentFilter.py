from langchain_core.documents import Document

MINIMUM_LENGTH=300

def filter_documents(documents:list[Document])->list[Document]:
    
    filtered_documents=[]

    seen_content= set()

    for document in documents:

        content= document.page_content.strip()

        if not content:
            continue

        if len(content)<MINIMUM_LENGTH:
            continue


        if content in seen_content:
            continue

        seen_content.add(content)
        filtered_documents.append(document)

    return filtered_documents