import os

def save_markdown(report: str, filename: str):
    
    os.makedirs("reports", exist_ok=True)

    filepath = os.path.join("reports", f"{filename}.md")

    with open(filepath, "w", encoding="utf-8") as file:
        file.write(report)

    return filepath