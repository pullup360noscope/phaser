export function createSkewer(scene, x, y) {
    const skewer = scene.add.image(x, y, 'skewer');
    // const scale = scene.cameras.main.width / skewer.width;
    const scale = 0.5; // Adjust this value to scale the skewer as needed
    skewer.setScale(scale);
    skewer.setOrigin(0.5);
    skewer.setInteractive();
    
    scene.input.setDraggable(skewer);



    // skewer.on('pointerdown', () => {
    //     onSkewerClicked(skewer);
    // });
}

export function onSkewerClicked(skewer) {
    console.log('Skewer clicked:', skewer);
    skewer.setTint(0xff0000);
}