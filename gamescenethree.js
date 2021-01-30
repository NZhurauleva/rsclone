class GameSceneThree extends Phaser.Scene {
    constructor() {
      super("level3");
  
      this.keyCTRL;
      this.jumpSound;
      this.coinScore = 0;
      this.health = 100;
    }
  
    preload() {
      // Image layers from Tiled can't be exported to Phaser 3 (as yet)
      // So we add the background image separately
      this.load.image("background3", "assets/images/background3.png");
      // Load the tileset image file, needed for the map to know what
      // tiles to draw on the screen
      this.load.image("tiles", "assets/tilesets/platformPack_tilesheet.png");
      // Even though we load the tilesheet with the spike image, we need to
      // load the Spike image separately for Phaser 3 to render it
      this.load.image("spike", "assets/images/spike.png");
  
      this.load.image("fake_object", "assets/images/Transparency.png");
  
      this.load.image("coin", "assets/images/coin.png");
      this.load.image("exit", "assets/images/exit.png");
      this.load.audio("coin-sound", "assets/sounds/coin.mp3");
      this.load.audio("jump", "assets/sounds/jump.wav");
      this.load.audio("damage", "assets/sounds/damage.mp3");
      // Load the export Tiled JSON
      this.load.tilemapTiledJSON("map3", "assets/tilemaps/level3.json");
      // Load player animations from the player spritesheet and atlas JSON
      this.load.atlas(
        "player",
        "assets/images/bandit.png",
        "assets/images/bandit_atlas.json"
      );
    }
  
    create() {
      // Create a tile map, which is used to bring our level in Tiled
      // to our game world in Phaser
      const map = this.make.tilemap({ key: "map3" });
      // Add the tileset to the map so the images would load correctly in Phaser
      const tileset = map.addTilesetImage("kenney_simple_platformer", "tiles");
      // Place the background image in our game world
      const backgroundImage = this.add.image(0, 0, "background3").setOrigin(0, 0);
      // Scale the image to better match our game's resolution
      backgroundImage.setScale(10, 0.8);
      // Add the platform layer as a static group, the player would be able
      // to jump on platforms like world collisions but they shouldn't move
      const platforms = map.createStaticLayer("Platforms", tileset, 0, 200);
      // There are many ways to set collision between tiles and players
      // As we want players to collide with all of the platforms, we tell Phaser to
      // set collisions for every tile in our platform layer whose index isn't -1.
      // Tiled indices can only be >= 0, therefore we are colliding with all of
      // the platform layer
      platforms.setCollisionByExclusion(-1, true);
  
      //////музыка прыжка////////
      this.jumpSound = this.sound.add("jump");
      this.jumpSound.setVolume(0.5);
  
      ///////////музыка урона//////////
      const damageSound = this.sound.add("damage");
      damageSound.setVolume(0.5);
  
      //////////прыжжок на ctrl/////
      this.keyCTRL = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.CTRL
      );
  
      // Add the player to the game world
      this.player = this.physics.add.sprite(50, 300, "player");
      //this.player.setScale(0.8);
      this.player.body.setSize(80, 100, 16, 16);
      this.player.setBounce(0.1); // our player will bounce from items
      this.player.setCollideWorldBounds(true); // don't go out of the map
      let platColl = this.physics.add.collider(this.player, platforms);
  
      // Create the walking animation using the last 2 frames of
      // the atlas' first row
      this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNames("player", {
          prefix: "bandit02_walk_",
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
  
      // Create an idle animation i.e the first frame
      this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNames("player", {
          prefix: "bandit02_idle_",
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
  
      // Use the second frame of the atlas for jumping
      this.anims.create({
        key: "jump",
        frames: this.anims.generateFrameNames("player", {
          prefix: "bandit02_jumpup_",
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "attack",
        frames: this.anims.generateFrameNames("player", {
          prefix: "bandit02_attack_",
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "hurt",
        frames: this.anims.generateFrameNames("player", {
          prefix: "bandit02_hurt_",
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "die",
        frames: this.anims.generateFrameNames("player", {
          prefix: "bandit02_die_",
          start: 0,
          end: 7,
        }),
        frameRate: 10,
      });
      // Enable user input via cursor keys
      this.cursors = this.input.keyboard.createCursorKeys();
  
      /////////////////////////////////////////////////Камера за Игроком///////////////////////////
  
      this.physics.world.setBounds(0, 0, map.width * 64, this.heigth);
      // ограничиваем камеру размерами карты
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      // заставляем камеру следовать за игроком
      this.cameras.main.startFollow(this.player);
      //своего рода хак, чтобы предотвратить пояление полос в тайлах
      this.cameras.main.roundPixels = true;
  
      ///////////////////////Создаем шипы//////////////
      this.spikes = this.physics.add.group({
        allowGravity: false,
        immovable: true,
      });
  
      const spikeObjects = map.getObjectLayer("Spikes")["objects"];
      spikeObjects.forEach((spikeObject) => {
        // Add new spikes to our sprite group
        const spike = this.spikes
          .create(
            spikeObject.x,
            spikeObject.y + 200 - spikeObject.height,
            "spike"
          )
          .setOrigin(0, 0);
        // By default the sprite has loads of whitespace from the base image, we
        // resize the sprite to reduce the amount of whitespace used by the sprite
        // so collisions can be more precise
        spike.body.setSize(spike.width, spike.height - 30).setOffset(0, 30);
      });
  
      // Add collision between the player and the spikes
  
      let otherColl = this.physics.add.collider(
        this.player,
        this.spikes,
        playerHit,
        updateHealthBar,
        this
      );
  
      //////////////////////Создаем Воду////////////////////////////
  
      map.createStaticLayer("Others", tileset, 0, 200);
  
      let fakeObjects = this.physics.add.staticGroup();
      const waterObjects = map.getObjectLayer("Water")["objects"];
      waterObjects.forEach((object) => {
        let obj = fakeObjects.create(
          object.x + 30,
          object.y + 250 - object.height,
          "fake_object"
        );
        obj.body.width = object.width;
        obj.body.height = object.height;
      });
      this.physics.add.overlap(this.player, fakeObjects, playerDrown, null, this);
  
      ////////////////////////////////Создаем монеты////////////////////////
      const coinSound = this.sound.add("coin-sound");
      coinSound.setVolume(0.5);
  
      const CoinLayer = map.getObjectLayer("CoinLayer")["objects"];
  
      let coins = this.physics.add.staticGroup();
      //this is how we actually render our coin object with coin asset we loaded into our game in the preload function
      CoinLayer.forEach((object) => {
        let obj = coins.create(
          object.x + 30,
          object.y + 230 - object.height,
          "coin"
        );
        obj.body.setSize(obj.width - 30, obj.height - 30).setOffset(15, 15);
      });
  
      this.physics.add.overlap(this.player, coins, collectCoin, null, this);
  
      let text = this.add.text(10, 35, `Coins: ${this.coinScore}`, {
        fontSize: "32px",
        fill: "black",
      });
      text.setScrollFactor(0);
  
      function collectCoin(player, coin) {
        coin.destroy(coin.x, coin.y); // remove the tile/coin
        coinSound.play();
        this.coinScore++; // increment the score
        text.setText(`Coins: ${this.coinScore}`); // set the text to show the current score
        return false;
      }
  
      //////////////////Создаем полоску жизней////////////////
  
      const graphics = this.add.graphics();
      graphics.setScrollFactor(0);
      setHealthBar(this.health);
  
      function updateHealthBar() {
        this.health -= 10;
        setHealthBar(this.health);
      }
  
      function setHealthBar(health) {
        const width = 200;
        const percent = Phaser.Math.Clamp(health, 0, 100) / 100;
        graphics.clear();
        graphics.fillStyle(0x808080);
        graphics.fillRoundedRect(10, 10, width, 20, 5);
        if (percent > 0) {
          graphics.fillStyle(0x00ff00);
          graphics.fillRoundedRect(10, 10, width * percent, 20, 5);
        }
      }
  
      //////////////////////Создаем Выход////////////////////////////
  
      //const coinSound = this.sound.add("coin-sound");
      //coinSound.setVolume(0.1);
  
      const ExitLayer = map.getObjectLayer("Exit")["objects"];
      let exit = this.physics.add.staticGroup();
      //this is how we actually render our coin object with coin asset we loaded into our game in the preload function
      ExitLayer.forEach((object) => {
        let obj = exit.create(
          object.x + 30,
          object.y + 230 - object.height,
          "exit"
        );
        obj.body.setSize(obj.width - 30, obj.height - 30).setOffset(15, 15);
      });
      this.physics.add.overlap(this.player, exit, nextLevel, null, this);
  
      function nextLevel (){
         // this.scene.remove('level2');
         // this.scene.start('level3');
        }
      /**
       * playerHit resets the player's state when it dies from colliding with a spike
       * @param {*} player - player sprite
       * @param {*} spike - spike player collided with
       */
      function playerDrown(player, spike) {
        this.health = 100;
        this.coinScore = 0;
        this.scene.restart("level2");
        /*// Set velocity back to 0
          player.setVelocity(0, 0);
          // Put the player back in its original position
          player.setX(50);
          player.setY(300);
          // Use the default `idle` animation
          player.play("idle", true);
          // Set the visibility to 0 i.e. hide the player
          player.setAlpha(0);
          // Add a tween that 'blinks' until the player is gradually visible
          let tw = this.tweens.add({
            targets: player,
            alpha: 1,
            duration: 100,
            ease: "Linear",
            repeat: 5,
          });*/
      }
  
      function playerHit(player, spike) {
        if (this.health <= 0) {
          player.play("die", true);
          this.physics.world.removeCollider(platColl);
          this.physics.world.removeCollider(otherColl);
          setTimeout(() => {
            this.scene.restart("level2");
            this.health = 100;
            this.coinScore = 0;
          }, 2000);
        } else {
          damageSound.play();
          player.setVelocityY(-250);
          player.play("hurt", true);
  
          const startColor = Phaser.Display.Color.ValueToColor(0xffffff);
          const endColor = Phaser.Display.Color.ValueToColor(0xff0000);
  
          this.tweens.addCounter({
            from: 0,
            to: 100,
            alpha: 1,
            duration: 100,
            repeat: 2,
            yoyo: true,
            onUpdate: (tween) => {
              const value = tween.getValue();
              const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                startColor,
                endColor,
                100,
                value
              );
              const color = Phaser.Display.Color.GetColor(
                colorObject.r,
                colorObject.g,
                colorObject.b
              );
              this.player.setTint(color);
            },
          });
        }
      }
    }
  
    update() {
      // Control the player with left or right keys
  
      if (this.cursors.left.isDown && this.keyCTRL.isDown) {
        this.player.setVelocityX(-200);
        this.player.play("attack", true);
      } else if (this.cursors.right.isDown && this.keyCTRL.isDown) {
        this.player.setVelocityX(200);
        this.player.play("attack", true);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
        if (this.player.body.onFloor()) {
          this.player.play("walk", true);
        } else if (this.keyCTRL.isDown) {
          this.player.play("attack", true);
        }
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
        if (this.player.body.onFloor()) {
          this.player.play("walk", true);
        } else if (this.keyCTRL.isDown) {
          this.player.play("attack", true);
        }
      } else {
        // If no keys are pressed, the player keeps still
        this.player.setVelocityX(0);
  
        if (this.keyCTRL.isDown) {
          this.player.play("attack", true);
        }
        // Only show the idle animation if the player is footed
        // If this is not included, the player would look idle while jumping
        else if (this.player.body.onFloor()) {
          this.player.play("idle", true);
        }
      }
  
      // Player can jump while walking any direction by pressing the space bar
      // or the 'UP' arrow
  
      if (
        (this.cursors.space.isDown || this.cursors.up.isDown) &&
        this.player.body.onFloor()
      ) {
        this.player.setVelocityY(-350);
        this.player.play("jump", true);
        this.jumpSound.play();
      }
  
      // If the player is moving to the right, keep them facing forward
      if (this.player.body.velocity.x > 0) {
        this.player.setFlipX(false);
      } else if (this.player.body.velocity.x < 0) {
        // otherwise, make them face the other side
        this.player.setFlipX(true);
      }
    }
  }
  //export default GameScene
  