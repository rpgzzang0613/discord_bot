import {gameState, resetGameState} from './state.js';
import {getStrikeAndBall, isValidGuess} from './logic.js';
import {MessageFlags} from 'discord.js';

export function beginTurnCycle(client) {
  const player = gameState.players[gameState.turnIndex];
  const channel = client.channels.cache.get(gameState.channelId);

  if (!channel) return;

  channel.send(
    `🎯 ${player.name} 님의 차례입니다. 20초 안에 '/숫자야구 정답 123' 형식으로 답을 입력하세요.`
  );

  gameState.turnTimeout = setTimeout(() => {
    advanceTurn(channel);
  }, 20000);
}

export async function handleGuess(interaction, input) {
  clearTimeout(gameState.turnTimeout);

  if (!isValidGuess(input)) {
    return interaction.reply({
      content: '입력은 중복 없는 세 자리 숫자여야 합니다.',
      flags: MessageFlags.Ephemeral,
    });
  }

  const result = getStrikeAndBall(gameState.secret, input);
  const {strike, ball} = result;

  if (strike === 3) {
    await interaction.reply(
      `🎉 정답입니다! ${interaction.user.username} 님이 승리했습니다! 정답: ${gameState.secret}`
    );
    resetGameState();
    return;
  }

  await interaction.reply(`${strike} 스트라이크, ${ball} 볼입니다.`);

  const channel = interaction.client.channels.cache.get(gameState.channelId);
  if (channel) advanceTurn(channel);
}

export function advanceTurn(channel) {
  gameState.turnIndex++;

  if (gameState.turnIndex >= gameState.players.length) {
    gameState.turnIndex = 0;
    gameState.round++;
  }

  if (gameState.round > 2) {
    channel.send(
      `😢 2바퀴 동안 정답자가 없어 게임을 종료합니다. 정답은 ${gameState.secret}였습니다.`
    );
    resetGameState();
    return;
  }

  beginTurnCycle(channel.client);
}
