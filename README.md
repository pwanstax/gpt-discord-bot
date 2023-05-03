# Discord GPT-3 Chatbot

This Discord bot allows users to interact with an AI chatbot powered by OpenAI's GPT-3. Users can ask questions and receive responses through the `/ask` command.

## Prerequisites

1. Node.js (v14 or higher)
2. npm (Comes with Node.js)
3. OpenAI API key

## Setup

1. Clone the repository:
`git clone https://github.com/your-username/discord-gpt-bot.git`

2. Enter the repository folder:
`cd discord-gpt-bot`

3. Install the required dependencies:
`npm install`

4. Create a .env file in the root directory and add the following environment variables:
`TOKEN=your_discord_bot_token`
`CLIENT_ID=your_discord_client_id`
`API_KEY=your_openai_api_key`

Replace `your_discord_bot_token`, `your_discord_client_id`, and `your_openai_api_key` with your actual Discord bot token, Discord client ID, and OpenAI API key, respectively.

5. Start the bot:
`npm run dev`

The bot should now be running and connected to your Discord server.

## Usage

1. Invite the bot to your Discord server using the link provided in the Discord Developer Portal.
2. Use the /ask command in any channel to ask the chatbot a question:
`/ask What is the capital of France?`

The bot will respond to your question with an answer from the GPT-3 AI.

## Contributing

Feel free to submit pull requests, open issues, or provide suggestions to improve the bot.

## License

This project is licensed under the ISC License.



