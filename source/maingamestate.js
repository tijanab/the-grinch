var mainGameState = { 
}

mainGameState.preload = function() {
    console.log("Pre-loading the Game");
    game.load.image("space", "images/space.jpeg");
    game.load.image("player-ship",
                    "SpaceShooterRedux/PNG/playerShip2_red.png");
    game.load.image("asteroid-large-01", "SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png");
    game.load.image("asteroid-medium-01", "SpaceShooterRedux/PNG/Meteors/meteorBrown_med1.png");
    game.load.image("asteroid-small-01", "SpaceShooterRedux/PNG/Meteors/meteorBrown_small1.png");
    game.load.image("laser", "SpaceShooterRedux/PNG/Lasers/laserRed16.png");
    
    game.load.audio("player_fire_01", "assets/audio/player_fire_01.mp3");
    game.load.audio("asteroid_hit_01", "assets/audio/asteroid_hit_01.mp3");
    game.load.audio("asteroid_death_01", "assets/audio/asteroid_death_01.mp3");
}

mainGameState.create = function() { 
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'space');

    var shipX = game.width * 0.5;
    var shipY = game.height * 0.9;
    this.playerShip = game.add.sprite(shipX, shipY, 'player-ship');
    this.playerShip.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.playerShip);
    this.cursors = game.input.keyboard.createCursorKeys();

    this.asteroidTimer = game.rnd.integerInRange(1.0, 3.0);
    this.asteroids = game.add.group();

    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.playerLaser = game.add.group();   
    this.fireTimer = 0.4;
    
    this.playerFireSfx = [];
    this.playerFireSfx.push(game.add.audio("asteroid_hit_01"));
    this.playerFireSfx.push(game.add.audio("asteroid_death_01"));
    this.playerFireSfx.push(game.add.audio("player_fire_01"));
}

mainGameState.update = function() {
    this.updatePlayer();

    this.asteroidTimer -= game.time.physicsElapsed;
    if(this.asteroidTimer <= 0.0){
        this.spawnAsteroid();
        this.asteroidTimer = game.rnd.integerInRange(1.0, 3.0);;
    }

    for(var i = 0; i < this.asteroids.children.length; i++){
        if(this.asteroids.children[i].y > (game.height + 200)){
            this.asteroids.children[i].destroy();
        }
    }

    if (this.fireKey.isDown) {
        this.spawnLaser();
    }

    this.fireTimer -= game.time.physicsElapsed;

    for(var i = 0; i< this.playerLaser.children.length; i++){
        if(this.playerLaser.children[i].y < -200){
            this.playerLaser.children[i].destroy();
        }
    }
    
    game.physics.arcade.collide(this.asteroids, this.playerLaser, mainGameState.onAsteroidLaserCollision, null, this);
}

mainGameState.updatePlayer = function(){
    //move the ship with arrows
    if (this.cursors.right.isDown) {
        this.playerShip.body.velocity.x = 300;
    }
    else if (this.cursors.left.isDown){
        this.playerShip.body.velocity.x = -300;
    }
    /*else if (this.cursors.down.isDown){
        this.playerShip.body.velocity.y = 300;
    }*/
    /*else if (this.cursors.up.isDown){
        this.playerShip.body.velocity.y = -300;
    }*/ else{
        this.playerShip.body.velocity.x = 0;
        this.playerShip.body.velocity.y = 0;
    }
    //wall boundaries
    if ((this.playerShip.x > game.width) && (this.playerShip.body.velocity.x > 0)){
        this.playerShip.body.velocity.x = 0;
    }
    if ((this.playerShip.x < 0) && (this.playerShip.body.velocity.x < 0)){
        this.playerShip.body.velocity.x = 0;
    }
    /*if ((this.playerShip.y > game.height) && (this.playerShip.body.velocity.y > 0)){
        this.playerShip.body.velocity.y = 0;
    }
    if ((this.playerShip.y < 0) && (this.playerShip.body.velocity.y < 0)){
        this.playerShip.body.velocity.y = 0;
    }*/
}

mainGameState.spawnAsteroid = function(){
    var arrAsteroid = [
        "asteroid-large-01", "asteroid-medium-01", "asteroid-medium-01"
    ];

    var x = game.rnd.integerInRange(0, game.width);
    var asteroid = game.add.sprite(x, 0, arrAsteroid[game.rnd.integerInRange(0,2)]);
    asteroid.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(asteroid);
    var y = game.rnd.integerInRange(200, 20);
    asteroid.body.velocity.setTo(0, y);
    asteroid.body.angularVelocity = game.rnd.integerInRange(50,300);
    this.asteroids.add(asteroid);
}

mainGameState.spawnLaser = function(){
    if(this.fireTimer < 0){
        this.fireTimer = 0.4;

        var laser = game.add.sprite(this.playerShip.x, this.playerShip.y, "laser");
        laser.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable(laser);
        laser.body.velocity.setTo(0, -200);

        this.playerLaser.add(laser);
    }
}

mainGameState.onAsteroidLaserCollision = function(asteroid, laser){
    asteroid.destroy();
    laser.destroy();
}















