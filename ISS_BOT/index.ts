import DiscordJS, { Intents } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log("Bot is ready!");
});

const getISSLocation = async () => {
  return await axios.get("http://api.open-notify.org/iss-now.json");
};

client.on("messageCreate", async (message) => {
  if (message.content === "wya-iss") {
    getISSLocation().then((res) => {
      const lat = res.data.iss_position.latitude;
      const lon = res.data.iss_position.longitude;
      message.reply({
        content: `Hi ${message.author.username}, I'm currently here: `,
      });
      message.reply({
        content: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lon},${lat},9,0/400x400?access_token=YOUR_ACCESS_TOKEN_HERE`,
      });
    });
  }
});

client.login(process.env.TOKEN);
