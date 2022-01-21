import { Actor } from './Actor';

export class Player extends Actor {
  constructor(scene, x, y) {
    super(scene, x, y, 'duck');

    // KEYS
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // PHYSICS
    this.body.setSize(30, 30);
    //this.body.setOffset(40, 70);

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

    this.anims.play('walk');
  }

  update() {
    if (this.body.blocked.down) {
      this.anims.play('run', true);
    }

    //this.body.setVelocityX(100);

    if (this.body.blocked.right || this.body.onWorldBounds) {
      console.log('YOURE DEAD!');
    }
    if (this.cursors.up.isDown) {
      this.emit('jump');
    }
    if (this.cursors.down.isDown) {
      this.emit('duck');
    }
    this.cursors.down.on('up', () => {
      this.emit('neutral');
    });

    this.on('jump', () => {
      if (this.body.blocked.down) {
        this.anims.play('jump', true);
        this.body.setVelocityY(-330);
      }
    });

    this.on('duck', () => {
      this.anims.play('duck', true);
    });

    this.on('neutral', () => {
      if (!this.body.blocked.down) {
        this.anims.play('jump', true);
      }
    });
  }
}
