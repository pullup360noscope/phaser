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
            grill.setCollideWorldBounds(true);

            grill.on('pointerdown', () => {
                onGrillClickedHandler(grill);
            });
        }
    }

    return group;
}