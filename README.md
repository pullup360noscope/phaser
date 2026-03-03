Match & Grill mechanic. Here's a step-by-step guide:

1. **Setting up the Project**
   - Install Phaser using npm or yarn: `npm install phaser` or `yarn add phaser`
   - Create a new HTML file and include the Phaser library in the `<head>` section of your HTML file: `<script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>`
   - Create a new JavaScript file and link it to your HTML file using the `<script>` tag.

2. **Creating the Game Scene**
   - In your JavaScript file, create a new class that extends the Phaser.Scene class.
   - Inside the class, define the `preload` method to load the game assets (images, sounds, etc.).
   - Define the `create` method to create the game objects and set up the game mechanics.
   - Define the `update` method to handle game logic and update the game state.

3. **Setting up the Grid**
   - Create a 3x3 grid of grills using Phaser's `Group` class.
   - Position the grills in a grid pattern using Phaser's `grid` layout.
   - Add event listeners to each grill to detect when they are clicked.

4. **Clearing Grills**
   - When a grill is clicked, check if it is part of a row, column, or diagonal with two other identical grills.
   - If so, clear the three grills by removing them from the scene.
   - Add new skewers to the grid to replace the cleared grills.

5. **Scoring**
   - Keep track of the player's score by incrementing a counter each time a grill is cleared.
   - Display the score on the screen using Phaser's text rendering.