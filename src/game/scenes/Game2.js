import { Scene } from 'phaser';
import { setupClickCounter } from './logic/GameHeader.js';

const NUM_COLUMNS = 3;
const NUM_ROWS = 4;
let TARGET_SIZE, DRAGGABLE_WIDTH, DRAGGABLE_HEIGHT;
const SNAPPING_DISTANCE_RATIO = 0.3; // Ratio for snapping distance


export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Preload any necessary assets here
        this.load.image('grill', 'assets/grill.png'); // Load the grill image
        this.load.image('skewer', 'assets/skewer0.png'); // Load the skewer image
    }

    create() {
        let targetObjects = [];
        let draggableObjects = [];
        const baseWidth = this.game.config.width / NUM_COLUMNS; // Base width per column

        // Set sizes based on viewport dimensions
        TARGET_SIZE = baseWidth * 0.8; // Target size is 80% of base width
        DRAGGABLE_WIDTH = baseWidth * 0.7; // Draggable width is 70% of base width
        DRAGGABLE_HEIGHT = TARGET_SIZE * 1.2; // Make draggable height 120% of target size
        const SNAPPING_DISTANCE = TARGET_SIZE * SNAPPING_DISTANCE_RATIO; // 5% of target size for snapping
        // Create target objects in a grid
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLUMNS; col++) {
                const targetX = col * (TARGET_SIZE + 20) + TARGET_SIZE / 2; // Center target
                const targetY = row * (TARGET_SIZE + 20) + TARGET_SIZE / 2; // Center target
                const target = this.physics.add.sprite(targetX, targetY, 'grill');
                target.setDisplaySize(TARGET_SIZE, TARGET_SIZE); // Set target size
                targetObjects.push(target);
            }
        }


        // Setup input click counter and behavior
        setupClickCounter(this);

        const viewportWidth = this.game.config.width; // Example viewport width
        const viewportHeight = this.game.config.height; // Example viewport height
        const coordinates = [];
        const columns = 12;
        const rows = 4;
        const columnGroupOffset = 3; // Group offset for every 3 columns
        const offsetX = 10; // Offset between groups of columns
        const offsetY = 20; // Vertical offset between rows

        // Calculate the width and height for individual coordinates
        const cellWidth = viewportWidth / columns;
        const cellHeight = viewportHeight / rows;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                // Calculate the x position with offset for every 3 columns
                const xOffset = Math.floor(col / columnGroupOffset) * offsetX;
                const x = col * cellWidth + xOffset;
                const y = row * cellHeight + offsetY * row;

                // Add the coordinate to the array
                coordinates.push({ x: x, y: y });
            }
        }

        console.log("Generated Coordinate[2]: ", coordinates[2].x, coordinates[2].y);
        console.log(coordinates);

        // Create draggable objects
        coordinates.forEach(coord => {
            const skewer = this.physics.add.sprite(coord.x, coord.y, 'skewer');
            // skewer.setOrigin(0);
            skewer.setInteractive();
            this.input.setDraggable(skewer);

            draggableObjects.push(skewer);
        });
            this.input.on('drag', (pointer, skewer, dragX, dragY) => {
                skewer.x = dragX;
                skewer.y = dragY;
            });

            this.input.on('dragend', (pointer, skewer) => {
                console.log(skewer.texture.key)
                targetObjects.forEach(target => {
                    const distance = Phaser.Math.Distance.Between(skewer.x, skewer.y, target.x, target.y);

                    if (distance < SNAPPING_DISTANCE) {
                        skewer.x = target.x;
                        skewer.y = target.y;
                    }
                });
            });

    }

}
