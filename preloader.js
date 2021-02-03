class PreloaderScene extends Phaser.Scene {
    constructor() {
        super("preloader");
    }
    preload() {
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 20,
            text: 'Loading...',
            style: {
                fontFamily: 'Finger Paint',
                fontSize: 30,
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const rulesText = [
            'Avoid flying birds and rockets, they cannot be killed. ',
            'Collect 33 coins and key.',
            'The rest of the enemies can be killed by jumping on them.',
            'A sword for courage, you can wave it by pressing Ctrl.'
        ];

        const text = this.add.text(width / 2, height / 2 + 150, rulesText, { fontFamily: "Arial Black", fontSize: 30, align: 'center' }).setOrigin(0.5, 0.5);
        text.setStroke('#000000', 4);
        const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
        gradient.addColorStop(0, '#111111');
        gradient.addColorStop(.5, '#ffffff');
        gradient.addColorStop(.5, '#aaaaaa');
        gradient.addColorStop(1, '#111111');

        text.setFill(gradient);


        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 25,
            text: '0%',
            style: {
                fontFamily: 'Nosifer',
                fontSize: 20,
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        this.load.image('logo', 'assets/images/playerbandit.png');
        for (let i = 0; i < 500; i++) {
            this.load.image('logo' + i, 'assets/images/playerbandit.png');
        }
    }

    create() {
        const logo = this.add.image(400, 300, 'logo');
        this.scene.start('level1')
    }
}