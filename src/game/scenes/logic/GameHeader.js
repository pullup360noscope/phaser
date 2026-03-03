import { createGrillGroup, onGrillClicked } from './grill.js';
import { createSkewer } from './skewer.js';

export function setupBackground(scene) {
    scene.cameras.main.setBackgroundColor(0x00ff00);


    const bg = scene.add.image(scene.cameras.main.centerX, scene.cameras.main.centerY, 'background').setAlpha(0.5);
    bg.setDisplaySize(scene.cameras.main.width, scene.cameras.main.height);

    // createGrillGroup(scene, onGrillClicked, 3, 4);
    createSkewer(scene, 512, 384);
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

