let SCREENS = {
  CURRENT: 0,
  LOADING: 0,
  MENU: 1,
  GAME: 2,
  LEADERBOARD: 3,
};

let startButton;
let dotsAmount;
let secondsTime;
let hideButton = false;
let mapImages = [];

let isGameReady = false;
let isMenuReady = false;
let isLoadingReady = false;
let titleDrawn = false;

function preload() {
  mapBlocks = loadJSON("platforms.json");
  jumpSfx = loadSound("assets/sounds/swipe.mp3");
  bounceSfx = loadSound("assets/sounds/bounce.wav");
  hurtSfx = loadSound("assets/sounds/hurt.wav");
  hurtSfx.setVolume(0.5);

  mapImg0 = loadImage("images/stage0.png");
  mapImg1 = loadImage("images/stage1.png");
  mapImg2 = loadImage("images/stage2.png");
  mapImg3 = loadImage("images/stage3.png");
  mapImg4 = loadImage("images/stage4.png");
  mapImg5 = loadImage("images/stage5.png");
  mapImg6 = loadImage("images/stage6.png");
  mapImg7 = loadImage("images/stage7.png");

  mapImages.push(
    mapImg0,
    mapImg1,
    mapImg2,
    mapImg3,
    mapImg4,
    mapImg5,
    mapImg6,
    mapImg7
  );
}

function setup() {
  new Canvas(1000, 750);

  startButton = createImg("assets/text/btn.png");
  startButton.position(5000, 5000);

  leaderboard = loadJSON("leaderboard.json");

  SCREENS.CURRENT = 0;

  world.gravity.y = 10;
}

function draw() {
  if (hideButton == true) {
    startButton.hide();
  }

  switch (SCREENS.CURRENT) {
    case 0:
      setupLoading();
      drawLoading();
      break;
    case 1:
      setupMenu();
      drawMenu();
      break;
    case 2:
      setupGame();
      drawGame();
      break;
    case 3:
      clear();
      background(220);

      fill(50);
      rectMode(CENTER);
      rect(1000 / 2, 220, 250, 310);

      allTimes = [];

      let playerTime = [];

      playerTime.push("player");
      playerTime.push(secondsTime);

      allTimes.push(playerTime);

      fill(255);

      textSize(18);
      text("Leaderboard", 1000 / 2 - 50, 130);

      textSize(14);

      if (secondsTime > 60) {
        mins = int(secondsTime / 60);
        seconds = String(secondsTime - 60 * mins);
        pTime = String(mins) + "m " + seconds + "s";
      } else {
        pTime = String(secondsTime) + "s";
      }

      text("Your time was " + pTime, 1000 / 2 - 55, 160);

      textSize(16);
      for (let i = 0; i < leaderboard.Times.length; i++) {
        allTimes.push(leaderboard.Times[i]);
      }

      allTimes.sort(function (a, b) {
        return a[1] - b[1];
      });

      for (let i = 0; i < allTimes.length; i++) {
        text(allTimes[i][0], width / 2 - 85, 195 + i * 25);

        if (allTimes[i][1] > 60) {
          mins = int(allTimes[i][1] / 60);
          seconds = String(allTimes[i][1] - 60 * mins);
          newTime = String(mins) + "m " + seconds + "s";
        } else {
          newTime = String(allTimes[i][1]) + "s";
        }
        text(newTime, width / 2 + 50, 195 + i * 25);
      }
      break;
  }
}

function changeScreen(screen) {
  SCREENS.CURRENT = screen;
}

function StartGame() {
  hideButton = true;
  jumpTitle2.remove();
  SCREENS.CURRENT = 2;
}

function setupLoading() {
  if (isLoadingReady === false) {
    jumpTitle1 = new Sprite();
    jumpTitle1.image = "assets/text/title1.png";
    jumpTitle1.collider = "n";
    jumpTitle1.y = 160;

    textSize(16);
    fill(255);
    isLoadingReady = true;
  }
}

function drawLoading() {
  background(0);

  if (dotsAmount < 30) {
    dotsAmount += 1;
    check = dotsAmount / 10;
  } else {
    dotsAmount = 0;
    check = dotsAmount / 10;
  }

  dotString = ".";
  dots = dotString.repeat(check);

  loadStatus = "loading" + dots;

  text(loadStatus, 320, 220);

  textSize(18);
  text("Click the mouse", 425, 350);

  if (mouse.pressed()) {
    jumpTitle1.remove();
    changeScreen(1);
  }
}

function setupMenu() {
  if (isMenuReady === false) {
    vid = createVideo("assets/jumpHero.mp4");

    vid.size(1000, 750);
    vid.hide();
    vid.loop();

    jumpTitle2 = new Sprite();
    jumpTitle2.image = "assets/text/title.png";
    jumpTitle2.collider = "n";
    jumpTitle2.y = 250;

    startButton.position(width / 2 - 60, height / 2 - 25);
    startButton.mousePressed(StartGame);

    isMenuReady = true;
  }
}

function drawMenu() {
  background(125);

  image(vid, 1, 1);

  textSize(30);
  fill(255);
}

function setupGame() {
  if (isGameReady === false) {
    blocks = new Group();
    blocks.color = color(0, 0, 0, 0);
    blocks.collider = "k";
    blocks.bounciness = 0.8;

    blockTops = new Group();
    blockTops.color = color(255, 0, 0, 0);
    blockTops.collider = "k";

    titleText = new Group();
    titleText.collider = "n";

    noStroke();

    stages = [];

    stages.push(mapBlocks.Stage0);
    stages.push(mapBlocks.Stage1);
    stages.push(mapBlocks.Stage2);
    stages.push(mapBlocks.Stage3);
    stages.push(mapBlocks.Stage4);
    stages.push(mapBlocks.Stage5);
    stages.push(mapBlocks.Stage6);
    stages.push(mapBlocks.Stage7);

    hero = new Sprite();
    hero.width = 20;
    hero.height = 28;
    hero.reset = hero.height;
    hero.offset.y = 3;
    hero.scale = 2.5;
    hero.y = 650;
    hero.power = 0;
    hero.x = 500;
    hero.grounded = false;
    hero.jumping = false;
    hero.facing = 0;
    hero.lastfacing = 0;
    hero.hurt = false;
    hero.recover = 0;
    hero.lastPos = 0;
    hero.fallcount = 0;
    hero.state = 0;
    hero.addAni("runRight", "assets/runningright/monsterRun1.png", 6);
    hero.addAni("runLeft", "assets/runningleft/monsterRunL1.png", 6);
    hero.image = "assets/standing/monsterStand.png";
    hero.stage = 0;
    hero.spawn = 2;
    hero.background = mapImages[hero.stage];
    hero.winCounter = 0;
    hero.won = false;
    hero.timer = 0;

    drawBlocks(stages[hero.stage], stages[hero.stage].posX.length);

    jumpX = 3000;
    jumpY = 3000;

    jumpDust = loadAni("assets/jumpdust/dustCloud1.png", 6);
    jumpDust.scale = 1.8;

    hero.collides(blockTops, blockCollision);
    hero.collides(blocks, bounceSound);

    isGameReady = true;
  }
}

function drawGame() {
  clear();
  background(hero.background);

  hero.rotation = 0;

  if (hero.won == false) {
    hero.timer += 1;
  }

  if (hero.state == 2) {
    hero.fallcount += 1;
  }

  if (jumpDust.frame == 5) {
    jumpDust.stop();
  }

  if (hero.winCounter > 20 && hero.stage == 7) {
    if (hero.won == false) {
      winText = new titleText.Sprite();
      winText.image = "assets/text/win.png";
      winText.x = 500;
      winText.y = 300;

      leadText = new titleText.Sprite();
      leadText.image = "assets/text/lead.png";
      leadText.x = 500;
      leadText.y = 400;

      hero.won = true;
    }
  }

  if (hero.won == true && kb.released("e")) {
    hero.remove();
    blocks.remove();
    blockTops.remove();
    titleText.remove();

    secondsTime = int(hero.timer / 60);

    changeScreen(3);
  }

  if (hero.colliding(blockTops) > 2) {
    hero.grounded = true;
  } else {
    hero.grounded = false;
  }

  for (let i = 0; i < blockTops.length; i++) {
    if (hero.colliding(blockTops[i])) {
      blockTypeCollision(blockTops[i]);
    }
  }

  if (hero.recover >= 140) {
    hero.hurt = false;
  }

  if (hero.hurt == true) {
    hero.image = "assets/jumping/monsterFall.png";
    hero.recover += 1;
  } else {
    hero.height = 28 * 2.5;
    hero.offset.y = 3;
    hero.recover = 0;
  }

  if (hero.grounded) {
    if (hero.hurt == false) {
      if (kb.pressing("left")) {
        hero.facing = 1;
        hero.lastfacing = hero.facing;

        hero.changeAni("runLeft");
      } else if (kb.pressing("right")) {
        hero.facing = 2;
        hero.lastfacing = hero.facing;
        hero.changeAni("runRight");
      } else {
        hero.facing = 0;
        if (hero.lastfacing == 1) {
          hero.image = "assets/standing/monsterStandL.png";
        } else {
          hero.image = "assets/standing/monsterStand.png";
        }
      }

      if (hero.jumping == true) {
        hero.image = "assets/jumping/monsterJumping.png";
      } else {
        if (hero.facing == 1) {
          hero.x -= 3.5;
        } else if (hero.facing == 2) {
          hero.x += 3.5;
        }
      }

      if (kb.pressing("space")) {
        hero.jumping = true;
        hero.power += 3.5;
      } else {
        hero.jumping = false;
      }

      if (kb.released("space") || hero.power >= 100) {
        hero.jumping = false;
        jump();
      }
    }
  } else {
    if (hero.lastPos < hero.y - 4) {
      hero.state = 2;
      hero.lastPos = hero.y;
    } else if (hero.lastPos > hero.y + 4) {
      hero.state = 1;
      hero.lastPos = hero.y;
    } else {
      hero.state = 0;
      hero.lastPos = hero.lastPos;
    }

    if (hero.state == 1) {
      if (hero.lastfacing == 1) {
        hero.image = "assets/jumping/monsterUpL.png";
      } else {
        hero.image = "assets/jumping/monsterUp.png";
      }
    } else if (hero.state == 2) {
      if (hero.lastfacing == 1) {
        hero.image = "assets/jumping/monsterDownL.png";
      } else {
        hero.image = "assets/jumping/monsterDown.png";
      }
    }
  }

  if (hero.stage == 2 || hero.stage == 7) {
    for (let i = 0; i < blockTops.length; i++) {
      if (blocks[blockTops[i].id].type == 3) {
        if (blocks[blockTops[i].id].x <= 220) {
          blocks[blockTops[i].id].dir = 2;
        } else if (blocks[blockTops[i].id].x >= 500) {
          blocks[blockTops[i].id].dir = 1;
        }

        if (blocks[blockTops[i].id].dir == 1) {
          blocks[blockTops[i].id].x -= 1;
        } else if (blocks[blockTops[i].id].dir == 2) {
          blocks[blockTops[i].id].x += 1;
        }

        blockTops[i].x = blocks[blockTops[i].id].x;
      }
    }
  }

  animation(jumpDust, jumpX, jumpY);

  stageControl();
}

function blockCollision(hero, blockTop) {
  if (hero.colliding(blocks) == false) {
    world.gravity.y = 10;
    hero.speed = 0;

    if (hero.fallcount >= 65) {
      fallPenalty();
    }

    hero.fallcount = 0;
  }
}

function blockTypeCollision(blockTop) {
  if (blockTop.type == 4) {
    blockTop.breakCounter -= 1;
  } else if (blockTop.type == 5) {
    hero.winCounter += 1;
  }

  if (blockTop.breakCounter <= 100 && blockTop.breakCounter > 50) {
    blocks[blockTop.id].image = "assets/platforms/break1.png";
  } else if (blockTop.breakCounter <= 50) {
    blocks[blockTop.id].image = "assets/platforms/break2.png";
  }

  if (blockTop.breakCounter == 0) {
    breakBlock(blockTop);
  }
}

function bounceSound(hero, blockTop) {
  bounceSfx.setVolume(0.2);
  bounceSfx.play();
}

function fallPenalty() {
  hero.hurt = true;
  hero.height = 20;
  hurtSfx.setVolume(0.2);
  hurtSfx.play();
}

function breakBlock(blockTop) {
  spawnX = blockTop.x;
  spawnY = blockTop.y;

  blockTop.collider = "n";
  blocks[blockTop.id].collider = "n";

  blockTop.image = "assets/platforms/gone.png";
  blocks[blockTop.id].image = "assets/platforms/gone.png";

  fallBlock1 = new Sprite();
  fallBlock1.image = "assets/platforms/broken1.png";
  fallBlock1.rotationSpeed = -2;
  fallBlock1.x = spawnX - 0.5;
  fallBlock1.y = spawnY;

  fallBlock2 = new Sprite();
  fallBlock2.image = "assets/platforms/broken2.png";
  fallBlock2.rotationSpeed = 2;
  fallBlock2.x = spawnX + 0.5;
  fallBlock2.y = spawnY;
}

function stageControl() {
  if (hero.y <= -5 && hero.stage != 7) {
    hero.stage += 1;
    hero.spawn = 0;
  } else if (hero.y >= 750 && hero.stage != 0) {
    hero.stage -= 1;
    hero.spawn = 1;
  }

  if (hero.spawn != 2) {
    stageDraw();
  }
}

function stageDraw() {
  blocks.remove();
  blockTops.remove();

  hero.background = mapImages[hero.stage];
  stage = stages[hero.stage];

  drawBlocks(stage, stage.posX.length);

  if (hero.spawn == 0) {
    hero.y = 750;
  } else if (hero.spawn == 1) {
    hero.y = 1;
  }

  hero.spawn = 2;
}

function drawBlocks(stage, amount) {
  for (let i = 0; i < amount; i++) {
    block = new blocks.Sprite();
    block.x = stage.posX[i];
    block.y = stage.posY[i];
    block.h = stage.height[i];
    block.w = stage.width[i];
    block.type = stage.type[i];
    block.id = i;

    if (block.type == 3) {
      block.image = "assets/platforms/moving.png";
      block.dir = 1;
    } else if (block.type == 4) {
      block.image = "assets/platforms/break.png";
      block.scale = 1.25;
    }

    if (block.type != 2) {
      blockTop = new blockTops.Sprite();
      blockTop.x = block.x;
      blockTop.y = block.y - block.h / 2;
      blockTop.w = block.w;
      blockTop.type = block.type;
      blockTop.h = 2;
      blockTop.id = block.id;
      blockTop.breakCounter = 150;
    }
  }

  for (let l = 0; l < 2; l++) {
    block = new blocks.Sprite();
    if (l == 0) {
      block.x = 2;
    } else if (l == 1) {
      block.x = 998;
    }
    block.y = 750 / 2;
    block.h = 750;
    block.w = 20;
    block.type = "wall";
  }
}

function jump() {
  if (hero.power > 100) {
    hero.power = 100;
  }

  world.gravity.y = 25;

  strength = hero.power;

  hero.power = 0;

  strength = strength / 100;
  jumpPower = 17.8 * strength;

  jumpX = hero.x;
  jumpY = hero.y + 15;
  jumpDust.frame = 1;
  jumpDust.play();

  jumpSfx.play();

  jumpAngle = 50 * strength;

  if (hero.facing == 1) {
    //-115 max
    hero.direction = 200 + jumpAngle;
    hero.speed = jumpPower;
  } else if (hero.facing == 2) {
    //-65 max
    hero.direction = -20 - jumpAngle;
    hero.speed = jumpPower;
  } else {
    hero.direction = 270;
    hero.speed = jumpPower;
  }
}
