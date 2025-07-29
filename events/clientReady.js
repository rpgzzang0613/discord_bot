import {Events} from 'discord.js';

export const name = Events.ClientReady;

export const once = true;

export function execute(client) {
  console.log(`Logged in as ${client.user.tag}!`);
}
