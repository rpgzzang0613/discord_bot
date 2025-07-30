import {gameState, resetGameState} from './state.js';
import {generateSecret} from './logic.js';
import {beginTurnCycle, handleGuess} from './controller.js';
import {MessageFlags} from 'discord.js';

export async function handleStartCommand(interaction) {
  if (gameState.status === 'waiting' || gameState.status === 'playing') {
    return interaction.reply({
      content: '이미 게임이 진행 중입니다.',
      flags: MessageFlags.Ephemeral,
    });
  }

  gameState.status = 'waiting';
  gameState.channelId = interaction.channel.id;
  gameState.secret = generateSecret();
  gameState.players = [];
  gameState.turnIndex = 0;
  gameState.round = 1;

  await interaction.reply(
    '숫자야구 게임을 시작합니다! 15초 안에 `/숫자야구 참여`로 참가해 주세요.'
  );

  gameState.joinTimeout = setTimeout(async () => {
    if (gameState.players.length === 0) {
      resetGameState();
      await interaction.followUp('참가자가 없어 게임이 취소되었습니다.');
    } else {
      gameState.status = 'playing';
      await interaction.followUp(
        `참가 마감! 총 ${gameState.players.length}명 참여.\n곧 첫 번째 차례를 시작합니다.`
      );
      beginTurnCycle(interaction.client);
    }
  }, 15000);
}

export async function handleJoinCommand(interaction) {
  if (gameState.status !== 'waiting' || interaction.channel.id !== gameState.channelId) {
    return interaction.reply({
      content: '현재 참여 가능한 게임이 없습니다.',
      flags: MessageFlags.Ephemeral,
    });
  }

  const alreadyJoined = gameState.players.some(p => p.id === interaction.user.id);
  if (alreadyJoined) {
    return interaction.reply({content: '이미 참가하셨습니다.', flags: MessageFlags.Ephemeral});
  }

  gameState.players.push({id: interaction.user.id, name: interaction.user.username});
  await interaction.reply(`${interaction.user.username} 님이 게임에 참여했습니다.`);
}

export async function handleGuessCommand(interaction, input) {
  if (gameState.status !== 'playing' || interaction.channel.id !== gameState.channelId) {
    return interaction.reply({
      content: '현재 진행 중인 게임이 없습니다.',
      flags: MessageFlags.Ephemeral,
    });
  }

  const currentPlayer = gameState.players[gameState.turnIndex];
  if (interaction.user.id !== currentPlayer.id) {
    return interaction.reply({
      content: `지금은 ${currentPlayer.name}님의 차례입니다.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  await handleGuess(interaction, input);
}

export async function handleEndCommand(interaction) {
  if (
    (gameState.status !== 'waiting' && gameState.status !== 'playing') ||
    gameState.channelId !== interaction.channel.id
  ) {
    return await interaction.reply({
      content: '현재 이 채널에서는 종료할 숫자야구 게임이 없습니다.',
      flags: MessageFlags.Ephemeral,
    });
  }

  resetGameState();
  await interaction.reply({content: '숫자야구 게임이 종료되었습니다.'});
}
