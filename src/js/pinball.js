(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.PinballPhysics = (function(_super) {
    __extends(PinballPhysics, _super);

    function PinballPhysics(game) {
      PinballPhysics.__super__.constructor.call(this, game);
      this.physicsWorld = this.game.physics.p2.world;
      this.registerKeys();
      this.build();
      this.totalBalls = 5;
    }

    PinballPhysics.prototype.build = function() {
      this.currentBall = 0;
      this.groundBody = new p2.Body();
      this.physicsWorld.addBody(this.groundBody);
      this.endOfTable = this.createEndOfTable();
      this.table = this.createTable();
      this.flipperLeft = this.createFlipperLeft();
      this.flipperRight = this.createFlipperRight();
      this.ball = this.createBall();
      this.plunger = this.createPlunger();
    };

    PinballPhysics.prototype.registerKeys = function() {
      this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
      this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
      this.plungerKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      this.plungerKey.onUp.add(this.launchPlunger, this);
    };

    PinballPhysics.prototype.checkBallOutOfBounds = function(body, shapeA, shapeB, equation) {
      if (body.sprite.key === 'endOfTable') {
        this.ball.body.onBeginContact.remove(this.checkBallOutOfBounds, this);
        if (this.currentBall === this.totalBalls) {
          this.game.state.start('menu');
        } else {
          this.ball = this.createBall();
        }
      }
    };

    PinballPhysics.prototype.update = function() {
      if (this.leftKey.isDown) {
        this.flipperLeftRevolute.lowerLimit = 35 * Math.PI / 180;
        this.flipperLeftRevolute.upperLimit = 35 * Math.PI / 180;
      } else {
        this.flipperLeftRevolute.lowerLimit = 0 * Math.PI / 180;
        this.flipperLeftRevolute.upperLimit = 0 * Math.PI / 180;
      }
      if (this.rightKey.isDown) {
        this.flipperRightRevolute.lowerLimit = -35 * Math.PI / 180;
        this.flipperRightRevolute.upperLimit = -35 * Math.PI / 180;
      } else {
        this.flipperRightRevolute.lowerLimit = 0 * Math.PI / 180;
        this.flipperRightRevolute.upperLimit = 0 * Math.PI / 180;
      }
      if (this.plungerKey.isDown) {
          this.plunger.body.moveDown(100);
      }
    };

    PinballPhysics.prototype.launchPlunger = function() {
      var amount = Math.min(Math.abs((this.plunger.position.y - this.plungerAnchor.position.y) / 30), 1);
      this.plunger.body.thrust(150000*amount);
    };

    PinballPhysics.prototype.createFlipperRevolute = function(sprite, pivotA, pivotB, motorSpeed) {
      var revolute;
      revolute = new p2.RevoluteConstraint(sprite.body.data, pivotA, this.groundBody, pivotB);
      revolute.upperLimitEnabled = true;
      revolute.lowerLimitEnabled = true;
      revolute.enableMotor();
      revolute.setMotorSpeed(motorSpeed);
      this.physicsWorld.addConstraint(revolute);
      return revolute;
    };

    PinballPhysics.prototype.createPlunger = function() {
      var plungerAnchor = this.create(735, 750, null);
      plungerAnchor.key = 'plungerAnchor';
      this.game.physics.p2.enableBody(plungerAnchor, true);
      plungerAnchor.body.clearShapes();
      plungerAnchor.body.setRectangle(55, 10);
      plungerAnchor.body.static = true;
      plungerAnchor.body.data.shapes[0].sensor = true;
      plungerAnchor.body.clearCollision(true,true);
      this.plungerAnchor = plungerAnchor;

      var plunger = this.create(735, 860, null);
      plunger.key = 'plunger';
      this.game.physics.p2.enableBody(plunger, true);
      plunger.body.clearShapes();
      plunger.body.setRectangle(15, 55);
      plunger.body.force = 500000;
      plunger.body.gravity = 0;

      this.game.physics.p2.createSpring(plungerAnchor, plunger, 100, 50, 1);
      //ADD CONSTRAINT
      //PrismaticConstraint(world, bodyA, bodyB, lockRotation, anchorA, anchorB, axis, maxForce)
      constraint = this.game.physics.p2.createPrismaticConstraint(plungerAnchor,plunger,true,[0,0],[0,0],[0,1]);
      //SET LIIMITS
      constraint.lowerLimitEnabled=constraint.upperLimitEnabled = true;
      constraint.upperLimit = -5;
      constraint.lowerLimit = -10;
      return plunger;
    };

    PinballPhysics.prototype.createEndOfTable = function() {
      var endOfTable;
      endOfTable = this.create(this.game.world.width/2, this.game.world.height, null);
      endOfTable.key = 'endOfTable';
      this.game.physics.p2.enableBody(endOfTable, true);
      endOfTable.body.clearShapes();
      endOfTable.body.static = true;
      endOfTable.body.setRectangle(this.game.world.width, 50);
      endOfTable.body.data.shapes[0].sensor = true;
      return endOfTable;
    };

    PinballPhysics.prototype.createTable = function() {
      var table;
      table = this.create(this.game.world.width / 2, this.game.world.height / 2, 'table');
      this.game.physics.p2.enableBody(table);
      table.body.clearShapes();
      table.body.loadPolygon('pinball', 'table');
      table.body.static = true;
      return table;
    };

    PinballPhysics.prototype.createBall = function() {
      var ball;
      ball = this.create(735, 800, 'ball');
      this.game.physics.p2.enableBody(ball);
      ball.body.setCircle(20);
      ball.body.onBeginContact.add(this.checkBallOutOfBounds, this);
      this.currentBall += 1;
      return ball;
    };

    PinballPhysics.prototype.createFlipperLeft = function() {
      var flipper, pivotA, pivotB;
      flipper = this.create(0, 0, 'flipperLeft');
      this.game.physics.p2.enableBody(flipper);
      flipper.body.clearShapes();
      flipper.body.loadPolygon('pinball', 'flipper_left');
      pivotA = [this.game.physics.p2.pxm(flipper.width / 2 - 30), this.game.physics.p2.pxm(10)];
      pivotB = [this.game.physics.p2.pxmi(210), this.game.physics.p2.pxmi(920)];
      this.flipperLeftRevolute = this.createFlipperRevolute(flipper, pivotA, pivotB, -20);
      return flipper;
    };

    PinballPhysics.prototype.createFlipperRight = function() {
      var flipper, pivotA, pivotB;
      flipper = this.create(0, 0, 'flipperRight');
      this.game.physics.p2.enableBody(flipper);
      flipper.body.clearShapes();
      flipper.body.loadPolygon('pinball', 'flipper_right');
      pivotA = [-this.game.physics.p2.pxm(flipper.width / 2 - 30), this.game.physics.p2.pxm(10)];
      pivotB = [this.game.physics.p2.pxmi(500), this.game.physics.p2.pxmi(920)];
      this.flipperRightRevolute = this.createFlipperRevolute(flipper, pivotA, pivotB, 20);
      return flipper;
    };

    return PinballPhysics;

  })(Phaser.Group);

}).call(this);
