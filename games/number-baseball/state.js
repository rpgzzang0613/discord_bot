export const gameState = {
  status: 'idle', // idle, waiting, playing
  channelId: null, // 게임이 열려 있는 채널 ID
  players: [], // 참가자 목록 [{ id, name }]
  secret: null, // 정답 숫자 (문자열, 예: '123')
  turnIndex: 0, // 현재 차례 인덱스
  round: 1, // 현재 라운드
  joinTimeout: null, // 참가 마감 타이머
  turnTimeout: null, // 차례 제한시간 타이머
};

export function resetGameState() {
  gameState.status = 'idle';
  gameState.channelId = null;
  gameState.players = [];
  gameState.secret = null;
  gameState.turnIndex = 0;
  gameState.round = 1;
  clearTimeout(gameState.joinTimeout);
  clearTimeout(gameState.turnTimeout);
  gameState.joinTimeout = null;
  gameState.turnTimeout = null;
}
