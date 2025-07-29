import {SlashCommandBuilder} from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export async function execute(interaction) {
  const sent = await interaction.reply({content: 'Pinging...', withResponse: true});
  interaction.editReply(
    `Pong! (${sent.resource.message.createdTimestamp - interaction.createdTimestamp}ms)`
  );
}
