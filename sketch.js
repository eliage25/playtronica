
let effects = [];
let particles = [];
let gridActive = false;
let gridTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  rectMode(CENTER);
}

function draw() {
  background(0, 0, 0, 18);

  // Moving grid
  if (gridActive || gridTime > 0) {
    drawGrid();
    if (!gridActive) gridTime--;
  }

  // Expanding neon rings
  for (let i = effects.length - 1; i >= 0; i--) {
    let e = effects[i];
    noFill();
    stroke(330, 75, 100, e.life * 0.12);
    strokeWeight(14);
    circle(e.x, e.y, e.size);
    stroke(330, 75, 100, e.life * 0.35);
    strokeWeight(5);
    circle(e.x, e.y, e.size);
    stroke(100, 75, 100, e.life * 0.55);
    strokeWeight(1.5);
    circle(e.x, e.y, e.size * 0.68);

    e.size += 13;
    e.life -= 1.5;
    if (e.life <= 0) effects.splice(i, 1);
  }

  // Particle bursts
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    noStroke();
    fill(p.hue, 65, 100, p.life * 0.18);
    circle(p.x, p.y, p.size * 3);
    fill(p.hue, 55, 100, p.life * 0.85);
    circle(p.x, p.y, p.size);

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= 1.4;

    if (p.life <= 0) particles.splice(i, 1);
  }

  // Interface
  noStroke();
  fill(100, 20, 100, 75);
  textFont("monospace");
  textSize(11);
  textAlign(LEFT);
  text("CONDUCTIVE PULSE / LIVE VISUAL", 30, 40);
  fill(330, 45, 100, 65);
  text("1 PULSE     2 GRID     3 PARTICLES", 30, 65);
}

function drawGrid() {
  push();
  translate(width / 2, height / 2);
  rotate(sin(frameCount * 0.007) * 0.15);

  stroke(110, 55, 100, 12);
  strokeWeight(5);

  let spacing = 55;
  let offset = (frameCount * 2) % spacing;

  for (let x = -width; x < width; x += spacing) {
    line(x + offset, -height, x + offset, height);
  }

  for (let y = -height; y < height; y += spacing) {
    line(-width, y + offset, width, y + offset);
  }

  stroke(110, 45, 100, 38);
  strokeWeight(1);

  for (let x = -width; x < width; x += spacing) {
    line(x + offset, -height, x + offset, height);
  }

  for (let y = -height; y < height; y += spacing) {
    line(-width, y + offset, width, y + offset);
  }
  pop();
}

function triggerEffect(note) {
  if (note === 1) {
    effects.push({
      x: random(width * 0.2, width * 0.8),
      y: random(height * 0.2, height * 0.8),
      size: 20,
      life: 100
    });
  }

  if (note === 2) {
    gridActive = true;
    gridTime = 70;
  }

  if (note === 3) {
    let x = random(width * 0.25, width * 0.75);
    let y = random(height * 0.25, height * 0.75);

    for (let i = 0; i < 100; i++) {
      let angle = random(TWO_PI);
      let speed = random(2, 12);

      particles.push({
        x, y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        hue: random([330, 110, 95]),
        size: random(2, 8),
        life: 100
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
1