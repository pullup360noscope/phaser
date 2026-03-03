import { Scene } from 'phaser';
import { setupBackground, setupClickCounter} from './logic/GameHeader.js';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
        // Preload any necessary assets here
        this.load.image('grill', 'assets/grill.png'); // Load the grill image
        this.load.image('skewer', 'assets/skewer.png'); // Load the skewer image
    }

    create ()
    {
        // Setup visuals and background text
        setupBackground(this);

        this.input.on('drag', (_pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

        this.input.on('dragend', (pointer, gameObject) => {
        const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, targetObject.x, targetObject.y);
        
        if (distance < 50) { // Change 50 to your desired snapping distance
            gameObject.x = targetObject.x;
            gameObject.y = targetObject.y;
        }
    });

        // Setup input click counter and behavior
        setupClickCounter(this);
    }

}
