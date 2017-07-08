// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Hero border image
var heroBorderReady = false;
var heroBorderImage = new Image();
heroBorderImage.onload = function () {
	heroBorderReady = true;
};
heroBorderImage.src = "images/hero_border.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Hole image
var holeReady = false;
var holeImage = new Image();
holeImage.onload = function () {
	holeReady = true;
};
holeImage.src = "images/hole.png";

var borderTouched = false;

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

var hole = {};

var lastHole = {};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


var checkCollision = function(objectA, objectB){
	return objectA.x <= (objectB.x + 32)
	&& objectB.x <= (objectA.x + 32)
	&& objectA.y <= (objectB.y + 32)
	&& objectB.y <= (objectA.y + 32)
}
// Reset the game when the player catches a monster
var reset = function(isHoleRequired) {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	if(isHoleRequired){
		do {
			hole.x = 32 + (Math.random() * (canvas.width - 64));
			hole.y = 32 + (Math.random() * (canvas.height - 64));
		}
		while (checkCollision(hole, hero));
	}

	// Throw the monster somewhere on the screen randomly
	do {
		monster.x = 32 + (Math.random() * (canvas.width - 64));
		monster.y = 32 + (Math.random() * (canvas.height - 64));
	}
	while (checkCollision(monster, hero) && checkCollision(monster, hole));

};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (checkCollision(hero, monster)){
		++monstersCaught;
		reset(false);
	}

	// Check if the hero falls into a hole
	if (checkCollision(hero, hole)){
		monstersCaught = 0;
		reset(true);
	}

	let atLeastOneBorderIsTouched = false;

	if(hero.x <= 32){
		hero.x = 32;
	  atLeastOneBorderIsTouched = true;
	}
	else if(isMaxWidth()){
		hero.x = canvas.width - 64;
		atLeastOneBorderIsTouched = true;
	}

	if(hero.y <= 32){
		hero.y = 32;
		atLeastOneBorderIsTouched = true;
	}
	else if(isMaxHeight()){
		hero.y = canvas.height - 64;
				atLeastOneBorderIsTouched = true;
	}

	if(atLeastOneBorderIsTouched){
		borderTouched = true;
	}
	else {
		borderTouched = false;
	}

};

var isMaxWidth = function(){
	return hero.x >= canvas.width - 64;
};

var isMaxHeight = function(){
	return hero.y >= canvas.height - 64;
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroBorderReady && borderTouched) {
		ctx.drawImage(heroBorderImage, hero.x, hero.y);
	}
	else if(heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	};

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (holeReady) {
		ctx.drawImage(holeImage, hole.x, hole.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset(true);
main();
