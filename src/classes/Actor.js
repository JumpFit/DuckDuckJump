import { Physics } from 'phaser';

export class Actor extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // this.body.setCollideWorldBounds(true);
    // this.body.setBounce(0.1);
    this.body.setGravityY(300);
  }
}
