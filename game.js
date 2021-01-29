const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1366,
  heigth: 768,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 450 },
      debug: true
    },
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('background', 'assets/images/background.png');
  this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
  this.load.image('spike', 'assets/images/spike.png');
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
  this.load.atlas('player', 'assets/images/bandit.png',
    'assets/images/bandit_atlas.json');
}

function create() {
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
  const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
  backgroundImage.setScale(2, 0.8);
 
  const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
  platforms.setCollisionByExclusion(-1, true);

  this.player = this.physics.add.sprite(50, 300, 'player');
  this.player.body.setSize(80, 100, 16, 16);
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player, platforms);

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNames('player', {
      prefix: 'bandit02_walk_',
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1
  });

  // Create an idle animation i.e the first frame
  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNames('player', {
      prefix: 'bandit02_idle_',
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1
  });

  // Use the second frame of the atlas for jumping
  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNames('player', {
      prefix: 'bandit02_jumpup_',
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1
  });

  // Enable user input via cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();

  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  const spikeObjects = map.getObjectLayer('Spikes')['objects'];
  spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y + 200 - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
  });

  this.physics.add.collider(this.player, this.spikes, playerHit, null, this);
}

function update() {
  // Control the player with left or right keys
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
    if (this.player.body.onFloor()) {
      this.player.play('walk', true);
    }
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
    if (this.player.body.onFloor()) {
      this.player.play('walk', true);
    }
  } else {

    this.player.setVelocityX(0);

    if (this.player.body.onFloor()) {
      this.player.play('idle', true);
    }
  }

  if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
    this.player.setVelocityY(-350);
    this.player.play('jump', true);
  }

  if (this.player.body.velocity.x > 0) {
    this.player.setFlipX(false);
  } else if (this.player.body.velocity.x < 0) {
    // otherwise, make them face the other side
    this.player.setFlipX(true);
  }
}

/**
 * playerHit resets the player's state when it dies from colliding with a spike
 * @param {*} player - player sprite
 * @param {*} spike - spike player collided with
 */
function playerHit(player, spike) {

  player.setVelocity(0, 0);

  player.setX(50);
  player.setY(300);

  player.play('idle', true);

  player.setAlpha(0);

  let tw = this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 100,
    ease: 'Linear',
    repeat: 5,
  });
}
