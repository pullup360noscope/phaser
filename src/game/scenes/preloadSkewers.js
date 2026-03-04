// AssetLoader.js

export function preloadSkewers(scene) {

    const numberOfSkewers = 4;
    for (let i = 0; i < numberOfSkewers; i++) {
        const skewerKey = `skewer${i}`;
        const skewerPath = `assets/skewer${i}.png`;
        scene.load.image(skewerKey, skewerPath);
        // console.log(`Loading ${skewerKey} from ${skewerPath}`);
    }
}
