import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background').setAlpha(0.5);
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
