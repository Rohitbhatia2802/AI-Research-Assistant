from langchain_core.messages import HumanMessage

from agent import agent

query = input("Enter your request: ")

response = agent.invoke(
    {
        "messages": [
            HumanMessage(content=query)
        ]
    }
)

print(response["messages"][-1].content)