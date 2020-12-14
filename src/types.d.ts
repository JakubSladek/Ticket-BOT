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

/**************
 *  Commands  *
 *************/

export type command = {
	name: string,
	description: string,
	category: string,
	permissions: [],
	run: Function
}

/**************
 *  Messages  *
 *************/

export type embedArgs = {
	content: string,
	title: string?,
	color: string?,
	footer: string?
}