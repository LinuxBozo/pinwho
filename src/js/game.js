(function() {
  'use strict';

  function Game() {
    this.pinball = null;
  }

  Game.prototype = {

    preload: function() {
      this.load.physics('pinball', 'assets/pinball.json', null, Phaser.Physics.LIME_CORONA_JSON);
    },

    create: function () {
      this.physics.startSystem(Phaser.Physics.P2JS);
      this.physics.p2.gravity.y = 1000;
      this.physics.p2.friction = 0.5;

      this.pinball = new PinballPhysics(this.game);

      this.input.onDown.add(this.onInputDown, this);
    },

    onInputDown: function () {
      //this.game.state.start('menu');
      this.pinball.createBall();
    }

  };

  window['pinwho'] = window['pinwho'] || {};
  window['pinwho'].Game = Game;

}());
