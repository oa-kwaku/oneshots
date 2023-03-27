import argparse


def main():
    parser = argparse.ArgumentParser(description="GPT Programming Assistant")

    parser.add_argument("query", type=str, help="The query for GPT")
    parser.add_argument("-t", "--top-p", type=float, default=0.5, help="The top-p value for GPT")

    args = parser.parse_args()

    response = call_gpt_api(args.query, args.top_p)

    display_result(response)


def call_gpt_api(query, top_p):
    print(f"Query: {query}")
    print(f"Top-p: {top_p}")
    # Implement the GPT API call here


def display_result(response):
    print("Displaying result:")
    print(response)
    # Implement the display of GPT's response here


if __name__ == "__main__":
    main()