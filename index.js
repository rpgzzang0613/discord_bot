import {Client, Collection, IntentsBitField} from 'discord.js';
import dotenv from 'dotenv';
import {loadCommands} from './loader/commandLoader.js';
import {loadEvents} from './loader/eventLoader.js';

dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

await loadCommands(client);
await loadEvents(client);

client.login(process.env.BOT_TOKEN);
