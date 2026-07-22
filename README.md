# AI Research Assistant

An intelligent research assistant that automates the process of gathering, analyzing, and summarizing information from the web using Large Language Models (LLMs). Instead of manually visiting multiple websites, the assistant searches relevant sources, extracts useful content, generates concise summaries, and produces a well-structured research report.

The project is built using **LangChain**, **Ollama (Llama 3.2)**, **FastAPI**, and **Retrieval-Augmented Generation (RAG)**, enabling fast, local, and privacy-friendly research without relying on paid APIs.

## Features

* 🔍 Web search for relevant information
* 🌐 Extracts content from multiple web pages
* ✂️ Intelligent document chunking
* 🧠 AI-powered summarization using Llama 3.2
* 📄 Generates structured research reports
* 📝 Export reports in Markdown
* 📕 Export reports as PDF
* ⚡ REST APIs built with FastAPI
* 💬 Supports conversational research workflows
* 🔒 Runs completely locally with Ollama

## Tech Stack

* Python
* LangChain
* FastAPI
* Ollama
* Llama 3.2
* RAG (Retrieval-Augmented Generation)
* BeautifulSoup / WebBaseLoader
* ReportLab
* Markdown
* HTML & CSS (Frontend)

## Project Workflow

1. User enters a research topic.
2. The assistant searches the web for relevant sources.
3. Web pages are loaded and cleaned.
4. Documents are split into manageable chunks.
5. The LLM summarizes each chunk.
6. Summaries are combined into a comprehensive research report.
7. The final report can be viewed in the application or exported as Markdown and PDF.

## Use Cases

* Academic research
* Technical documentation
* Market research
* Learning new technologies
* Company and product research
* Competitive analysis
* Quick topic exploration

This project demonstrates the integration of LLMs, Retrieval-Augmented Generation (RAG), web search, and modern backend development to build an AI-powered research assistant capable of producing reliable, structured research reports efficiently.
