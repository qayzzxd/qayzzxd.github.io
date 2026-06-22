const fs = require('fs');
const path = require('path');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const GIFEncoder = require('gif-encoder-2');

const W = 800;
const H = 600;
const OUT = path.join(__dirname, 'assets', 'split.gif');

GlobalFonts.registerFromPath(
  '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
  'ChargeLabel'
);

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');
const encoder = new GIFEncoder(W, H, 'neuquant', true);
const output = fs.createWriteStream(OUT);

encoder.createReadStream().pipe(output);
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(90);
encoder.setQuality(10);

const colors = {
  background: '#F8FAFD',
  charged: '#3976E8',
  chargedEdge: '#2258B8',
  neutral: '#E8EDF3',
  neutralEdge: '#9AA9BC',
  white: '#FFFFFF',
  ground: '#64748B',
  flow: '#F59E42',
};

function ease(t) {
  const p = Math.max(0, Math.min(1, t));
  return 0.5 - 0.5 * Math.cos(Math.PI * p);
}

function mix(a, b, t) {
  return a + (b - a) * ease(t);
}

function hexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function blend(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const p = Math.max(0, Math.min(1, t));
  return `rgb(${Math.round(ca.r + (cb.r - ca.r) * p)},` +
    `${Math.round(ca.g + (cb.g - ca.g) * p)},` +
    `${Math.round(ca.b + (cb.b - ca.b) * p)})`;
}

function clear() {
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, W, H);
}

function drawBall(x, y, label, chargeLevel = 1) {
  const r = 58;
  const fill = blend(colors.neutral, colors.charged, chargeLevel);
  const edge = blend(colors.neutralEdge, colors.chargedEdge, chargeLevel);

  ctx.save();
  ctx.shadowColor = chargeLevel > 0.1
    ? 'rgba(57,118,232,0.18)'
    : 'rgba(100,116,139,0.12)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = edge;
  ctx.stroke();

  ctx.fillStyle = chargeLevel > 0.45 ? colors.white : colors.ground;
  ctx.font = 'bold 27px ChargeLabel, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y + 1);
}

function drawGround(x, ballY, progress) {
  const top = ballY + 58;
  const bottom = 430;

  ctx.strokeStyle = colors.ground;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  ctx.stroke();

  ctx.lineWidth = 3;
  [44, 30, 16].forEach((width, index) => {
    const y = bottom + index * 10;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x + width / 2, y);
    ctx.stroke();
  });

  // Three small moving dots show charge flowing into the earth.
  for (const offset of [0, 0.34, 0.68]) {
    const p = (progress + offset) % 1;
    const y = top + 14 + p * (bottom - top - 24);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = colors.flow;
    ctx.fill();
  }
}

function addFrame(draw, repeats = 1) {
  for (let i = 0; i < repeats; i += 1) {
    clear();
    draw();
    encoder.addFrame(ctx);
  }
}

const separatedX = [250, 550];
// The initially charged left ball stays fixed; only the right ball moves.
const touchingX = [250, 366];
const ballY = 250;

function separated(leftLabel, rightLabel, rightCharge = 0) {
  return () => {
    drawBall(separatedX[0], ballY, leftLabel, 1);
    drawBall(separatedX[1], ballY, rightLabel, rightCharge);
  };
}

function touching(label) {
  return () => {
    drawBall(touchingX[0], ballY, label, 1);
    drawBall(touchingX[1], ballY, label, 1);
  };
}

function contactFrames(leftBefore, after) {
  // Move together while preserving the original charge state.
  for (let i = 0; i < 12; i += 1) {
    const t = i / 11;
    addFrame(() => {
      const x1 = mix(separatedX[0], touchingX[0], t);
      const x2 = mix(separatedX[1], touchingX[1], t);
      drawBall(x1, ballY, leftBefore, 1);
      drawBall(x2, ballY, '0', 0);
    });
  }

  // Only after physical contact does the neutral ball gain charge and change color.
  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    addFrame(() => {
      const redistributed = ease(t);
      drawBall(
        touchingX[0],
        ballY,
        t < 0.55 ? leftBefore : after,
        1
      );
      drawBall(
        touchingX[1],
        ballY,
        t < 0.55 ? '0' : after,
        redistributed
      );
    });
  }
  addFrame(touching(after), 11);
}

function separationFrames(label) {
  for (let i = 0; i < 10; i += 1) {
    const t = i / 9;
    addFrame(() => {
      drawBall(mix(touchingX[0], separatedX[0], t), ballY, label, 1);
      drawBall(mix(touchingX[1], separatedX[1], t), ballY, label, 1);
    });
  }
}

function groundingFrames(label) {
  for (let i = 0; i < 18; i += 1) {
    const t = i / 17;
    addFrame(() => {
      drawBall(separatedX[0], ballY, label, 1);
      drawBall(
        separatedX[1],
        ballY,
        t < 0.72 ? label : '0',
        1 - ease(t)
      );
      drawGround(separatedX[1], ballY, i / 8);
    });
  }
  addFrame(separated(label, '0', 0), 8);
}

// q + 0 → q/2 + q/2
addFrame(separated('q', '0', 0), 13);
contactFrames('q', 'q/2');

// q/2 + q/2 → q/2 + 0 → q/4 + q/4
separationFrames('q/2');
groundingFrames('q/2');
contactFrames('q/2', 'q/4');

// q/4 + q/4 → q/4 + 0 → q/8 + q/8
separationFrames('q/4');
groundingFrames('q/4');
contactFrames('q/4', 'q/8');

// End the cycle by separating the q/8 balls and grounding the right one.
addFrame(touching('q/8'), 10);
separationFrames('q/8');
groundingFrames('q/8');
addFrame(separated('q/8', '0', 0), 12);

encoder.finish();

output.on('finish', () => {
  console.log(`Created ${OUT}`);
});
