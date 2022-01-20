import { Actor } from './Actor';

export class Player extends Actor {
  constructor(scene, x, y) {
    super(scene, x, y, 'duck');

    // KEYS
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // PHYSICS
    // For the future, use these to make adjustmeents as needed:
    // this.body.setSize(30, 30);
    // this.body.setOffset(8, 0);

    // ANIMATION
    this.initAnimations();
  }

  initAnimations() {
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNames('duck', {
        prefix: 'idle-',
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNames('duck', {
        prefix: 'walk-',
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames('duck', {
        prefix: 'run-',
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'jump',
      frames: this.scene.anims.generateFrameNames('duck', {
        prefix: 'jump-',
        end: 0,
      }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: 'duck',
      frames: this.scene.anims.generateFrameNames('duck', {
        prefix: 'duck-',
        end: 0,
      }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: 'dead',
      frames: this.scene.anims.generateFrameNames('duck', {
        prefix: 'dead-',
        end: 0,
      }),
      frameRate: 8,
    });

    this.anims.play('idle', true);
  }

  update() {
    //this.scene.cameras.main.setPosition(-this.x + this.width, 0);
    this.body.setVelocityX(100);
    const landed = this.body.touching.down || this.body.onFloor();

    this.on('jump', () => {
      if (landed) {
        this.anims.play('jump', true);
        this.body.setVelocityY(-330);
      }
    });

    this.on('duck', () => {
      this.anims.play('duck', true);
    });

    this.on('neutral', () => {
      if (landed) {
        this.anims.play('walk', true);
      } else {
        this.anims.play('jump', true);
      }
    });
  }
}
