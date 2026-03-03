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
        // Setup input click counter and behavior
        setupClickCounter(this);
    }

}
