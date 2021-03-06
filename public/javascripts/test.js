console.log('test');

var game = new Phaser.Game(800,600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;

function preload(){
  game.load.image('sky', '/images/sky.png');
  game.load.image('ground', '/images/platform.png');
  game.load.image('star', '/images/star.png');
  game.load.spritesheet('dude', 'images/dude.png', 32, 48);
}


function create(){

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0,0, 'sky');


  platforms = game.add.group();

  platforms.enableBody =  true;
  var ground = platforms.create(0, game.world.height -64, 'ground');

  ground.scale.setTo(2,2);
  ground.body.immovable = true;


  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150,250, 'ground');
  ledge.body.immovable = true;

  player = game.add.sprite(32, game.world.height - 150, 'dude');

  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;


  player.animations.add('left', [0,1,2,3], 10, true);
  player.animations.add('right', [5,6,7,8], 10, true);

  stars = game.add.group();

  //  We will enable physics for any star that is created in this group
  stars.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++)
  {
      //  Create a star inside of the 'stars' group
      var star = stars.create(i * 70, 0, 'star');

      //  Let gravity do its thing
      star.body.gravity.y = 300;

      //  This just gives each star a slightly random bounce value
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  cursors = game.input.keyboard.createCursorKeys();
}

function update(){
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);

  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
    game.add.sprite(0,0, 'star');

}