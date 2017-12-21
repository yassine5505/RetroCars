var game; //game
var car; //car variable
var timer;//timer for in race feature
var carPosition; //carPos updated
var carPositions; //array
var carCanMove; //if can can move or not, used in moveCar()
var obstacleGroup; //obstacles (police)
var carHorizontalSpeed = 450;
var obstacleSpeed = 500 ;
var carMoveDelay = 200   ;
var lineSpeed = 300 ;
var obstacleDelay = 3000 ;//time between cars appearing
var difficulty = 1;
var score ;
score = 1;
var time;
var lastClick;
var verticalTween;
var carVerticalSpeed = 30000;
var lastClick;
var carInvisibilityTime = 5000;
var particle, emitter;

window.onload = function() {
//  Init game
game = new Phaser.Game(320,560 , Phaser.AUTO, "");
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
        game.load.image("car", "../assets/yellow.png");//changer "lambo.png"
        game.load.image("obstacle", "../assets/police2.png");
},
/************/
/*CREATE****/
/************/
  create: function(){
        //ADD background
        background = game.add.sprite(0,0,"background");
        scoreText = game.add.text(0, 0, 'Score: ', { fontFamily:'Bungee',fontSize: '16px', fill: '#000' });
        scoreText.font = 'Bungee';
        time = 0;
        timeText = game.add.text(0,40,'time: 0', { fontSize: '16px', fill:'#000'});
        timeText.font = 'Bungee';
        //ADD CURSOR KEYS
        this.cursors = this.input.keyboard.createCursorKeys();
        carCanMove = true;
        carPosition = 0;
        obstacleGroup = game.add.group();
        carPositions = [35, game.width - 35];
        game.physics.startSystem(Phaser.Physics.ARCADE);
        car = game.add.sprite(carPositions[carPosition]/*CAR POSITIONs*/, game.height - 40, "car");
        car.anchor.set(0.5);
        game.physics.enable(car, Phaser.Physics.ARCADE);
        car.body.allowRotation = false;
        car.body.moves = true;
        this.cursors.right.onDown.add(moveCar);//change movecar
        this.cursors.left.onDown.add(moveCar);//change movecar
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
     collectTime();
     //new keyboard code
     if(this.cursors.right.isDown   && car.body.x<game.width){
       var moveTween = game.add.tween(car).to({
            x: carPositions[carPosition] + 10,
       }, carHorizontalSpeed, Phaser.Easing.Linear.None, true);
       moveTween.onComplete.add(function(){
            game.time.events.add(carMoveDelay, function(){
                 carCanMove = true;
            });
       });
       }
     else if(this.cursors.left.isDown && car.body.x<game.width){
       var moveTween = game.add.tween(car).to({
            x: carPositions[carPosition] - 10,
       }, carHorizontalSpeed, Phaser.Easing.Linear.None, true);
       moveTween.onComplete.add(function(){
            game.time.events.add(carMoveDelay, function(){
                 carCanMove = true;
            });
       });
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
        if(car.alpha == 1){
          if(game.physics.arcade.collide(car, obstacleGroup, function(){game.state.start("PlayGame") })){
            score = 0;
            window.location.replace("gameOver.html");
            collectScore();
          }

          collectTime();
          console.log('score = ' + collectScore());
        }
        else if(car.alpha == 0.5){
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
          if(cursors.right.isDown  && carPosition == game.width){
            this.car.body.velocity.x = 200;
            if(cursors.right.isDown){
              var moveTween = game.add.tween(car).to({
                   x: game.width,
              }, carHorizontalSpeed, Phaser.Easing.Linear.None, true);
              moveTween.onComplete.add(function(){
                   game.time.events.add(carMoveDelay, function(){
                        carCanMove = true;
                   });
              });
            }
            }
          else if(cursors.left.isDown && car.body.x<game.width){

          }
     }
         else if(this.cursors.space.isDown  && car.alpha == 1){
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
         if(this.car.position.y <= 0){
           window.location.replace("cars.html");
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
  //Store score in local storage FUNCTION
  localSt = function(game){
    var score = window.localStorage.getItem('score');
    if(score  === null){
      window.localStorage.setItem('score', 0);
    }

    window.localStorage.setItem('score', intScore);
    console.log("added score to storage");
  }
  localSt();
  return intScore;
};

//time collection function
collectTime = function(game){
  time += 1/100;
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
