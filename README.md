# DuckDuckJump
Gamified fitness app

## MVP
### Work out Platformer / Side Scroller Game with Machine Learning 
  * Uses webcam to track human movement
  * Making Super Mario like game (collecting coins, breaking stuff, avoiding obstacles and enemies)
  * Game will keep scrolling and the character will need to avoid obstacles and enemies by:
    * **Jumping**: human will do a movement (either jumping based on the change of positioning or a jumping jack) and the machine will be able to detect the movement and processes it as a movement to signal a jump over obstacle
    * **Ducking**: human will do a movement (squat) and machine will be able to detect the squat and processes it as a duck under obstacle

### Extended Features (stretch goals)
  * Create user login experience to keep track of your info (weight, height) and how many calories are burned each came
  * Log of game play, scores, and calories burned to see how you're progressing over time
  * Log of high scores (leaderboard) between other people to see how you compare to others
  * Multiplayer functionality: ability for 2 people to compete against each other in a single game
  * Some sort of advanced "power up move" (i.e. burpee) for additional points

## Technologies
  * TensorFlow.js for pose detection
  * Phaser.js for game engine
