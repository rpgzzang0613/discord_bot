import * as path from 'node:path';
import * as fs from 'node:fs';
import {fileURLToPath} from 'url';

export async function loadEvents(client) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const eventsPath = path.join(__dirname, '../events');
  const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

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
}
