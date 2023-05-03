require("dotenv/config");
const {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  IntentsBitField,
} = require("discord.js");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {Configuration, OpenAIApi} = require("openai");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

async function registerCommands() {
  const commands = [
    {
      name: "ask",
      description: "Ask the chatbot a question",
      options: [
        {
          name: "question",
          description: "Your question for the chatbot",
          type: 3,
          required: true,
        },
      ],
    },
  ];
  const rest = new REST({version: "9"}).setToken(process.env.TOKEN);
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        "1017273409769570386" //slash serverId
      ),
      {body: commands}
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

async function handleChat(message, interaction = null, ask = null) {
  let conversationLog = [
    {role: "system", content: "You are a programming chatbot."},
  ];
  if (
    message &&
    (message.content.startsWith("!") ||
      message.content.startsWith("/") ||
      message.author.bot)
  )
    return;
  if (
    message &&
    message.channelId !== "1103408636144910457" && //available channelId
    message.channelId !== "861250148746264586"
  ) {
    return;
  }

  try {
    if (message) {
      await message.channel.sendTyping();
    } else if (interaction) {
      await interaction.deferReply();
    }
    if (!ask) {
      let prevMessages = await (message
        ? message.channel
        : interaction.channel
      ).messages.fetch({limit: 15});
      prevMessages.reverse();
      prevMessages.forEach((msg) => {
        if (msg.author.id !== client.user.id && msg.author.bot) return;
        if (
          msg.author.id !== (message ? message.author.id : interaction.user.id)
        )
          return;
        conversationLog.push({
          role: "user",
          content: msg.content,
        });
      });
    } else {
      conversationLog = [
        {
          role: "user",
          content: ask,
        },
      ];
    }
    const result = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationLog,
        max_tokens: 2000, // limit token usage
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });

    if (message) {
      message.reply(result.data.choices[0].message.content);
    } else if (interaction) {
      interaction.followUp(result.data.choices[0].message.content);
    }
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
}

client.on("ready", () => {
  console.log("The bot is online!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const {commandName} = interaction;

  if (commandName === "ask") {
    const userQuestion = interaction.options.getString("question");
    await handleChat(null, interaction, userQuestion);
  }
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  await handleChat(message);
});
registerCommands();

client.login(process.env.TOKEN);
