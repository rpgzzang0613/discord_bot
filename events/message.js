import {Events} from 'discord.js';

export const name = Events.MessageCreate;

export const once = false;

export function execute(message) {
  if (message.author.bot) {
    return;
  }

  if (message.content === '!테스트') {
    message.channel.send('테스트응답');
  }
}
