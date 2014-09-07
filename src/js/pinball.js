(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.PinballPhysics = (function(_super) {
    __extends(PinballPhysics, _super);

    function PinballPhysics(game) {
      PinballPhysics.__super__.constructor.call(this, game);
      this.physicsWorld = this.game.physics.p2.world;
      this.registerKeys();
      this.linkMaterials();
      this.build();
    }

    PinballPhysics.prototype.build = function() {
      this.totalBalls = 5;
      //this.bodyDebug = true;
      this.currentBall = 0;
      this.groundBody = new p2.Body();
      this.physicsWorld.addBody(this.groundBody);
      this.endOfTable = this.createEndOfTable();
      this.table = this.createTable();
      this.flipperLeft = this.createFlipperLeft();
      this.flipperRight = this.createFlipperRight();
      this.ball = this.createBall();
      this.plunger = this.createPlunger();
      this.bumper1 = this.createBumper(350,240);
      this.bumper2 = this.createBumper(270,350);
      this.bumper3 = this.createBumper(430,350);
    };

    PinballPhysics.prototype.linkMaterials = function () {
      this.ballMaterial = this.game.physics.p2.createMaterial('ballMaterial');
      this.bumperMaterial = this.game.physics.p2.createMaterial('bumperMaterial');
      this.flipperMaterial = this.game.physics.p2.createMaterial('flipperMaterial');
      this.slingMaterial = this.game.physics.p2.createMaterial('slingMaterial');
      this.tableMaterial = this.game.physics.p2.createMaterial('tableMaterial');

      this.generateContactMaterial(this.ballMaterial, this.flipperMaterial, 0); // BALL_FLIPPER
      this.generateContactMaterial(this.ballMaterial, this.slingMaterial, 1); // BALL_SLINGSHOT
      this.generateContactMaterial(this.ballMaterial, this.bumperMaterial, 2); // BALL_BUMPER
      this.generateContactMaterial(this.ballMaterial, this.tableMaterial, 3); // BALL_TABLE
    }

    PinballPhysics.prototype.registerKeys = function() {
      this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
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
          this.plunger.body.moveDown(120);
      }
    };


    PinballPhysics.prototype.generateContactMaterial = function (mat1, mat2, type) {
      var contactMaterial = this.game.physics.p2.createContactMaterial(mat1, mat2);
      switch (type) {
        case 0 /* BALL_FLIPPER */:
          contactMaterial.restitution = .6;
          break;
        case 1 /* BALL_SLINGSHOT */:
          contactMaterial.restitution = 1.2;
          break;
        case 2 /* BALL_BUMPER */:
          contactMaterial.restitution = 1.4;
          break;
        case 3 /* BALL_TABLE */:
          contactMaterial.restitution = .5;
      }
      return contactMaterial;
    };

    PinballPhysics.prototype.launchPlunger = function() {
      var amount = Math.min(Math.abs((this.plunger.position.y - this.plungerAnchor.position.y) / 30), 1);
      this.plunger.body.thrust(160000*amount);
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

    PinballPhysics.prototype.createBumper = function(x, y) {
      var bumper = this.create(x, y, 'bumper');
      this.game.physics.p2.enableBody(bumper, this.bodyDebug);
      bumper.body.clearShapes();
      bumper.body.setCircle(40);
      bumper.body.static = true;
      bumper.body.setMaterial(this.bumperMaterial);
      return bumper;
    }

    PinballPhysics.prototype.createPlunger = function() {
      var plungerAnchor = this.create(735, 810, null);
      plungerAnchor.key = 'plungerAnchor';
      this.game.physics.p2.enableBody(plungerAnchor, this.bodyDebug);
      plungerAnchor.body.clearShapes();
      plungerAnchor.body.setRectangle(55, 10);
      plungerAnchor.body.static = true;
      plungerAnchor.body.data.shapes[0].sensor = true;
      plungerAnchor.body.clearCollision(true,true);
      this.plungerAnchor = plungerAnchor;

      var plunger = this.create(735, 860, 'plunger');
      plunger.key = 'plunger';
      this.game.physics.p2.enableBody(plunger, this.bodyDebug);
      //plunger.body.clearShapes();
      //plunger.body.setRectangle(15, 55);
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
      this.game.physics.p2.enableBody(endOfTable, this.bodyDebug);
      endOfTable.body.clearShapes();
      endOfTable.body.static = true;
      endOfTable.body.setRectangle(this.game.world.width, 10);
      endOfTable.body.data.shapes[0].sensor = true;
      return endOfTable;
    };

    PinballPhysics.prototype.createTable = function() {
      var table;
      table = this.create(this.game.world.width / 2, this.game.world.height / 2, 'table');
      this.game.physics.p2.enableBody(table, this.bodyDebug);
      table.body.clearShapes();
      table.body.loadPolygon('pinball', 'table');
      table.body.static = true;
      return table;
    };

    PinballPhysics.prototype.createBall = function() {
      var ball;
      ball = this.create(735, 800, 'ball');
      this.game.physics.p2.enableBody(ball, this.bodyDebug);
      ball.body.clearShapes();
      ball.body.setCircle(20);
      ball.body.onBeginContact.add(this.checkBallOutOfBounds, this);
      ball.body.setMaterial(this.ballMaterial);
      this.currentBall += 1;
      return ball;
    };

    PinballPhysics.prototype.createFlipperLeft = function() {
      var flipper, pivotA, pivotB;
      flipper = this.create(0, 0, 'flipperLeft');
      this.game.physics.p2.enableBody(flipper, this.bodyDebug);
      flipper.body.clearShapes();
      flipper.body.loadPolygon('pinball', 'flipper_left');
      flipper.body.setMaterial(this.flipperMaterial);
      pivotA = [this.game.physics.p2.pxm(flipper.width / 2 - 30), this.game.physics.p2.pxm(10)];
      pivotB = [this.game.physics.p2.pxmi(210), this.game.physics.p2.pxmi(920)];
      this.flipperLeftRevolute = this.createFlipperRevolute(flipper, pivotA, pivotB, -20);
      return flipper;
    };

    PinballPhysics.prototype.createFlipperRight = function() {
      var flipper, pivotA, pivotB;
      flipper = this.create(0, 0, 'flipperRight');
      this.game.physics.p2.enableBody(flipper, this.bodyDebug);
      flipper.body.clearShapes();
      flipper.body.loadPolygon('pinball', 'flipper_right');
      flipper.body.setMaterial(this.flipperMaterial);
      pivotA = [-this.game.physics.p2.pxm(flipper.width / 2 - 30), this.game.physics.p2.pxm(10)];
      pivotB = [this.game.physics.p2.pxmi(500), this.game.physics.p2.pxmi(920)];
      this.flipperRightRevolute = this.createFlipperRevolute(flipper, pivotA, pivotB, 20);
      return flipper;
    };

    return PinballPhysics;

  })(Phaser.Group);

}).call(this);
