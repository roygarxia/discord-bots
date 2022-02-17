import DiscordJS, { Intents } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";

const appID = "YOUR_WALPHA_ID_HERE";
const baseURL = "http://api.wolframalpha.com/v1/conversation.jsp";

dotenv.config();

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log("Bot is ready!");
});

const getAnswer = async (q: string) => {
  const cleanQ = q.substring(1);
  let answer;
  try {
    answer = await axios.get(baseURL, {
      params: { appid: appID, i: cleanQ },
    });
  } catch (e) {
    return "Stupid question. Ask something else please!";
  }
  if (answer.data.result === undefined) {
    return "Stupid question. Please ask a different one!";
  }
  return answer.data.result;
};

client.on("messageCreate", async (message) => {
  if (message.content.charAt(0) === "~") {
    const wolframAnswer = await getAnswer(message.content);

    message.reply({
      content: wolframAnswer,
    });
  }
});

client.login(process.env.TOKEN);
