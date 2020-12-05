import { Message } from "discord.js";
import Bot from "../../Bot";

module.exports = async (bot: Bot, message: Message) => {
	if (message.author.bot) return;
	if (!message.guild) return;

	const prefix: string = await bot.getPrefix(message.guild.id);

	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(/\s+/g);
	const cmd = args.shift()?.toLowerCase();

	if (!cmd?.length) return;

	if (message.author.id !== message.guild.ownerID) return;

	let commands = await bot.getCommands();

    if (!commands) return;

	const command: Function | undefined = commands.get(cmd);

	if (command) commands.get(cmd)?.bind(null, bot);
};
