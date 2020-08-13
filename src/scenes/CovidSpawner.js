import Phaser from 'phaser'

export default class CovidSpawner {
    
    
    constructor(scene, covidKey = 'covid') {
        this.scene = scene
        this.key = covidKey

        this._group = this.scene.physics.add.group()
    }

    get group() {
        return this._group
    }

    spawn(playerX = 0) {
        const x = (playerX < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

        const covid = this.group.create(x, 16, this.key)
        covid.setBounce(1)
        covid.setCollideWorldBounds(true)
        covid.setVelocity(Phaser.Math.Between(-200, 200), 20)

        return covid
    }
    
}