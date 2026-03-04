import { Scene } from 'phaser';

export class Winner extends Scene {
    constructor() {
        super('Winner');
    }

    // create ()
    // {
    //     this.cameras.main.setBackgroundColor(0xff0000);

    //     this.add.image(512, 384, 'background').setAlpha(0.5);

    //     this.add.text(512, 384, 'Game Over', {
    //         fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
    //         stroke: '#000000', strokeThickness: 8,
    //         align: 'center'
    //     }).setOrigin(0.5);

    //     this.input.once('pointerdown', () => {

    //         this.scene.start('MainMenu');

    //     });
    // }



    create() {
        this.cameras.main.setBackgroundColor(0x00ff00); // Set background color to green

        // Add background image
        const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background').setAlpha(0.5);
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Add congratulatory text
        this.add.text(this.cameras.main.centerX, (5*this.cameras.main.centerY)/7, 'WIN!', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Add secondary message
        this.add.text(this.cameras.main.centerX, 100+(5*this.cameras.main.centerY)/7, 'Congratulations!', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        // Create confetti effect
        this.createConfetti(100);  // Number of confetti pieces

        // Set up input interaction to go back to the main menu
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }

    createConfetti(count) {
        for (let i = 0; i < count; i++) {
            // Random x and y positions
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height / 2);
            // const y = 0;

            // Create a confetti sprite
            const confetti = this.add.graphics();

            // Generate random color
            const color = Phaser.Display.Color.RandomRGB().color;

            // Draw a square or rectangle for the confetti
            const size = Phaser.Math.Between(5, 15); // Random size for confetti
            confetti.fillStyle(color, 1); // Set the fill color
            confetti.fillRect(x, y, size, size); // Draw at the bottom center

            // Randomize scale, angle, and velocity
            const scale = Phaser.Math.FloatBetween(0.5, 1.5);
            confetti.setScale(scale);

            //motion
            this.explodeAndFall(confetti)

            // this.tweens.add({
            //     targets: confetti,
            //     y: y-200,  // Move downwards
            //     duration: 500,
            //     ease: 'exponential.easeOut', // Change how the Y position eases
            //     onComplete: () => {
            // this.tweens.add({
            //     targets: confetti,
            //     y: this.cameras.main.height,  // Move downwards
            //     duration: 3000,
            //     ease: 'exponential.easeOut', // Change how the Y position eases
            //     onComplete: () => {
            //         confetti.destroy(); // Remove sprite after animation
            //     }
            // });
            //     }
            // });


        }
    }

    explodeAndFall(confettiObject) {
        // Generate random angles for confetti explosion
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        // const explosionSpeed = Phaser.Math.Between(0, this.cameras.main.height * 2); // Speed of explosion outward
        const explosionSpeed = this.cameras.main.height; // Speed of explosion outward

        // Create an initial explosion
        this.tweens.add({
            targets: confettiObject,
            x: confettiObject.x + Math.cos(angle) * explosionSpeed,
            y: confettiObject.y + Math.sin(angle) * explosionSpeed,
            duration: 3000,
            ease: 'quad.easeOut',
            onComplete: () => {
                confettiObject.destroy()
            }
        });

    }



}
