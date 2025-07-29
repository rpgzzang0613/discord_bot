import {fileURLToPath} from 'url';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {Collection} from 'discord.js';

export async function loadCommands(client) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const foldersPath = path.join(__dirname, '../commands');
  const commandFolders = fs.readdirSync(foldersPath);

  client.commands = new Collection();

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      const cmd = command.default ?? command;
      if ('data' in cmd && 'execute' in cmd) {
        client.commands.set(cmd.data.name, cmd);
      } else {
        console.warn(`[WARNING] ${filePath}는 "data" 또는 "execute" 속성이 없습니다.`);
      }
    }
  }
}
