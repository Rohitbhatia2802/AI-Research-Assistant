from langchain_core.documents import Document

MINIMUM_LENGTH = 300

ERROR_PATTERNS = [
    "429 too many requests",
    "access denied",
    "403 forbidden",
    "404 not found",
    "500 internal server error",
    "502 bad gateway",
    "503 service unavailable",
    "verify you are human",
    "checking your browser before accessing",
    "enable javascript and cookies to continue",
]

NOISE_PATTERNS = [
    "please log in to continue",
    "sign in to your account",
    "you need to enable cookies",
    "create an account to continue reading",
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
    Check if document content prefix already exists.
    """
    prefix = content[:500]
    return prefix in seen_content


def is_error_page(content: str) -> bool:
    """
    Detect common server error pages.
    Error pages are typically short (< 2000 chars) and contain an explicit error indicator.
    """
    if len(content) < 2000:
        lower = content.lower()
        return any(pattern in lower for pattern in ERROR_PATTERNS)
    return False


def is_noise_page(content: str) -> bool:
    """
    Detect navigation, paywall, or login-only pages.
    Only classifies as noise if the document is short and predominantly a login/cookie barrier.
    """
    if len(content) < 1000:
        lower = content.lower()
        return any(pattern in lower for pattern in NOISE_PATTERNS)
    return False

# ---------------------- Main Function -------------------------- #

def filter_documents(documents: list[Document]) -> list[Document]:
    """
    Filter documents before sending them to the LLM.

    Removes:
    - Empty pages
    - Very short pages (< 300 chars)
    - Duplicate pages
    - Explicit server error pages
    - Pure login/paywall barrier pages
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

        # Server error pages
        if is_error_page(content):
            print("Skipped: Error page")
            continue

        # Pure login/boilerplate pages
        if is_noise_page(content):
            print("Skipped: Noise page")
            continue

        seen_content.add(content[:500])
        filtered_documents.append(document)

    print(f"\nFiltered {len(filtered_documents)} valid document(s).\n")
    return filtered_documents