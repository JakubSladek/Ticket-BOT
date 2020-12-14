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
	
	public async runCommand(command : command, message: Message) : Promise<void> {
		command.run.bind(null, this, message);
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

			if (!result) return false;

			return result;
	}

	public setTicketCategory(guildID: Snowflake, categoryID: Snowflake) : void {
		db.set(`Guilds_${guildID}.settings.tickets.category`, categoryID);
		
		return;
    }

	public async getTicketSupportRole(guildID: Snowflake) : Promise<string | boolean> {
			let result = await db.get(`Guild_${guildID}.settings.tickets.role`);

			if (!result) return false;

			return result;
	}

	public setTicketSupportRole(guildID: Snowflake, roleID: Snowflake) : void {
        db.set(`Guilds_${guildID}.settings.tickets.role`, roleID);
    }

	public async getTicketReactionChannel(guildID: Snowflake) : Promise<string | boolean> {
			let result = await db.get(`Guild_${guildID}.settings.tickets.channel`);

			if (!result) return false;

			return result;
	}

	public setTicketReactionChannel(guildID: Snowflake, channelID: Snowflake) : void {
		db.set(`Guild_${guildID}.settings.tickets.channel`, channelID);
		
		return;
    }

	/*******************************************************
	 *            	TICKETS GETTERS / SETTERS              *
	 ******************************************************/

	public async getTickets(guildID: Snowflake): Promise<ticket[]> {
		return await db.get(`Guilds_${guildID}.tickets`);
	}
	
	public async setTickets(guildID: Snowflake, tickets: any): Promise<void> {
		db.set(`Guilds_${guildID}.tickets`, tickets);

		return;
	}

	/************************************************
	 *                TICKETS GLOBAL                *
	 ************************************************/
	
    public async createTicket(guildID: Snowflake, newTicket: ticket) : Promise<void> {
		db.push(`Guild_${guildID}.tickets`, newTicket);
	}
	
	public async resolveTicket(guildID: Snowflake, ticketToResolve: ticket) : Promise<boolean> {
		let tickets: any = await this.getTickets(guildID);
		
		if (!tickets.length) return false;
		
		let found: boolean = false;
		
		for (let i: number = 0; i < tickets.length - 1; i++) {
			if (tickets[i] === ticketToResolve) {
				found = true;
				ticketToResolve.resolved = true;				
				this.setTickets(guildID, tickets);
				
				break;
			}
		}

		return found;
	}

	public async deleteTicket(guildID: Snowflake, ticketToDelete: ticket) : Promise<boolean> {
		let tickets: any = await this.getTickets(guildID);
		
		if (!tickets.length) return false;
		
		let found: boolean = false;
		
		for (let i: number = 0; i < tickets.length - 1; i++) {
			if (tickets[i] === ticketToDelete) {
				found = true;
				delete tickets[i];
				
				this.setTickets(guildID, tickets);
			}
		}
		
		return found;
	}

	/**********************************************************
	 *                 TOTAL CREATED TICKETS                  *
	 *********************************************************/

	public async getTotalCreatedTickets(guildID: Snowflake) : Promise<number> {
		let totalTickets: number | undefined = await db.get(`Guilds_${guildID}.createdTickets`);

		return totalTickets || 0;
	}

	public async setTotalCreatedTickets(guildID: Snowflake, ticketsTotal: number): Promise<void> {
		db.set(`Guilds_${guildID}.createdTickets`, ticketsTotal);

		return;
	}

	public async incrementTotalCreatedTickets(guildID: Snowflake): Promise<void> {
		let totalTickets: number = await this.getTotalCreatedTickets(guildID);

		totalTickets++;

		this.setTotalCreatedTickets(guildID, totalTickets);

		return;
	}

}

export default Bot;
