//import GameScene from './game.js'
//import TitleScene from './title.js'

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1366,
    heigth: 768,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [TitleScene, PreloaderScene, GameSceneOne, GameSceneTwo, GameSceneThree],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 450 },
        debug: false
      },
    }
  };

  const game = new Phaser.Game(config);