import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
        // Preload any necessary assets here
        this.load.image('grill', 'assets/grill.png'); // Load the grill image
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
        } else if (this.clickCount === 3) {
            // Second click behavior
            this.scene.start('GameOver');
            // Reset the counter or add further logic as needed
            this.clickCount = 0; // Resetting for demonstration
        }
    });

        // Create a group for the grills
        this.grillGroup = this.add.group();

        const gridSize = 3; // 3x3 grid

        const grillWidth = this.cameras.main.width / gridSize; // Width of each grill
        const grillHeight = this.cameras.main.height / gridSize; // Height of each grill

        // Loop to create and position grills in a 3x3 grid
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const grill = this.grillGroup.create(
                    col * grillWidth, 
                    row * grillHeight, 
                    'grill'
                );
                grill.setOrigin(0); // Set origin to top-left
                grill.setInteractive(); // Make grill interactive

                // Add a click event listener for each grill
                grill.on('pointerdown', () => {
                    this.onGrillClicked(grill);
                });
            }
        }


    }

    onGrillClicked(grill) {
        console.log('Grill clicked:', grill);
        // Additional logic can be added here (e.g. changing the color or state)
        grill.setTint(0xff0000); // Example: change color to red on click
    }
}
