(function () {
  'use strict';

  function Boot() {}

  Boot.prototype = {

    preload: function () {
      this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function () {
      this.game.input.maxPointers = 1;

      this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.maxWidth = Math.round(this.game.height * 3 / 4);
      this.game.scale.maxHeight = this.game.height;
      this.game.scale.minWidth =  260;
      this.game.scale.minHeight = 480;
      this.game.scale.forcePortrait = true;
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
      //this.game.scale.setScreenSize(true);
      this.game.scale.setShowAll();
      this.game.scale.refresh();
      this.game.state.start('preloader');
    }
  };

  window['pinwho'] = window['pinwho'] || {};
  window['pinwho'].Boot = Boot;

}());
