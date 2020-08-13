import Phaser from 'phaser'

const GROUND_KEY = 'ground'
const CSOKA_KEY = 'csoka'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game-scene')

        this.player = undefined
    }

    preload() {
        this.load.image('sky', 'assets/sky.png')
        this.load.image(GROUND_KEY, 'assets/platform.png')
        this.load.image('banana', 'assets/banana.png')
        this.load.image('covid', 'assets/covid1.png')

        this.load.spritesheet(CSOKA_KEY, 'assets/csoka-dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }

    create() {
        this.add.image(400, 300, 'sky')

        this.createPlatforms()
        this.createPlayer()
    }

    createPlatforms() {
        const platforms = this.physics.add.staticGroup()

        platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()

        platforms.create(600, 450, GROUND_KEY)
        platforms.create(100, 380, GROUND_KEY)
        platforms.create(700, 280, GROUND_KEY)
        platforms.create(50, 200, GROUND_KEY)

    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 450, CSOKA_KEY)
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(CSOKA_KEY, {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        }) 

        this.anims.create({
            key: 'turn',
            frames: [ {
                key: CSOKA_KEY,
                frame: 4
            }],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(CSOKA_KEY, {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        })
    }
}