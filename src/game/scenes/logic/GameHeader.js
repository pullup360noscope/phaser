import {createGrillGroup, onGrillClicked } from './grill.js';

export function setupBackground(scene) {
    scene.cameras.main.setBackgroundColor(0x00ff00);

    scene.add.image(512, 512, 'background').setAlpha(0.5);

    scene.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);

    createGrillGroup(scene, onGrillClicked, 3, 4);
}

export function setupClickCounter(scene) {
    scene.clickCount = 0;

    scene.input.on('pointerdown', () => {
        scene.clickCount++;

        if (scene.clickCount === 1) {
            console.log("Second click detected! You could add different logic here.");
        } else if (scene.clickCount === 3) {
            scene.scene.start('GameOver');
            scene.clickCount = 0;
        }
    });
}

