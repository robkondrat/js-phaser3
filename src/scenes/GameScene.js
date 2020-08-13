import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel'
import CovidSpawner from './CovidSpawner'

const GROUND_KEY = 'ground'
const CSOKA_KEY = 'csoka'
const BANANA_KEY = 'banana'
const COVID_KEY = 'covid'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game-scene')

        this.player = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
        this.bananas = undefined
        this.covidSpawner = undefined

        this.gameOver = false
    }


    preload() {
        this.load.image('sky', 'assets/sky.png')
        this.load.image(GROUND_KEY, 'assets/platform.png')
        this.load.image(BANANA_KEY, 'assets/banana.png')
        this.load.image(COVID_KEY, 'assets/covid1.png')


        this.load.spritesheet(CSOKA_KEY, 'assets/csoka-dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }



    create() {
        this.add.image(400, 300, 'sky')

        const platforms = this.createPlatforms()
        this.player = this.createPlayer()
        this.bananas = this.createBananas()

        this.scoreLabel = this.createScoreLabel(16, 16, 0)

        this.covidSpawner = new CovidSpawner(this, COVID_KEY)
        const covidGroup = this.covidSpawner.group

        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(this.bananas, platforms)
        this.physics.add.collider(covidGroup, platforms)
        this.physics.add.collider(this.player, covidGroup, this.hitCovid, null, this)

        this.physics.add.overlap(this.player, this.bananas, this.collectBanana, null, this)

        this.cursors = this.input.keyboard.createCursorKeys()


    }

    update() {
        if (this.gameOver) {
            return
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160)

            this.player.anims.play('left', true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160)

            this.player.anims.play('right', true)
        } else {
            this.player.setVelocityX(0)

            this.player.anims.play('turn')
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330)
        }
        
    }

    createPlatforms() {
        const platforms = this.physics.add.staticGroup()

        platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()

        platforms.create(600, 450, GROUND_KEY)
        platforms.create(100, 380, GROUND_KEY)
        platforms.create(700, 280, GROUND_KEY)
        platforms.create(50, 200, GROUND_KEY)

        return platforms
    }

    createPlayer() {
        const player = this.physics.add.sprite(100, 450, CSOKA_KEY)
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)

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

        return player
    }

    createBananas() {
        
        const bananas = this.physics.add.group({
            key: BANANA_KEY,
            repeat: 11,
            setXY: {
                x: 12,
                y: 0, 
                stepX: 70
            }
        })

        bananas.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })

        return bananas
    }

    collectBanana(player, banana) {
        banana.disableBody(true, true)

        this.scoreLabel.add(10)

        console.log(this.bananas);

        if (this.bananas.countActive(true) === 0) {
            this.bananas.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true)
            })
        }

        this.covidSpawner.spawn(player.x)
    }

    createScoreLabel(x, y, score) {
        const style = {
            fontSize: '32px',
            fill: '#000'
        }
        const label = new ScoreLabel(this, x, y, score, style)

        this.add.existing(label)

        return label
    }

    hitCovid(player, covid) {
        this.physics.pause()

        player.setTint(0Xff0000)

        player.anims.play('turn')
        
        this.gameOver = true
    }
}