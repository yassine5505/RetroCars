var game;
var car;
var line;
var timer;
var carPosition;
var carPositions;
var carCanMove;
var obstacleGroup;
var carGroup;
var carHorizontalSpeed = 400;
var obstacleSpeed = 800  ;
var carMoveDelay = obstacleSpeed / 5   ;
var lineSpeed = 300 ;
var obstacleDelay = 1000 ;
var difficulty = 1;
var score = document.getElementById("score");
score = 0;//UPDATE SCORE
var time;
var lastClick;
var verticalTween;
var carVerticalSpeed = 40000;
var carInvisibilityTime = 5000;
var particle, emitter;

window.onload = function() {
  //  Init game
  game = new Phaser.Game(320,600 , Phaser.AUTO, "");
     game.state.add("PlayGame",playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {
  /************/
  /*PRELOAD****/
  /************/
  preload: function(){
          game.load.image("background", "../assets/background.png");
          game.load.image("car", "../assets/lambo.png");//changer "lambo.png"
          game.load.image("obstacle", "../assets/police2.png");

  },
  /************/
  /*CREATE****/
  /************/
    create: function(){
          //ADD background
          scoreText = game.add.text(0, 0, 'score: 0', { fontFamily:'Bungee',fontSize: '32px', fill: '#000' });
          scoreText.addColor("#ff0000", 0);
          timeText = game.add.text(0,40,'time: 0', { fontSize: '28px', fill:'#000'});
          background = game.add.sprite(0,0,"background");
          time = 0;
          carCanMove = true;
          carPosition = 0;
          obstacleGroup = game.add.group();
          carPositions = [50, game.width - 50];
          game.physics.startSystem(Phaser.Physics.ARCADE);
          car = game.add.sprite(carPositions[carPosition]/*CAR POSITIONs array*/, game.height - 40, "car");
          car.anchor.set(0.5);
          game.physics.enable(car, Phaser.Physics.ARCADE);
          car.body.allowRotation = false;
          car.body.moves = false;

          game.time.events.loop(obstacleDelay, function(){
               var obstacle = new Obstacle(game);
               game.add.existing(obstacle);
               obstacleGroup.add(obstacle);
               console.log(obstacleGroup);
          });
          verticalTween = game.add.tween(car).to({
               y: 0
          }, carVerticalSpeed, Phaser.Easing.Linear.None, true);
  },
  /************/
  /*UPDATE****/
  /************/
     update: function(){
       //
       if(carCanMove){
        lastClick = game.time.now;
        carPosition = 1 - carPosition;
        carCanMove = false;
        //KEYBOARD CONDITIONS
        if(this.cursors.right.isDown && car.body.x<game.width){

          var moveTween = game.add.tween(car).to({
               x: carPositions[carPosition],
          }, carHorizontalSpeed, Phaser.Easing.Linear.None, true);
          moveTween.onComplete.add(function(){
               game.time.events.add(carMoveDelay, function(){
                    carCanMove = true;
               });

          }
          }
        }


   }
       else if(){

       }

        /*if(car.alpha == 1){
          var collided = game.physics.arcade.collide(car, obstacleGroup, function(){
          game.state.start("PlayGame");
          });
          if(collided==true){
              console.log("Collided, your score is " + score);
              game.add.text(game, window.windowWidth/2, window.windowHeight/2, collectScore() );//new Text(game, x, y, text, style)


              if(score>collectScore(game)){
                console.log("New High Score ! " + score);
              }
          }

          collectScore();
          }
        }*/
        //as long as car.alpha == 1, don't update scoreText//
        //reset carInvisibility to 0
        score = 0;
          if(car.alpha == 1){
            game.physics.arcade.collide(car, obstacleGroup, function(){game.state.start("PlayGame");});
            collectScore();
            collectTime();
            console.log('score = ' + collectScore());
          }
          else if(car.alpha != 1){
            score = 0;
          }
        }
      }

function moveCar(){

     if(carCanMove){
      lastClick = game.time.now;
      carPosition = 1 - carPosition;
      carCanMove = false;
      //KEYBOARD CONDITIONS
      if(this.cursors.right.isDown && car.body.x<game.width){

        var moveTween = game.add.tween(car).to({
             x: carPositions[carPosition],
        }, carHorizontalSpeed, Phaser.Easing.Linear.None, true);
        moveTween.onComplete.add(function(){
             game.time.events.add(carMoveDelay, function(){
                  carCanMove = true;
             });

        }
        }
      else if(this.cursors.left.isDown && car.body.x<game.width){


      }


 }
     else if(this.cursors.keyboard.space.isDown  && car.alpha == 1){
         car.alpha = 0.5;
         verticalTween.stop();
         verticalTween = game.add.tween(car).to({
           y: game.height -40},
           100,
           Phaser.Easing.Cubic.Out,
           true);
           verticalTween.onComplete.add(function(){
           verticalTween = game.add.tween(car).to({
           y : 0},
           carVerticalSpeed, Phaser.Easing.Linear.None , true);
           var alphaTween = game.add.tween(car).to({
           alpha:1},
           carInvisibilityTime, Phaser.Easing.Linear.None, true);
       })
     }

};
//DRAW OBSTACLE
Obstacle = function (game) {
  var position = game.rnd.between(20, game.width);
  Phaser.Sprite.call(this, game,position, 0, "obstacle");
  game.physics.enable(this, Phaser.Physics.ARCADE, this);
  this.anchor.set(0.5);
};
//SCORE FUNCTION
 collectScore = function (game){
  score += 0.3;
  var intScore = Math.floor(score);
  scoreText.text = 'Score: ' + intScore;
  scoreText.addColor("#ff0000", 0);

  return intScore;
};
  //time collection function
  collectTime = function(game){
    time += 1/30;
  //  window.windowStorage(intTime);
    var intTime = Math.floor(time);
    timeText.text = 'Time: ' + intTime;
    return intTime;
  }

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {
  this.body.velocity.y = obstacleSpeed;
  if(this.y > game.height){
    this.destroy();
  }
};
