import { Scene } from 'phaser';
import { setupBackground, setupClickCounter } from './logic/GameHeader.js';

const NUM_COLUMNS = 3;
const NUM_ROWS = 4;
const TARGET_SIZE = 100;
const DRAGGABLE_WIDTH = 80;
const DRAGGABLE_HEIGHT = 120;
const SNAPPING_DISTANCE = 50;

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
        // Create target objects in grid
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLUMNS; col++) {
                const targetX = col * (TARGET_SIZE + 20) + 100;
                const targetY = row * (TARGET_SIZE + 20) + 50;
                const target = this.physics.add.sprite(targetX, targetY, 'grill');
                target.setScale(1);
                targetObjects.push(target);
            }
        }

        // Create draggable objects
        const draggableConfig = new Array(NUM_COLUMNS * NUM_ROWS).fill(null).map((_, index) => {
            return { x: 50 + (index % NUM_COLUMNS) * (DRAGGABLE_WIDTH + 20), y: 50 + Math.floor(index / NUM_COLUMNS) * (DRAGGABLE_HEIGHT + 20) };
        });

        draggableConfig.forEach(config => {
            const draggable = this.physics.add.sprite(config.x, config.y, 'skewer');
            draggable.setScale(0.25);
            draggable.setInteractive();
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
