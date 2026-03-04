import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game2';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Winner } from './scenes/Winner';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    // width: 1024,
    // width: 1024,
    // height: 768,
    // height: 1024,

    width: window.innerWidth,  // Use full viewport width
    height: 1.5 * window.innerWidth,  // Maintain a 2:3 aspect ratio based on width
    parent: 'game-container',
    backgroundColor: '#d0a364',
    // backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Winner
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
