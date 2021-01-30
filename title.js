class TitleScene extends Phaser.Scene {
    constructor() {
        super("title");
    }

    preload() {
        this.load.image("play", "assets/images/button.webp");
        this.load.image('sonic', 'assets/images/idle-0.png');
        this.load.image('bg', ['assets/images/stones.png', 'assets/images/stones_n.png']);
        this.load.bitmapFont('ice', ['assets/fonts/azo-fire.png', 'assets/fonts/azo-fire_n.png'],
            'assets/fonts/azo-fire.xml');
    }
    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let play = this.add.image(screenCenterX, screenCenterY+50, 'play');
        play.setScale(0.6)
        play.setInteractive()
        play.on('pointerdown', () => this.scene.start('preloader'))
       
        this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.25);
        this.add.sprite(1424, 300, 'bg').setPipeline('Light2D').setAlpha(0.25);
        this.add.sprite(screenCenterX-500, screenCenterY+300, 'sonic').setOrigin(0.5, 1).setScale(0.8);
        
        this.add.bitmapText(screenCenterX, screenCenterY-100, 'ice', 'Bandit game', 110).setCenterAlign().setOrigin(0.5).setPipeline('Light2D');

        this.lights.enable();
        this.lights.setAmbientColor(0x808080);
        let spotlight = this.lights.addLight(400, 300, 280).setIntensity(3);
        this.input.on('pointermove', function (pointer) {
            spotlight.x = pointer.x;
            spotlight.y = pointer.y;
        });

        var colors = [
            0xffffff, 0xff0000, 0x00ff00, 0x00ffff, 0xff00ff, 0xffff00
        ];

        var currentColor = 0;
        this.input.on('pointerdown', function (pointer) {
            currentColor++;
            if (currentColor === colors.length) {
                currentColor = 0;
            }
            spotlight.setColor(colors[currentColor]);
        });
    }
}
