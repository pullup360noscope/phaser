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
        preloadSkewers(this, 4); // Preload skewer images using the helper function
    }

    create() {
        let queuedSkewers = []; //can be re-assigned
        const coordinates = []; //contents modified, but pointer doesn't get re-assigned

        const columns = 9;
        const rows = 4;
        const columnGroupOffset = 3; // Group offset for every 3 columns
        const TARGET_SIZE = 0.8 * this.game.config.width / (columns / 3); // Base width per column

        // Calculate the width and height for individual coordinates
        const cellWidth = this.game.config.width / (4 * columns / 3);
        const cellHeight = this.game.config.height / (1.5 * rows);
        const offsetX = cellWidth; // Offset between groups of columns
        const offsetY = cellHeight / 2; // Vertical offset between rows
        const SNAPPING_DISTANCE = cellWidth; // 5% of target size for snapping

        let type = 'empty';
        for (let i = 0; i < 10; i++) {
            type = `skewer${Math.floor(Math.random() * 4)}`;
            queuedSkewers.push(type, type, type);
        }

        let shuffled = [];
        let add = null;
        let recentlyAdded = null;
        let notRecentlyAdded = null;
        // Generate a random number between 0 and 1
        let randomNum;
        let i = 0; // Initialize the counter

        do {
            randomNum = Math.random();
            if (randomNum < 0.3) {
                shuffled.push('empty');
            }

            add = queuedSkewers.splice(Math.floor(Math.random() * queuedSkewers.length), 1)[0];

            // Check if there are enough items in shuffled to compare
            if (shuffled.length >= 2) {
                recentlyAdded = shuffled[shuffled.length - 1];
                notRecentlyAdded = shuffled[shuffled.length - 2];

                if (recentlyAdded === notRecentlyAdded && recentlyAdded === add) {
                    shuffled.push('empty');
                    console.log("Added empty to prevent consecutive skewers of the same type");
                }
            }

            shuffled.push(add);
        } while (queuedSkewers.length>0); // Continue until all items are processed

        queuedSkewers = shuffled;
        while(queuedSkewers.length%3!==0){
            queuedSkewers.push('empty');
        }
        console.log("Final shuffled skewers: ", queuedSkewers);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                // Calculate the x position with offset for every 3 columns
                const xOffset = (Math.floor(col / columnGroupOffset) + 1) * offsetX;
                const x = col * cellWidth + xOffset;
                // const y = row * cellHeight;
                const y = row * cellHeight + (offsetY * (row + 1));

                // Add the coordinate to the array
                coordinates.push({ x: x, y: y, occupied: false, skewer: null });
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
        }

        const createSkewer = (coord) =>{
            const skewerKey = queuedSkewers.shift();
            if (skewerKey === 'empty'){
                return; // Skip creating a skewer for 'empty' entries
            }else{
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
            coord.skewer = skewer; // Store a reference to the skewer in the coordinate for easy access
            // console.log('SKEWER')
            // console.log('skewer index: ', skewer.index);
            }
        }
        // Create draggable objects
        coordinates.forEach(coord => {
            createSkewer(coord);
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
            let direction = null; // Variable to store the direction of the win condition check

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
                coordinates[skewer.index].skewer = null; // Clear skewer reference from previous coordinate
                coordinates[final].occupied = true; // Mark new coordinate as occupied
                coordinates[final].skewer = skewer; // Update the skewer reference in the new coordinate
                skewer.index = final; // Update skewer's index
                direction = checkWinCondition(coordinates, skewer, queuedSkewers);
                if(direction[0]!==0 && direction[1]!==0 && queuedSkewers.length>0){
                    console.log("Win condition met! Direction: ", direction);
                    createSkewer(coordinates[skewer.index]);
                    direction.forEach(move => {
                        console.log("Creating new skewer at index: ", skewer.index+move);
                        createSkewer(coordinates[skewer.index+move]);
                    });
                }
            } else {
                // Return skewer to original position if no valid snap found
                skewer.x = skewer.originalX;
                skewer.y = skewer.originalY;
            }
        });


    }

}
