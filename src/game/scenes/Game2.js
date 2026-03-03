import { Scene } from 'phaser';
import { setupClickCounter } from './logic/GameHeader.js';

const NUM_COLUMNS = 3;
const NUM_ROWS = 4;
let TARGET_SIZE, DRAGGABLE_WIDTH, DRAGGABLE_HEIGHT;
const SNAPPING_DISTANCE_RATIO = 0.3; // Ratio for snapping distance

let targetObjects = [];
let draggableObjects = [];

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Preload any necessary assets here
        this.load.image('grill', 'assets/grill.png'); // Load the grill image
        this.load.image('skewer', 'assets/skewer.png'); // Load the skewer image
    }

    create() {
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

        // Create draggable objects
        const draggableConfig = new Array(NUM_COLUMNS * NUM_ROWS).fill(null).map((_, index) => {
            return {
                x: (index % NUM_COLUMNS) * (DRAGGABLE_WIDTH + 20) + DRAGGABLE_WIDTH / 2,
                y: Math.floor(index / NUM_COLUMNS) * (DRAGGABLE_HEIGHT + 20) + DRAGGABLE_HEIGHT / 2
            };
        });

        draggableConfig.forEach(config => {
            const draggable = this.physics.add.sprite(config.x, config.y, 'skewer');
            draggable.setInteractive();
            draggable.setScale(0.25);
            this.input.setDraggable(draggable);

            this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
                gameObject.x = dragX;
                gameObject.y = dragY;
            });

            this.input.on('dragend', (pointer, gameObject) => {
                targetObjects.forEach(target => {
                    const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, target.x, target.y);

                    if (distance < SNAPPING_DISTANCE) {
                        gameObject.x = target.x;
                        gameObject.y = target.y;
                    }
                });
            });

            draggableObjects.push(draggable);
        });

        // Setup input click counter and behavior
        setupClickCounter(this);
    }

    snapToTargets(draggable) {
        targetObjects.forEach(target => {
            const distance = Phaser.Math.Distance.Between(draggable.x, draggable.y, target.x, target.y);

            if (distance < SNAPPING_DISTANCE) {
                draggable.x = target.x;
                draggable.y = target.y;
            }
        });
    }

}
