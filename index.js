import {Client, Collection, IntentsBitField} from 'discord.js';
import dotenv from 'dotenv';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {fileURLToPath} from 'url';

dotenv.config();

const myIntents = new IntentsBitField();
myIntents.add(
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent
);

const client = new Client({
  intents: myIntents,
});

client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// slash command 등록
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    const cmd = command.default ?? command;
    if ('data' in cmd && 'execute' in cmd) {
      client.commands.set(command.data.name, cmd);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// slash command에 대한 interaction을 포함한 이벤트 등록
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = await import(filePath);

  const evt = event.default ?? event;
  if ('name' in evt && 'execute' in evt) {
    if (evt.once) {
      client.once(evt.name, (...args) => evt.execute(...args));
    } else {
      client.on(evt.name, (...args) => evt.execute(...args));
    }
  }
}

client.login(process.env.BOT_TOKEN);
