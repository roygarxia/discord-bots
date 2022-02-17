import DiscordJS, { Intents, Message } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";

const deepLAPI = "YOUR_DEEPL_API_KEY_HERE";
const deepLEP = "https://api-free.deepl.com/v2/translate";

dotenv.config();

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const getTrans = async (text: string, flag: string) => {
  let translation;
  try {
    translation = await axios.get(deepLEP, {
      params: { auth_key: deepLAPI, text: text, target_lang: flag },
    });
  } catch (e) {
    return "Failed to translate.";
  }

  if (translation.data === undefined) {
    return "Roy sucks because he can't afford better APIs with more language support.";
  }

  const detectedLang =
    translation.data.translations[0].detected_source_language;

  return `from ${detectedLang} to ${flag}: ${translation.data.translations[0].text}`;
};

client.on("ready", () => {
  console.log("Bot is ready!");
});

const flagMapObj: { [key: string]: any } = {
  "🇺🇸": "EN",
  "🇪🇸": "ES",
  "🇫🇷": "FR",
  "🇧🇬": "BG",
  "🇨🇿": "CS",
  "🇩🇪": "DE",
  "🇬🇷": "EL",
  "🇲🇽": "ES",
  "🇪🇪": "ET",
  "🇫🇮": "FI",
  "🇭🇺": "HU",
  "🇮🇹": "IT",
  "🇯🇵": "JA",
  "🇱🇹": "LT",
  "🇱🇻": "LV",
  "🇳🇱": "NL",
  "🇵🇱": "PL",
  "🇵🇹": "PT",
  "🇷🇴": "RO",
  "🇷🇺": "RU",
  "🇸🇰": "SL",
  "🇸🇪": "SV",
  "🇨🇳": "ZH",
};

client.on("messageReactionAdd", async (reaction, user) => {
  const message = reaction.message;
  const emoji = reaction.emoji.name!;
  let response = "";
  if (flagMapObj[emoji]) {
    response = await getTrans(message.toString(), flagMapObj[emoji]);
    message.reply({
      content: response,
    });
  } else {
    console.log("Emoji not registered.");
  }
});

client.login(process.env.TOKEN);
