import { Scene } from 'phaser';
import { preloadSkewers } from './preloadSkewers.js';
import { checkWinCondition } from './logic/winCondition.js';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Preload any necessary assets here
        this.load.image('grill', 'assets/grill.png'); // Load the grill image
        preloadSkewers(this); // Preload skewer images using the helper function
    }

    create() {
        let targetObjects = [];
        let draggableObjects = [];
        let queuedSkewers = [];

        const viewportWidth = this.game.config.width; // Example viewport width
        const viewportHeight = this.game.config.height; // Example viewport height
        const coordinates = [];
        const columns = 9;
        const rows = 4;
        const columnGroupOffset = 3; // Group offset for every 3 columns

        const TARGET_SIZE = 0.8 * this.game.config.width / (columns/3); // Base width per column

        // Calculate the width and height for individual coordinates
        const cellWidth = viewportWidth / (4 * columns / 3);
        const cellHeight = viewportHeight / (1.5 * rows);
        const offsetX = cellWidth; // Offset between groups of columns
        // const offsetX = 50; // Offset between groups of columns
        const offsetY = cellHeight / 2; // Vertical offset between rows
        // const offsetY = 100; // Vertical offset between rows
        const SNAPPING_DISTANCE = cellWidth; // 5% of target size for snapping

        // console.log("viewportWidth: ", viewportWidth, "viewportHeight: ", viewportHeight);
        // console.log("cellWidth: ", cellWidth, "cellHeight: ", cellHeight);
        // console.log("width ratio: ", viewportWidth / cellWidth, "height ratio: ", viewportHeight / cellHeight);

        for (let i = 0; i < 45; i++) {
            queuedSkewers.push(`skewer${Math.floor(Math.random() * 4)}`);
        }

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                // Calculate the x position with offset for every 3 columns
                const xOffset = (Math.floor(col / columnGroupOffset) + 1) * offsetX;
                const x = col * cellWidth + xOffset;
                // const y = row * cellHeight;
                const y = row * cellHeight + (offsetY * (row + 1));

                // Add the coordinate to the array
                coordinates.push({ x: x, y: y, occupied: false, type: 'empty' });
                // console.log('for loop: ', 'row: ', row, 'col: ', col, 'x: ', x, 'y: ', y);
            }
        }

        // console.log("Generated Coordinate[2]: ", coordinates[2].x, coordinates[2].y);
        // console.log(coordinates);
        // Create target objects in a grid
        for (let i = 1; i < coordinates.length; i += 3) {
            const coord = coordinates[i];
            const target = this.physics.add.sprite(coord.x, coord.y + (0.4 * offsetY), 'grill');
            target.setDisplaySize(TARGET_SIZE, TARGET_SIZE);
            targetObjects.push(target);
        }

        // Create draggable objects
        coordinates.forEach(coord => {

            // Generate a random number between 0 and 1
            const randomNum = Math.random();

            // Set your probability threshold (e.g., 0.5 for 50%)
            const probabilityThreshold = 0.3;

            // Skip creating the skewer based on the random number
            if (randomNum < probabilityThreshold) {
                return; // Skip this iteration
            } else {
                const skewerKey = queuedSkewers.shift();
                // console.log(queuedSkewers);
                const skewer = this.physics.add.sprite(coord.x, coord.y, skewerKey);
                // skewer.setOrigin(0);
                skewer.setInteractive();
                const spriteWidth = skewer.width;
                const aspectRatio = skewer.height / spriteWidth;
                skewer.setDisplaySize(cellWidth, cellWidth * aspectRatio);
                // skewer.setDisplaySize(cellWidth * 0.8, cellHeight * 0.8); // Set skewer size relative to cell size
                skewer.index = coordinates.indexOf(coord); // Store the index of the coordinate in the skewer
                this.input.setDraggable(skewer);
                coord.occupied = true; // Associate the skewer with the coordinate
                coord.type = skewer.texture.key; // Store the type of skewer in the coordinate for win condition checking
                // console.log('SKEWER')
                // console.log('skewer index: ', skewer.index);

                draggableObjects.push(skewer);
            }
        });

        //setup drag and drop logic
        this.input.on('drag', (pointer, skewer, dragX, dragY) => {
            skewer.x = dragX;
            skewer.y = dragY;
        });

        this.input.on('dragstart', (pointer, skewer) => {
            // Store the original position of the skewer when dragging starts
            skewer.originalX = skewer.x;
            skewer.originalY = skewer.y;
        });

        this.input.on('dragend', (pointer, skewer) => {
            console.log(skewer.texture.key);
            let snapped = false; // Flag to check if snapping occurred
            let final = null; // Variable to store the target that was snapped to

            // Use find() to get first eligible target and break immediately
            const targetCoord = coordinates.find((target, index) => {
                // Skip the current coordinate where this skewer already is
                if (index === skewer.index) {
                    return false;
                }

                const distance = Phaser.Math.Distance.Between(skewer.x, skewer.y, target.x, target.y);

                // Check if within snapping distance
                if (distance < SNAPPING_DISTANCE) {
                    // Check if target is already occupied
                    if (target.occupied) {
                        console.log("Target " + index + " already occupied!Continue to check if overlapping with empty target.");
                        return false; // Continue searching
                    }
                    // Found valid target
                    console.log("Snapped to target " + index);
                    snapped = true;
                    final = index;
                    return true; // Stop searching
                }
                // console.log("failed to snap to target " + index);
                return false; // Continue searching
            });

            // If snapping occurred, update positions and state
            if (snapped) {
                skewer.x = targetCoord.x;
                skewer.y = targetCoord.y;
                coordinates[skewer.index].occupied = false; // Clear previous coordinate
                coordinates[final].occupied = true; // Mark new coordinate as occupied
                skewer.index = final; // Update skewer's index
                checkWinCondition(coordinates);
            } else {
                // Return skewer to original position if no valid snap found
                skewer.x = skewer.originalX;
                skewer.y = skewer.originalY;
            }
        });


    }

}
