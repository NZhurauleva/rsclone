const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1366,
    heigth: 768,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [GameScene],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 450 },
        debug: true
      },
    }
  };

  const game = new Phaser.Game(config);