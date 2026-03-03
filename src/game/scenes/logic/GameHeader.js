export function setupBackground(scene) {
    scene.cameras.main.setBackgroundColor(0x00ff00);

    scene.add.image(512, 512, 'background').setAlpha(0.5);

    scene.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);
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

export function onGrillClicked(grill) {
    console.log('Grill clicked:', grill);
    grill.setTint(0xff0000);
}

export function createGrillGroup(scene, onGrillClickedHandler, cols = 3, rows = 4) {
    const group = scene.add.group();

    const grillWidth = scene.cameras.main.width / cols;
    const grillHeight = scene.cameras.main.height / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const grill = group.create(
                c * grillWidth,
                r * grillHeight,
                'grill'
            );
            grill.setOrigin(0);
            grill.setInteractive();

            grill.on('pointerdown', () => {
                onGrillClickedHandler(grill);
            });
        }
    }

    return group;
}
