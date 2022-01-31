# DuckDuckJump
Gamified fitness app 🦆 

[![Duck Duck Jump](https://user-images.githubusercontent.com/86633971/151855251-bdb47cb2-a8bb-4507-b0d1-c7f71ec6a771.png)](https://youtu.be/4FCnSLDTetI "Duck Duck Jump")

## Overview

Duck Duck Jump is a work out platformer / side scroller game you can control hands free that combines both fitness and your inner gamer. Duck Duck Jump uses a Tensorflow.js machine learning model that is capable of detecting human movement and was taught to recognize actions like squatting and jumping. Since we had the goal of adding motion detection to a video game, Phaser 3.js seemed like the best choice to bring it all together. Phaser 3 is a 2D game framework that allows us to create a game using Javascript and HTML5 inside a web browser. Our goal is give people a fun reason to get the body moving, without having to invest in a console which can cost a lot of money, with tools that they normally would have at home. 


Our latest version of the app is currently deployed on [Heroku](https://duckduckjump.herokuapp.com/)

## Features

### Gameplay
![gamescene](https://user-images.githubusercontent.com/86633971/151860883-02fe1b5e-fa90-415c-831f-1ac09e4a5ac7.png)

We envisioned a game that wouldn’t end until you lost, a platformer that your character would run through until they fell off. To make this happen there actually isn’t a pre-existing world that your character moves through but a randomly generated world that runs into your character, so you’re always making forward progress. 

Your objective is to stay alive for as long as you can, jumping from platform to platform while collecting those delicious grapes. When you jump, the duck jumps and when you squat, the duck squats. You can also squat right after you jump so that your duck can land faster. If you can't make it to the next ledge, game over!

### TensorFlow.js Model MoveNet
![jumping](https://user-images.githubusercontent.com/86633971/151860523-1daf3a59-f329-47ae-a21b-55ab010eda14.jpg)

![squating](https://user-images.githubusercontent.com/86633971/151860654-26781fc5-c73f-46e0-9077-599725a745f7.jpg)

MoveNet is a tensorflow model, which uses your webcam, that has already been trained to quickly and accurately detect 17 keypoints on a human body. For each keypoint, it provides an x and y coordinate as well as a score based on how confident it is in its detection. We chose this model for its incredibly fast detection speed, which is very important when someone is performing quick actions like jumping and squatting.

In order to determine if a player was jumping, we first measured the distance from their ankles to their knees.  Then we established a base position for their ankles, and for each frame, evaluated whether the distance from their ankles to their “base position” was at least 1/5 the distance of their ankles to their knees. 

In order to determine whether a user is squatting, we first measure the distance between their hip and knees to establish a base.  We do this for both the left and right sides of their body to make sure there’s no cheating.  If the distance between the player’s hip and knees decreases by at least ⅓, we consider that a squat.


## Future Plans
 * Multiplayer game mode
 * Game shop to unlock different characters
 * Different levels of difficulty 


## Technologies
 <img src="https://user-images.githubusercontent.com/86633971/151867110-7c824509-7de9-4adf-9ae5-f8e372279347.svg" alt="Phaser.js" width="21px" height="21px"> TensorFlow.js for pose detection <br />
 <img src="https://user-images.githubusercontent.com/86633971/151864782-7f579c79-7b42-4395-9dec-4d6444c62a4b.svg" alt="Phaser.js" width="21px" height="21px"> Phaser.js for game engine <br />
 <img src="https://github.com/get-icon/geticon/raw/master/icons/javascript.svg" alt="JavaScript" width="21px" height="21px"> Javascript <br />
 <img src="https://github.com/get-icon/geticon/raw/master/icons/nodejs-icon.svg" alt="Node.js" width="21px" height="21px"> Node.js <br />
 <img src="https://user-images.githubusercontent.com/86633971/151866942-14bad62b-add5-4031-aa08-f93ef8909c19.svg" alt="Express.js" width="21px" height="21px"> Express.js <br />
 <img src="https://user-images.githubusercontent.com/86633971/151866548-c820def1-1e53-4aad-8843-abbda32ec39b.png" alt="Sequelize" width="21px" height="21px"> Sequelize <br />
 <img src="https://user-images.githubusercontent.com/86633971/151866765-1c302b15-1c35-4d96-9be0-2aa7d618d1d6.png" alt="PostgreSQL" width="21px" height="21px"> PostgreSQL <br />
 <img src="https://img.icons8.com/color/48/000000/webpack.png" alt="Webpack" width="21px" height="21px"> Webpack <br />
 <img src="https://github.com/get-icon/geticon/raw/master/icons/babel.svg" alt="Babel" width="21px" height="21px"> Babel <br />
 <img src="https://user-images.githubusercontent.com/86633971/151865763-e06c47f1-8ff4-4452-86dd-fa28b1156df3.png" alt="Bootstrap" width="21px" height="21px"> Bootstrap

## Contributors
* Anthony Liang | :octocat: <a href="github.com/anthonyliang1117">GitHub</a> | :link: <a href="linkedin.com/in/dongli-liang">LinkedIn</a>
* Carlos Lerma | :octocat: <a href="github.com/cjl-628">GitHub</a> | :link: <a href="linkedin.com/in/cj-lerma">LinkedIn</a>
* Greg Solomon | :octocat: <a href="github.com/ghsolomon">GitHub</a> | :link: <a href="linkedin.com/in/ghsolomon">LinkedIn</a>
