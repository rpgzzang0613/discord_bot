import {SlashCommandBuilder, MessageFlags} from 'discord.js';
import {
  handleEndCommand,
  handleGuessCommand,
  handleJoinCommand,
  handleStartCommand,
} from '../../games/number-baseball/commands.js';

export const data = new SlashCommandBuilder()
  .setName('숫자야구')
  .setDescription('숫자야구 게임 명령어')
  .addSubcommand(sub => sub.setName('시작').setDescription('숫자야구 게임을 시작합니다.'))
  .addSubcommand(sub => sub.setName('참여').setDescription('숫자야구 게임에 참여합니다.'))
  .addSubcommand(sub =>
    sub
      .setName('정답')
      .setDescription('정답을 입력합니다.')
      .addStringOption(opt =>
        opt.setName('입력').setDescription('세 자리 숫자 (예: 123)').setRequired(true)
      )
  )
  .addSubcommand(sub => sub.setName('종료').setDescription('숫자야구 게임을 종료합니다.'));

export async function execute(interaction) {
  console.log(interaction.channelId, 'channelId');
  console.log(interaction.channel.id, 'channel.id');
  if (interaction.channel.id !== '1399971778767622187') {
    interaction.reply({
      content: '숫자야구가 허용된 채널이 아닙니다.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const subcommand = interaction.options.getSubcommand();
  if (subcommand === '시작') {
    await handleStartCommand(interaction);
  } else if (subcommand === '참여') {
    await handleJoinCommand(interaction);
  } else if (subcommand === '정답') {
    const input = interaction.options.getString('입력');
    await handleGuessCommand(interaction, input);
  } else {
    await handleEndCommand(interaction);
  }
}
