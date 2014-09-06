(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      this.load.image('table', 'assets/table.png');
      this.load.image('ball', 'assets/ball.png');
      this.load.image('flipperLeft', 'assets/flipper_left.png');
      this.load.image('flipperRight', 'assets/flipper_right.png');
      this.load.image('bumper', 'assets/bumper.png');
      this.load.image('plunger', 'assets/plunger.png');
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['pinwho'] = window['pinwho'] || {};
  window['pinwho'].Preloader = Preloader;

}());
