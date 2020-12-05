import { Snowflake } from "discord.js";

/***********
 * Tickets *
 **********/

export type ticket = {
	id: number;
	channelID: Snowflake;
	userID: Snowflake;
	resolved: boolean;
};
