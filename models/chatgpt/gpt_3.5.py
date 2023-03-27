import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def chat(prompt, top_p=0.5, max_tokens=150, temperature=1):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=max_tokens,
        n=1,
        stop=None,
        temperature=temperature,
        top_p=top_p,
    )
    return response.choices[0].text.strip()

if __name__ == "__main__":
    prompt = "Write a Python function to calculate the factorial of a number."
    result = chat(prompt, top_p=0.8)
    print(result)