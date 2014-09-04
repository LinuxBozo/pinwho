$(document).ready(function () {
  'use strict';

  var game
    , ns = window['pinwho'];

  var setup = function() {

      // get dimensions of the window considering retina displays
      var height = Math.max(window.innerHeight * window.devicePixelRatio, 1024);
      var width =  Math.round(height * 3 / 4); //Math.min(window.innerWidth * window.devicePixelRatio, 768);
      game = new Phaser.Game(width, height, Phaser.AUTO, 'pinwho-game');
      game.state.add('boot', ns.Boot);
      game.state.add('preloader', ns.Preloader);
      game.state.add('menu', ns.Menu);
      game.state.add('game', ns.Game);
      game.state.start('boot');
  };

  setup();


});
