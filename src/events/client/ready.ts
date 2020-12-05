import Bot from "../../Bot";
require("dotenv").config();

module.exports = async (bot: Bot) => {
    bot.user?.setActivity(`support steamlevels.eu`, { type: "WATCHING" });

    console.log(`Logged in as '${bot.user?.tag}' on '${bot.guilds.cache.size}' servers.`);
    console.log(`Default prefix: '${process.env.PREFIX}'`);
}