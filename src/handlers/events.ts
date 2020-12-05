import { readdirSync } from "fs";
import Bot from "../Bot";

const eventsFolderPath : string = `./events/`;

async function bindEvents(bot: Bot) {
	readdirSync(eventsFolderPath).forEach((dir) => {
		const events = readdirSync(`${eventsFolderPath}/${dir}/`).filter((file) => file.endsWith(`.js`));

		for (const file of events) {
			const event = require(`.${eventsFolderPath}${dir}/${file}`);
			const eventName : string = file.split(".")[0];

			bot.setEvent(eventName, event);
		}
	});
}

export default bindEvents;
