class PreloaderScene extends Phaser.Scene {
    constructor() {
        super("preloader");
    }
    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                fontFamily: 'Finger Paint',
                fontSize: 40,
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

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
            console.log(file.src);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        this.load.image('logo', 'logoyocton.png');
        for (let i = 0; i < 500; i++) {
            this.load.image('logo' + i, 'logoyocton.png');
        }
    }

    create() {
        const logo = this.add.image(400, 300, 'logo');
        this.scene.start('level1')
    }
}