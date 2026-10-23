from langchain_core.documents import Document

MINIMUM_LENGTH=300

ERROR_PATTERNS = [
    "429 Too Many Requests",
    "Too many requests",
    "Request served by",
    "Varnish",
    "Cloudflare",
    "Access Denied",
    "Forbidden",
    "Bad Gateway",
    "Service Unavailable",
    "404",
    "403",
    "500 Internal Server Error",
    "Captcha",
    "Verify you are human",
]

NOISE_PATTERNS = [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "Sign In",
    "Login",
    "Register",
    "Subscribe",
]

# ---------------------- Helper Functions ---------------------- #

def is_empty(content: str) -> bool:
    """
    Check whether the document is empty.
    """
    return len(content.strip()) == 0


def is_short(content: str) -> bool:
    """
    Check whether the document is too short.
    """
    return len(content) < MINIMUM_LENGTH


def is_duplicate(content: str, seen_content: set) -> bool:
    """
    Check if document content already exists.
    """
    return content in seen_content


def is_error_page(content: str) -> bool:
    """
    Detect common server error pages.
    """
    content = content.lower()

    return any(
        pattern.lower() in content
        for pattern in ERROR_PATTERNS
    )


def is_noise_page(content: str) -> bool:
    """
    Detect navigation or boilerplate pages.
    """
    content = content.lower()

    return any(
        pattern.lower() in content
        for pattern in NOISE_PATTERNS
    )

#--------------Main Function--------------------------#

def filter_documents(documents: list[Document]) -> list[Document]:
    """
    Filter documents before sending them to the LLM.

    Removes:
    - Empty pages
    - Very short pages
    - Duplicate pages
    - Error pages (429, Cloudflare, etc.)
    - Navigation / boilerplate pages
    """

    filtered_documents = []
    seen_content = set()

    for document in documents:

        content = document.page_content.strip()

        # Empty document
        if is_empty(content):
            print("Skipped: Empty document")
            continue

        # Very short document
        if is_short(content):
            print("Skipped: Short document")
            continue

        # Duplicate document
        if is_duplicate(content, seen_content):
            print("Skipped: Duplicate document")
            continue

        # HTTP / Server error pages
        if is_error_page(content):
            print("Skipped: Error page")
            continue

        # Navigation / Boilerplate pages
        if is_noise_page(content):
            print("Skipped: Noise page")
            continue

        seen_content.add(content)
        filtered_documents.append(document)

    print(f"\nFiltered {len(filtered_documents)} valid document(s).\n")

    return filtered_documents