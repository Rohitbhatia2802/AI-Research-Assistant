from urllib.parse import urlparse

TRUSTED_DOMAINS = {
    "ibm.com",
    "microsoft.com",
    "aws.amazon.com",
    "cloud.google.com",
    "docs.python.org",
    "python.org",
    "huggingface.co",
    "langchain.com",
    "geeksforgeeks.org",
    "datacamp.com",
    "wikipedia.org",
    "arxiv.org",
    "openai.com",
    "qdrant.tech",
    "pinecone.io",
    "weaviate.io",
}

BLOCKED_DOMAINS = {
    "facebook.com",
    "instagram.com",
    "twitter.com",
    "x.com",
    "linkedin.com",
    "reddit.com",
    "tiktok.com",
    "pinterest.com",
}