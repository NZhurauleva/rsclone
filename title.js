class TitleScene extends Phaser.Scene {
    constructor() {
        super("title");
    }

    preload() {
        this.load.image("background-title", "assets/images/bk.jpg")
        this.load.image("play", "assets/images/button.webp");
    }
    create() {
        
        const backgroundImage = this.add.image(0, 0, "background-title").setOrigin(0, 0);
        backgroundImage.setScale(1.2);

        let play = this.add.image(690, 330, 'play')
        play.setScale(0.5)
        play.setInteractive()
        play.on('pointerdown', () => this.scene.start('level1'))

    }
    update() {

    }
}
