export function generateSecret() {
  const digits = [];
  while (digits.length < 3) {
    const n = Math.floor(Math.random() * 10).toString();
    if (!digits.includes(n)) digits.push(n);
  }
  return digits.join('');
}

// 정답 유효성 검사
export function isValidGuess(input) {
  return /^[0-9]{3}$/.test(input) && new Set(input).size === 3;
}

// 스트라이크/볼 판정
export function getStrikeAndBall(secret, guess) {
  let strike = 0;
  let ball = 0;

  for (let i = 0; i < 3; i++) {
    if (guess[i] === secret[i]) strike++;
    else if (secret.includes(guess[i])) ball++;
  }

  return {strike, ball};
}
