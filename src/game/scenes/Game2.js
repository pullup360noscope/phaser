import { Scene } from 'phaser';
import { preloadSkewers } from './preloadSkewers.js';
import { checkWinCondition } from './logic/winCondition.js';


export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('grill', 'assets/grill.png');
        preloadSkewers(this, 4);
    }

    create() {
        let queuedSkewers = [];
        const coordinates = [];

        const columns = 9;
        const rows = 5;
        const columnGroupOffset = 3;
        const TARGET_SIZE = 0.8 * this.game.config.width / (columns / 3);

        const cellWidth = this.game.config.width / (4 * columns / 3);
        const cellHeight = this.game.config.height / (1.5 * rows);
        const offsetX = cellWidth;
        const offsetY = cellHeight / 2;
        const SNAPPING_DISTANCE = cellWidth;

        const groups = 2;
        const empty_percent = 0.3;
        let timer;
        let timerEvent;
        let timeLeft = 60; // example: 60 seconds



        let type = 'empty';
        for (let i = 0; i < groups; i++) {
            type = `skewer${Math.floor(Math.random() * 4)}`;
            queuedSkewers.push(type, type, type);
        }
        let progress = queuedSkewers.length;

        let shuffled = [];
        let add = null;
        let randomNum;
        do {
            randomNum = Math.random();
            if (randomNum < empty_percent) {
                shuffled.push('empty');
            }
            add = queuedSkewers.splice(Math.floor(Math.random() * queuedSkewers.length), 1)[0];
            if (shuffled.length >= 2) {
                if (shuffled[shuffled.length - 1] === shuffled[shuffled.length - 2] && shuffled[shuffled.length - 1] === add) {
                    shuffled.push('empty');
                    console.log("Added empty to prevent consecutive skewers of the same type\nloop: " + queuedSkewers.length);
                }
            }
            shuffled.push(add);
        } while (queuedSkewers.length > 0);

        queuedSkewers = shuffled;
        while (queuedSkewers.length % 3 !== 0) {
            queuedSkewers.push('empty');
        }
        // console.log("Final shuffled skewers: ", queuedSkewers);

        for (let row = 1; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const xOffset = (Math.floor(col / columnGroupOffset) + 1) * offsetX;
                const x = col * cellWidth + xOffset;
                const y = row * cellHeight + (offsetY * (row + 1));
                coordinates.push({ x: x, y: y, occupied: false, skewer: null });
                // console.log('for loop: ', 'row: ', row, 'col: ', col, 'x: ', x, 'y: ', y);
            }
        }

        // console.log("Generated Coordinate[2]: ", coordinates[2].x, coordinates[2].y);
        // console.log(coordinates);
        for (let i = 1; i < coordinates.length; i += 3) {
            const coord = coordinates[i];
            const target = this.physics.add.sprite(coord.x, coord.y + (0.4 * offsetY), 'grill');
            target.setDisplaySize(TARGET_SIZE, TARGET_SIZE);
        }

        timer = this.add.text(this.game.config.width/2, cellHeight/2, `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`, {
            fontSize: `${cellWidth/2}px`,
            fill: '#00ff00',
            fontFamily: '"Luckiest Guy", cursive', // Use the selected font here
            backgroundColor: '#00000000' // transparent background
        });

        // Create a timed event that calls the updateTimer function every second
        timerEvent = this.time.addEvent({
            delay: 1000, // 1000 ms = 1 second
            callback: updateTimer,
            callbackScope: this,
            loop: true
        });

function updateTimer() {
    timeLeft--;

    // Format timer to ensure two-digit display
    const seconds = timeLeft >= 0 ? timeLeft : 0;
    const timeText = `00:${seconds < 10 ? '0' + seconds : seconds}`;

    // Update the text display
    timer.setText(timeText);

    // Check if the time has run out
    if (timeLeft <= 0) {
        timerEvent.remove(); // Stop the timer
        this.scene.pause(); // Optional: pause the game
        console.log("Time's up!");
    }
}


        this.add.rectangle(this.game.config.width / 2, cellHeight, this.game.config.width +50, cellWidth / 2).setStrokeStyle(cellWidth / 10, 0xb48a4f);

        const createSkewer = (coord) => {
            let skewerKey;
            if (queuedSkewers.length > 0) {
                skewerKey = queuedSkewers.shift();
            } else {
                return;
            }
            console.log(skewerKey)
            if (skewerKey === 'empty') {
                return;
            } else {
                // console.log(queuedSkewers);
                const skewer = this.physics.add.sprite(coord.x, coord.y, skewerKey);
                skewer.setInteractive();
                const spriteWidth = skewer.width;
                const aspectRatio = skewer.height / spriteWidth;
                skewer.setDisplaySize(cellWidth, cellWidth * aspectRatio);
                skewer.index = coordinates.indexOf(coord);
                this.input.setDraggable(skewer);
                coord.occupied = true;
                coord.skewer = skewer;
                // console.log('SKEWER')
                // console.log('skewer index: ', skewer.index);
            }
        }

        coordinates.forEach(coord => {
            createSkewer(coord);
        });

        this.input.on('drag', (pointer, skewer, dragX, dragY) => {
            skewer.x = dragX;
            skewer.y = dragY;
        });

        this.input.on('dragstart', (pointer, skewer) => {
            skewer.originalX = skewer.x;
            skewer.originalY = skewer.y;
        });

        this.input.on('dragend', (pointer, skewer) => {
            console.log(skewer.texture.key);
            let snapped = false;
            let final = null;
            let direction = null;

            const targetCoord = coordinates.find((target, index) => {
                if (index === skewer.index) {
                    return false;
                }
                const distance = Phaser.Math.Distance.Between(skewer.x, skewer.y, target.x, target.y);
                if (distance < SNAPPING_DISTANCE) {
                    if (target.occupied) {
                        console.log("Target " + index + " already occupied!Continue to check if overlapping with empty target.");
                        return false;
                    }
                    console.log("Snapped to target " + index);
                    snapped = true;
                    final = index;
                    return true;
                }
                // console.log("failed to snap to target " + index);
                return false;
            });
            if (snapped) {
                skewer.x = targetCoord.x;
                skewer.y = targetCoord.y;
                coordinates[skewer.index].occupied = false;
                coordinates[skewer.index].skewer = null;
                coordinates[final].occupied = true;
                coordinates[final].skewer = skewer;
                skewer.index = final;
                // pass the scene reference so the win-condition logic can animate removals
                direction = checkWinCondition(this, coordinates, skewer);
                if (direction[0] !== 0 && direction[1] !== 0) {
                    progress = progress - 3;
                    console.log('remaining: ', progress);
                    if (queuedSkewers.length > 0) {
                        console.log("Win condition met! Direction: ", direction);
                        createSkewer(coordinates[skewer.index]);
                        direction.forEach(move => {
                            console.log("Creating new skewer at index: ", skewer.index + move);
                            createSkewer(coordinates[skewer.index + move]);
                        });
                    } else {
                        if (progress === 0) {
                            this.time.delayedCall(600, () => {
                                this.scene.start('Winner');
                            });
                        }
                    }

                }
            } else {
                skewer.x = skewer.originalX;
                skewer.y = skewer.originalY;
            }
        });

    }//create()
}//class game
