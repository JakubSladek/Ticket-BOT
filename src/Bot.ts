require("dotenv").config();
import { Client, Collection, Message, Snowflake } from "discord.js";
import db from "quick.db";
import { command, ticket } from "./types";

class Bot extends Client {
	private commands: Collection<string, command> = new Collection<string, command>();

	constructor(options?: Object) {
		super(options);
	}

	/********************************************
	 *                COMMANDS                  *
	 *******************************************/

	public setCommand(name: string, commandFunction: command): void {
		this.commands.set(name, commandFunction);
	}

	public async getCommands(): Promise<Collection<string, command>> {
		return this.commands;
	}

	public async runCommand(cmd: command, message: Message): Promise<void> {
		cmd.run.bind(null, this, message);
	}

	/********************************************
	 *                 EVENTS                   *
	 *******************************************/

	public setEvent(name: string, eventFunction: Function): void {
		this.on(name, eventFunction.bind(null, this));
	}

	/********************************************
	 *            DB GLOBAL SETTINGS            *
	 *******************************************/

	public async getPrefix(guildID: Snowflake): Promise<string> {
		let prefix = await db.get(`Guild_${guildID}.settings.global.prefix`);

		if (!prefix) {
			if (typeof process.env.PREFIX === "undefined") throw "Missing prefix in '.env'!";
			prefix = process.env.PREFIX;
		}

		return prefix;
	}

	public async setPrefix(guildID: Snowflake, newPrefix: string): Promise<void> {
		await db.set(`Guild_${guildID}.settings.global.prefix`, newPrefix);

		return;
	}

	/********************************************
	 *            DB TICKET SETTINGS            *
	 *******************************************/

	public async getTicketCategory(guildID: Snowflake): Promise<string | boolean> {
		let result = await db.get(`Guild_${guildID}.settings.tickets.category`);

		return result || false;
	}

	public async setTicketCategory(guildID: Snowflake, categoryID: Snowflake): Promise<void> {
		db.set(`Guilds_${guildID}.settings.tickets.category`, categoryID);

		return;
	}

	public async getTicketSupportRole(guildID: Snowflake): Promise<string | boolean> {
		let result = await db.get(`Guild_${guildID}.settings.tickets.role`);

		return result || false;
	}

	public async setTicketSupportRole(guildID: Snowflake, roleID: Snowflake): Promise<void> {
		db.set(`Guilds_${guildID}.settings.tickets.role`, roleID);
	}

	public async getTicketReactionChannel(guildID: Snowflake): Promise<string | boolean> {
		let result = await db.get(`Guild_${guildID}.settings.tickets.channel`);

		return result || false;
	}

	public async setTicketReactionChannel(guildID: Snowflake, channelID: Snowflake): Promise<void> {
		db.set(`Guild_${guildID}.settings.tickets.channel`, channelID);

		return;
	}

	/*****************************************
	 *            DB TICKETS MISC            *
	 *****************************************/

	private async updateTicketInDB(guildID: Snowflake, ticketToUpdate: ticket): Promise<boolean> {
		if (!(await this.ticketExistsInDB(guildID, ticketToUpdate))) return false;

		const tickets: ticket[] = await this.getTickets(guildID);

		for (let i = 0; i < tickets.length - 1; i++) {
			if (tickets[i].id == ticketToUpdate.id) {
				tickets[i] = ticketToUpdate;

				break;
			}
		}

		return true;
	}

	private async removeTicketFromDB(guildID: Snowflake, ticketToRemove: ticket): Promise<boolean> {
		if (!(await this.ticketExistsInDB(guildID, ticketToRemove))) return false;

		const tickets: ticket[] = await this.getTickets(guildID);

		let ticketIndex: number | undefined = tickets.indexOf(ticketToRemove);

		if (!ticketIndex) return false;

		if (ticketIndex > -1) tickets.splice(ticketIndex, 1);

		await this.setTickets(guildID, tickets);

		return true;
	}

	private async ticketExistsInDB(guildID: Snowflake, ticketToFind: ticket): Promise<boolean> {
		const tickets: ticket[] | undefined = await this.getTickets(guildID);

		if (!tickets.length) return false;

		let ticketInDB: ticket | undefined = tickets.find((myTicket) => myTicket == ticketToFind);

		return ticketInDB ? true : false;
	}

	private async getTicketFromDB(guildID: Snowflake, ticketToGet: ticket): Promise<ticket | false> {
		const tickets: ticket[] | undefined = await this.getTickets(guildID);

		if (!tickets.length) return false;

		let findTicket: ticket | undefined = tickets.find((myTicket) => myTicket == ticketToGet);

		if (!findTicket) return false;

		return findTicket;
	}

	/*******************************************************
	 *            	TICKETS GETTERS / SETTERS              *
	 ******************************************************/

	public async getTickets(guildID: Snowflake): Promise<ticket[]> {
		return await db.get(`Guilds_${guildID}.tickets`);
	}

	public async setTickets(guildID: Snowflake, tickets: ticket[]): Promise<void> {
		await db.set(`Guilds_${guildID}.tickets`, tickets);

		return;
	}

	/************************************************
	 *                TICKETS GLOBAL                *
	 ************************************************/

	public async createTicket(guildID: Snowflake, newTicket: ticket): Promise<void> {
		db.push(`Guild_${guildID}.tickets`, newTicket);

		// create ticket channel and send message

		return;
	}

	public async reopenTicket(guildID: Snowflake, closedTicket: ticket): Promise<boolean> {
		const ticketInDB: ticket | false = await this.getTicketFromDB(guildID, closedTicket);

		if (!ticketInDB) return false;

		// Change ticket channel status to opened

		ticketInDB.resolved = false;

		this.updateTicketInDB(guildID, ticketInDB);

		return true;
	}

	public async resolveTicket(guildID: Snowflake, ticketToResolve: ticket): Promise<boolean> {
		const ticketinDB: ticket | false = await this.getTicketFromDB(guildID, ticketToResolve);

		if (!ticketinDB) return false;

		// change ticket channel status to resolved

		ticketToResolve.resolved = true;

		this.updateTicketInDB(guildID, ticketToResolve);

		return true;
	}

	public async deleteTicket(guildID: Snowflake, ticketToDelete: ticket): Promise<boolean> {
		if (!(await this.removeTicketFromDB(guildID, ticketToDelete))) return false;

		// remove ticket's channel

		return true;
	}

	/**********************************************************
	 *                 TOTAL CREATED TICKETS                  *
	 *********************************************************/

	public async getTotalCreatedTickets(guildID: Snowflake): Promise<number> {
		let totalTickets: number | undefined = await db.get(`Guilds_${guildID}.createdTickets`);

		return totalTickets || 0;
	}

	public async setTotalCreatedTickets(guildID: Snowflake, ticketsTotal: number): Promise<void> {
		await db.set(`Guilds_${guildID}.createdTickets`, ticketsTotal);

		return;
	}

	public async incrementTotalCreatedTickets(guildID: Snowflake): Promise<void> {
		let totalTickets: number = await this.getTotalCreatedTickets(guildID);

		totalTickets++;

		await this.setTotalCreatedTickets(guildID, totalTickets);

		return;
	}

	/**********************************************
	 *             TICKET CHANNELS                *
	 **********************************************/

	/*
	private async createTicketChannel(guildID: Snowflake, userID: Snowflake): Promise<void> {
		return;
	}

	private async addUserToTicket(guildID: Snowflake, selectedTicket: ticket, userID: Snowflake): Promise<void> {
		return;
	}

	private async removeUserFromTicket(guildID: Snowflake, selectedTicket: ticket, userID: Snowflake): Promise<void> {
		return;
	}

	private async closeTicket(guildID: Snowflake, selectedTicket: ticket): Promise<void> {
		return;
	}
	*/

	/*********************************************
	 *              TICKETS MISC                 *
	 *********************************************/

	transcriptTicket() {}

	/***********************************************
	 *                    LOGS                     *
	 ***********************************************/

	public async setDefaultLogChannel(guildID: Snowflake, channelID: Snowflake): Promise<void> {
		await db.set(`Guilds_${guildID}.defaultLogChannel`, channelID);

		return;
	}

	public async getDefaultLogChannel(guildID: Snowflake): Promise<Snowflake | boolean> {
		let logChannel: Snowflake | undefined = await db.get(`Guilds_${guildID}.defaultLogChannel`);

		if (!logChannel) return false;

		return logChannel;
	}
}

export default Bot;
