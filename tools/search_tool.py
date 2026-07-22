from langchain_community.tools import DuckDuckGoSearchResults

search_tool=DuckDuckGoSearchResults(
    output_format="list"
)
