class GameSceneFour extends Phaser.Scene {
  constructor() {
    super("level4");

    this.keyCTRL;
    this.jumpSound;
    this.health = 100;
    this.healthBoss = 100;
    this.playerSpeed = 1.5;
    this.enemyMaxY = 1550;
    this.enemyMinY = 50;
    this.bossMaxY = 1500;
    this.bossMinY = 100;
    this.keyScore = 0;
    this.isPlayerAlive = true;
    this.coinScore = 0;
    this.jumpBoss = 400;
    this.arrjump = [];
    this.touchBoss = 0;
  }

  preload() {
    this.load.image("backgroundfour", "assets/images/background4.png");
    this.load.image("tiles", "assets/tilesets/platformPack_tilesheet.png");
    this.load.image("spike", "assets/images/spike.png");
    this.load.image("fake_object", "assets/images/Transparency.png");
    this.load.image("key", "assets/images/key.png");
    this.load.image("exit", "assets/images/exit.png");
    this.load.image("exittop", "assets/images/exittop.png");
    this.load.audio("coin-sound", "assets/sounds/coin.mp3");
    this.load.audio("key-sound", "assets/sounds/key.mp3");
    this.load.audio("jump", "assets/sounds/jump.wav");
    this.load.audio("damage", "assets/sounds/damage.mp3");
    this.load.audio("musicfour", "assets/sounds/level4.mp3");
    this.load.audio("victory", "assets/sounds/victory.mp3");
    this.load.spritesheet("coin", "assets/images/coin.png", { frameWidth: 62, frameHeight: 62 });
    this.load.tilemapTiledJSON("map4", "assets/tilemaps/level4.json");
    this.load.atlas(
      "player",
      "assets/images/bandit.png",
      "assets/images/bandit_atlas.json"
    );
    this.load.atlas(
      "bomb",
      "assets/images/enemybomb.png",
      "assets/images/enemybomb_atlas.json"
    );
    this.load.atlas(
      "bird",
      "assets/images/enemybird.png",
      "assets/images/enemybird_atlas.json"
    );
    this.load.atlas(
      "boss",
      "assets/images/skeletonboss.png",
      "assets/images/skeletonboss_atlas.json"
    );
  }

  create() {

    //===============Создание карты=============//
    const map = this.make.tilemap({ key: "map4" });
    const tileset = map.addTilesetImage("kenney_simple_platformer", "tiles");
    this.background = this.add.tileSprite(0, 0, 1600, 1024, "backgroundfour")
    this.background.setOrigin(0)
    this.background.setScrollFactor(0, 1);
    const platforms = map.createStaticLayer("Platforms", tileset, 0, 200);
    platforms.setCollisionByExclusion(-1, true);


    //===============Создание звуков=============//
    //звук прыжка//
    this.jumpSound = this.sound.add("jump");
    this.jumpSound.setVolume(0.2);

    //звук урона//
    const damageSound = this.sound.add("damage");
    damageSound.setVolume(0.5);

    //звук монет//
    const coinSound = this.sound.add("coin-sound");
    coinSound.setVolume(0.5);

    //звук ключей//
    const keySound = this.sound.add("key-sound");
    keySound.setVolume(0.5);

    //звук уровня//
    const musicfour = this.sound.add("musicfour");
    musicfour.setVolume(0.3);
    musicfour.setLoop(true);
    musicfour.play();

    //звук победы//
    const victorySound = this.sound.add("victory");
    victorySound.setVolume(0.8);

    //===============Создание игрока=============//
    this.player = this.physics.add.sprite(120, 400, "player");
    this.player.body.setSize(80, 95);
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.platColl = this.physics.add.collider(this.player, platforms);

    //атака на ctrl и остальные клавиши//
    this.keyCTRL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    this.cursors = this.input.keyboard.createCursorKeys();

    //===============Создание анимаций игрока и врагов=============//
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
      frameRate: 10
    });

    this.anims.create({
      key: 'spin',
      frames: this.anims.generateFrameNumbers('coin', {
        start: 0,
        end: 5
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "enemybomb",
      frames: this.anims.generateFrameNames("bomb", {
        prefix: "bombfly_",
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "enemybird",
      frames: this.anims.generateFrameNames("bird", {
        prefix: "birdfly_",
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "enemyboss",
      frames: this.anims.generateFrameNames("boss", {
        prefix: "skeleton_",
        start: 0,
        end: 10,
      }),
      frameRate: 10,
      repeat: -1
    });

    //===============Настройки камеры за игроком=============//
    this.physics.world.setBounds(0, 0, map.width * 64, this.heigth);
    // ограничиваем камеру размерами карты
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // заставляем камеру следовать за игроком
    this.cameras.main.startFollow(this.player);
    //своего рода хак, чтобы предотвратить пояление полос в тайлах
    this.cameras.main.roundPixels = true;
    this.cameras.main.resetFX();

    //===============начало игры, постепенное появление=============//
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    let textlevel = this.add.text(screenCenterX, screenCenterY, `BOSS Level`, {
      color: '#FFFFFF',
      fontSize: 56,
      fontWeight: 'bold',
      fontStyle: 'bold'
    });
    textlevel.setScrollFactor(0);
    textlevel.setOrigin(0.5, 0);
    textlevel.setAlpha(0.5);
    this.cameras.main.fadeIn(500);
    this.tweens.add({
      targets: textlevel,
      scaleX: 1.5,
      scaleY: 1.5,
      yoyo: true,
      delay: 500,
      duration: 200,
      onComplete: () => {
        this.tweens.add({
          targets: textlevel,
          y: 10,
          scaleX: 0.5,
          scaleY: 0.5,
          ease: 'Sine.easeInOut',
          delay: 500,
          duration: 400,
          onComplete: () => {
            textlevel.setFontSize(28)
            textlevel.setScale(1)
            this.tweens.add({
              targets: textlevel,
              alpha: 0,
              delay: 2000,
              duration: 400
            })
          }
        })
      }
    })

    //===============Создание шипов=============//
    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const spikeObjects = map.getObjectLayer("Spikes")["objects"];
    spikeObjects.forEach((spikeObject) => {
      const spike = this.spikes
        .create(
          spikeObject.x,
          spikeObject.y + 200 - spikeObject.height,
          "spike"
        )
        .setOrigin(0, 0);
      spike.body.setSize(spike.width, spike.height - 30).setOffset(0, 30);
    });

    //коллайдер игрока и шипов//
    this.otherColl = this.physics.add.collider(
      this.player,
      this.spikes,
      playerHit,
      updateHealthBar,
      this
    );

    //===============Создание воды/лавы=============//
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
      obj.body.height = object.height - 20;
    });
    this.physics.add.overlap(this.player, fakeObjects, this.gameOver, null, this);

    //===============Создание монет=============//
    const CoinLayer = map.getObjectLayer("CoinLayer")["objects"];
    let coins = this.physics.add.staticGroup();
    CoinLayer.forEach((object) => {
      let obj = coins.create(
        object.x + 30,
        object.y + 230 - object.height,
        "coin"
      );
      obj.body.setSize(obj.width - 30, obj.height - 30).setOffset(15, 15);
      obj.setScale(0.7);
      obj.anims.play('spin');
    });
    this.physics.add.overlap(this.player, coins, collectCoin, null, this);

    let text = this.add.text(10, 35, `Coins: ${this.coinScore}`, {
      fontSize: "32px",
      fill: "white",
    });
    text.setScrollFactor(0);

    function collectCoin(player, coin) {
      coin.destroy(coin.x, coin.y);
      coinSound.play();
      this.coinScore++;
      text.setText(`Coins: ${this.coinScore}`);
      return false;
    }

    //===============Создание ключей для перехода на уровень=============//
    const KeysLayer = map.getObjectLayer("KeysLayer")["objects"];
    let keys = this.physics.add.staticGroup();
    KeysLayer.forEach((object) => {
      let obj = keys.create(
        object.x + 30,
        object.y + 230 - object.height,
        "key"
      );
      obj.body.setSize(obj.width - 30, obj.height - 30).setOffset(15, 15);
    });

    this.physics.add.overlap(this.player, keys, collectKeys, null, this);

    let textkey = this.add.text(10, 65, `Keys: ${this.keyScore}`, {
      fontSize: "32px",
      fill: "white",
    });
    textkey.setScrollFactor(0);

    function collectKeys(player, key) {
      key.destroy(key.x, key.y);
      keySound.play();
      this.keyScore++;
      textkey.setText(`Keys: ${this.keyScore}`);
      return false;
    }

    //===============Создание полосы HP=============//
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

    //===============Создание полосы HP Bossa=============//
    const graphicsBoss = this.add.graphics();
    graphicsBoss.setScrollFactor(0);
    setHealthBarBoss(this.healthBoss);

    function updateHealthBarBoss() {
      this.healthBoss -= 15;
      setHealthBarBoss(this.healthBoss);
    }

    function setHealthBarBoss(healthBoss) {
      const width = 200;
      const percent = Phaser.Math.Clamp(healthBoss, 0, 100) / 100;
      graphicsBoss.clear();
      graphicsBoss.fillStyle(0x808080);
      graphicsBoss.fillRoundedRect(1350, 10, width, 20, 5);
      if (percent > 0) {
        graphicsBoss.fillStyle(0xff0000);
        graphicsBoss.fillRoundedRect(1350, 10, width * percent, 20, 5);
      }
    }

    let textBoss = this.add.text(1350, 35, `Boss HP`, {
      fontSize: "32px",
      fill: "white",
    });
    text.setScrollFactor(0);

    //===============Создание врагов=============//
    //Бомбы/ракеты//
    const enemySpawnBomb = map.getObjectLayer("Enemybomb")["objects"];
    this.enemiesBomb = this.add.group();
    enemySpawnBomb.forEach((object) => {
      let obj = this.enemiesBomb
        .create(
          object.x + 30,
          object.y + 230 - object.height,
          "bomb"
        )
      obj.setScale(1);
      obj.anims.play('enemybomb');
    });

    //Птички//
    const enemySpawn = map.getObjectLayer("Enemybird")["objects"];
    this.enemies = this.add.group();
    enemySpawn.forEach((object) => {
      let obj = this.enemies
        .create(
          object.x + 30,
          object.y + 230 - object.height,
          "bird"
        )
      obj.setScale(1);
      obj.anims.play('enemybird');
    });

    //БОСС//
    this.boss = this.physics.add.sprite(1400, 400, "boss");
    this.boss.body.setSize(130, 130);
    this.boss.setScale(1.1);
    this.boss.anims.play('enemyboss');
    this.boss.setBounce(0.1);
    this.boss.setCollideWorldBounds(true);
    this.boss.speed = 4;
    this.physics.add.collider(this.boss, platforms);
    this.physics.add.overlap(this.player, this.boss, primerkillenemy, updateHealthBarBoss, this);

    for (let i = 100; i < 1500; i += 4) {
      this.arrjump.push(i);
    }

    // задаем скорость врагов
    Phaser.Actions.Call(this.enemiesBomb.getChildren(), function (enemy) {
      enemy.speed = Math.random() * 2 + 1;
    }, this);
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
      enemy.speed = Math.random() * 2 + 1;
    }, this);

    // убить врага
    function primerkillenemy(player, boss) {
      if (this.touchBoss === 6) {
        player.setVelocityY(-350);
        player.play("jump", true);
        boss.anims.stop();
        boss.speed = 0;
        boss.setAlpha(0);
        this.tweens.add({
          targets: boss,
          alpha: 1,
          duration: 100,
          ease: "Linear",
          repeat: 2,
          onComplete: () => {
            boss.destroy();
            //this.scene.pause();
            musicfour.stop();
            victorySound.play();
            let textfinishlevel = this.add.text(screenCenterX, screenCenterY, `YOU WIN`, {
              fontFamily: "Arial",
              color: 'red',
              fontSize: 100,
              fontWeight: 'bolder',
            });
            textfinishlevel.setScrollFactor(0);
            textfinishlevel.setOrigin(0.5, 0);
            textfinishlevel.setAlpha(0.5);
            this.tweens.add({
              targets: textfinishlevel,
              alpha: 0,
              delay: 2000,
              duration: 400,
              onComplete: () => {
                this.nextLevel();
              }
            })
          }
        });
      }
      if ((boss.body.touching.up && player.body.touching.down) || boss.body.touching.up || player.body.touching.down) {
        player.setVelocityY(-350);
        player.play("jump", true);
        boss.setVelocityY(100);
        boss.setAlpha(0);
        this.tweens.add({
          targets: boss,
          alpha: 1,
          duration: 100,
          ease: "Linear",
          repeat: 2,
        });
        this.touchBoss++;
      } else {
        this.gameOver();
      }
    }

    //урон игроку
    function playerHit(player, spike) {
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

  update() {

    //бесконечный фон
    this.background.setTilePosition(this.cameras.main.scrollX);

    //===============Управление игроком=============//  
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
      this.player.setVelocityX(0);
      if (this.keyCTRL.isDown) {
        this.player.play("attack", true);
      }
      else if (this.player.body.onFloor()) {
        this.player.play("idle", true);
      }
    }
    if (
      (this.cursors.space.isDown || this.cursors.up.isDown) &&
      this.player.body.onFloor()
    ) {
      this.player.setVelocityY(-350);
      this.player.play("jump", true);
      this.jumpSound.play();
    }
    if (this.player.body.velocity.x > 0) {
      this.player.setFlipX(false);
    } else if (this.player.body.velocity.x < 0) {
      this.player.setFlipX(true);
    }

    //===============Игрок умер=============//  
    if (this.health <= 0) {
      this.player.play("die", true);
      this.physics.world.removeCollider(this.platColl);
      this.physics.world.removeCollider(this.otherColl);
      this.time.delayedCall(250, function () {
        this.gameOver();
      }, [], this);
    }

    //===============Алгоритмы врагов=============//
    //бомбы/ракеты//
    let enemiesBomb = this.enemiesBomb.getChildren();
    let numEnemiesBomb = enemiesBomb.length;

    for (let i = 0; i < numEnemiesBomb; i++) {
      // перемещаем каждого из врагов
      enemiesBomb[i].x -= enemiesBomb[i].speed;
      // разворачиваем движение, если враг достиг границы
      if (enemiesBomb[i].x >= this.enemyMaxY && enemiesBomb[i].speed < 0) {
        enemiesBomb[i].speed *= -1;
        enemiesBomb[i].setFlipX(false);
      } else if (enemiesBomb[i].x <= this.enemyMinY && enemiesBomb[i].speed > 0) {
        enemiesBomb[i].speed *= -1;
        enemiesBomb[i].setFlipX(true);
      }
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemiesBomb[i].getBounds())) {
        this.gameOver();
        break;
      }
    }

    //птички//
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {
      // перемещаем каждого из врагов
      enemies[i].x -= enemies[i].speed;
      // разворачиваем движение, если враг достиг границы
      if (enemies[i].x >= this.enemyMaxY && enemies[i].speed < 0) {
        enemies[i].speed *= -1;
        enemies[i].setFlipX(false);
      } else if (enemies[i].x <= this.enemyMinY && enemies[i].speed > 0) {
        enemies[i].speed *= -1;
        enemies[i].setFlipX(true);
      }
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
        this.gameOver();
        break;
      }
    }

    //БОСС//
    this.boss.x -= this.boss.speed;
    if (this.boss.x >= this.bossMaxY && this.boss.speed < 0) {
      this.boss.speed *= -1;
      this.boss.setFlipX(false);
    } else if (this.boss.x <= this.bossMinY && this.boss.speed > 0) {
      this.boss.speed *= -1;
      this.boss.setFlipX(true);
    }
    if (this.boss.x === this.jumpBoss) {
      this.boss.setVelocityY(-500);
      this.time.delayedCall(500, function () {
        this.jumpingBoss();
      }, [], this);
    }
  }
  jumpingBoss() {
    this.jumpBoss = this.arrjump[Math.floor(Math.random() * this.arrjump.length)];
  }

  nextLevel() {
    this.time.delayedCall(500, function () {
      this.cameras.main.fade(250);
      this.sound.removeByKey('musicfour');
      this.scene.remove('level4');
      this.scene.start('title');
    }, [], this);
  }
  gameOver() {
    this.isPlayerAlive = false;
    this.cameras.main.shake(500);
    this.sound.removeByKey('musicfour');
    this.health = 100;
    this.healthBoss = 100;
    this.coinScore = 0;
    this.keyScore = 0;
    this.touchBoss = 0;

    // затухание камеры через 500мс
    this.time.delayedCall(500, function () {
      this.cameras.main.fade(250);
    }, [], this);

    // перезапускаем сцену через 1000мс
    this.time.delayedCall(1000, function () {
      this.scene.restart();
    }, [], this);
  }
}



