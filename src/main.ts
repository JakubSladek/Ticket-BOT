import { Intents } from "discord.js";
import bindCommands from "./handlers/commands";
import bindEvents from "./handlers/events";
import Bot from "./Bot";

require("dotenv").config();

const bot = new Bot({ disableMentions: "everyone", partials: ["MESSAGE", "CHANNEL", "REACTION"], ws: { intents: Intents.ALL } });

[ bindCommands, bindEvents ].forEach((handler) => {
    handler(bot);
});

bot.login(process.env.TOKEN);