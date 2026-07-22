from langchain_core.prompts import ChatPromptTemplate

report_prompt = ChatPromptTemplate.from_template(
    """
You are an expert research analyst.

The user requested research on:

Topic:
{topic}

Below are summaries collected from multiple trusted web sources:

{summaries}

Using these summaries, generate a professional research report.

The report must contain:

# Title

# Executive Summary

# Introduction

# Main Concepts

# Applications

# Advantages

# Challenges

# Current Developments

# Future Scope

# Conclusion

Do not invent facts.

Only use the information provided in the summaries.

Write in a professional tone.
"""
)