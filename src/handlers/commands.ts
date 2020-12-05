import { readdirSync } from "fs";
import Bot from "../Bot";

const commandsFolderPath: string = `./commands/`;

async function bindCommands(bot: Bot) {
	readdirSync(commandsFolderPath).forEach((dir) => {
		const commands = readdirSync(`${commandsFolderPath}/${dir}/`).filter((file) => file.endsWith(`.js`));

		commands.forEach((file) => {
			const command: any = require(`.${commandsFolderPath}${dir}/${file}`);

			bot.setCommand(command.name, command);
		});
	});

	console.log(`Loaded ${bot.getCommands().size} commands.`);
}

export default bindCommands;