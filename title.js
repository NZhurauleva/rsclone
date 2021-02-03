class TitleScene extends Phaser.Scene {
    constructor() {
        super("title");
    }

    preload() {
        this.load.image("play", "assets/images/button.webp");
        this.load.image('sonic', 'assets/images/playerbandit.png');
        this.load.image('enbird', 'assets/images/bird.png');
        this.load.image('enbomb', 'assets/images/bomb.png');
        this.load.image('engreen', 'assets/images/green.png');
        this.load.image('enniga', 'assets/images/niga.png');
        this.load.image('skelboss', 'assets/images/skeleton.png');
        this.load.image('bg', ['assets/images/stones.png', 'assets/images/stones_n.png']);
        this.load.bitmapFont('ice', ['assets/fonts/azo-fire.png', 'assets/fonts/azo-fire_n.png'],
            'assets/fonts/azo-fire.xml');

        this.load.image('logo', 'assets/images/rs_school_js.svg');

    }
    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let play = this.add.image(screenCenterX, screenCenterY + 50, 'play');
        play.setScale(0.6)
        play.setInteractive()
        play.on('pointerdown', () => this.scene.start('preloader'))

        this.add.sprite(500, 500, 'bg').setPipeline('Light2D').setAlpha(0.35);
        this.add.sprite(1524, 500, 'bg').setPipeline('Light2D').setAlpha(0.35);

        this.add.sprite(screenCenterX - 450, screenCenterY + 300, 'sonic').setOrigin(0.5, 1).setScale(0.8);

        this.add.sprite(screenCenterX + 280, screenCenterY + 290, 'enbird').setOrigin(0.5, 1).setScale(0.2);
        this.add.sprite(screenCenterX + 400, screenCenterY + 220, 'enbomb').setOrigin(0.5, 1).setScale(0.17);
        this.add.sprite(screenCenterX + 570, screenCenterY + 240, 'engreen').setOrigin(0.5, 1).setScale(0.3);
        this.add.sprite(screenCenterX + 470, screenCenterY + 310, 'enniga').setOrigin(0.5, 1).setScale(0.36);
        this.add.sprite(screenCenterX+ 500, screenCenterY + 180, 'skelboss').setOrigin(0.5, 1).setScale(0.6);

        this.add.bitmapText(screenCenterX, screenCenterY - 100, 'ice', 'Bandit game', 110).setCenterAlign().setOrigin(0.5).setPipeline('Light2D');

        const gitMax = this.add.bitmapText(screenCenterX + 370, screenCenterY + 340, 'ice', 'MAXONVTEC', 20).setInteractive().setCenterAlign().setOrigin(0.2).setScale(0.7);
        gitMax.on('pointerup', function () { openExternalLink('https://github.com/MAXONVTEC'); }, this);
        const gitNat = this.add.bitmapText(screenCenterX + 490, screenCenterY + 340, 'ice', 'Natallia22', 20).setInteractive().setCenterAlign().setOrigin(0.2).setScale(0.7);
        gitNat.on('pointerup', function () { openExternalLink('https://github.com/Natallia22'); }, this);
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

        const button = this.add.image(screenCenterX + 680, screenCenterY + 320, 'logo').setInteractive().setScale(0.5);
        button.on('pointerup', function () { openExternalLink('https://rs.school/'); }, this);

        function openExternalLink(url) {
            const link = window.open(url, '_blank');

            if (link && link.focus) {
                link.focus();
            }
            else if (!link) {
                window.location.href = url;
            }
        }
    }
}



