import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY-100, 'logo');

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
