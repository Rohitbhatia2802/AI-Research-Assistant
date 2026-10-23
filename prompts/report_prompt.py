from langchain_core.prompts import ChatPromptTemplate

report_prompt = ChatPromptTemplate.from_template(
    """
You are an expert research analyst.

The user requested an in-depth research report on:

Topic:
{topic}

Below are summaries and insights collected from research sources:

{summaries}

Using these insights as your primary reference, produce a comprehensive, structured research report.
If any specific section is not fully detailed in the collected summaries, draw upon your verified scientific and domain knowledge to provide rigorous, accurate, and detailed coverage.

The report must follow this exact markdown structure:

# {topic}

## Executive Summary

## Introduction

## Main Concepts and Fundamental Principles

## Practical Applications and Industry Use Cases

## Key Advantages and Benefits

## Critical Challenges, Risks, and Limitations

## Current Developments and State of the Art

## Future Scope and Research Directions

## Conclusion

Ensure every section is thoroughly elaborated with clear paragraphs, bullet points where appropriate, and professional technical terminology. Do not output conversational apologies or meta-commentary.
"""
)