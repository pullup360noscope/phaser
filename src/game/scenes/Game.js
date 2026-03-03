import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);
        // this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

    // Initialize a counter to keep track of clicks
    this.clickCount = 0;

    this.input.on('pointerdown', () => {
        this.clickCount++;

        if (this.clickCount === 1) {
            // First click behavior
            console.log("Second click detected! You could add different logic here.");
        } else if (this.clickCount === 2) {
            // Second click behavior
            this.scene.start('GameOver');
            // Reset the counter or add further logic as needed
            this.clickCount = 0; // Resetting for demonstration
        }
    });
    }
}
