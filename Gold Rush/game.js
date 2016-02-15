var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var GAME_WIDTH = 900;
var GAME_HEIGHT = 600;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

document.body.appendChild(canvas);

var bgReady = false;
var bgImage = new Image();

bgImage.onload = function() {
	bgReady = true;
};

bgImage.src = "media/bg.png";

var playerReady = false;
var playerImage = new Image();

playerImage.onload = function() {
	playerReady = true;
};

playerImage.src = "media/player.png";

var enemieReady = false;
var enemieImage = new Image();

enemieImage.onload = function() {
	enemieReady = true;
};

enemieImage.src = "media/enemie.png";

var treasureReady = false;
var treasureImage = new Image();

treasureImage.onload = function() {
	treasureReady = true;
};

treasureImage.src = "media/chest2.png";

var player = {
	speed: 100,
	isMoving: false,
	x: 0,
	y: 0
};

var enemies = [
	{x: 100, y: 0, speed: 100, down: true},
	{x: 250, y: 0, speed: 150, down: true},
	{x: 400, y: 0, speed: 200, down: true},
	{x: 550, y: 0, speed: 300, down: true},
	{x: 650, y: 0, speed: 150, down: true}
];

var treasure = {
	x: 0,
	y: 0
};

var spawnPlayer = function() {
	player.y = (canvas.height - 65) / 2;
	player.x = 10;
};

var spawnTreasure = function() {
	treasure.x = canvas.width - 70;
	treasure.y = (canvas.height - 64) / 2
};

var keysDown = {};
var win = false;
var attemps = 1;

addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
});

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
});

canvas.addEventListener('mousedown', movePlayer);
canvas.addEventListener('mouseup', stopPlayer);  
canvas.addEventListener('touchstart', movePlayer);
canvas.addEventListener('touchend', stopPlayer);

var movePlayer = function() {
	player.isMoving = true;
};

var stopPlayer = function() {
	player.isMoving = false;
};

var render = function() {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}

	if (treasureReady) {
		ctx.drawImage(treasureImage, treasure.x, treasure.y);
	}

	enemies.forEach(function(element, index) {
		ctx.drawImage(enemieImage, element.x, element.y)
	});

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Arial";
	ctx.textBase = "top";
	ctx.textAlign = "left";
	ctx.fillText("Attemps: " + attemps, 32, 32);

	if (win) {
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "50px Arial";
		ctx.textBase = "middle";
		ctx.textAlign = "center";
		ctx.fillText("Game Won!", canvas.width / 2, (canvas.height - 200) / 2);

		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "25px Arial";
		ctx.textBase = "middle";
		ctx.textAlign = "center";
		ctx.fillText("Attemps: " + attemps, canvas.width / 2, canvas.height / 2);

		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "25px Arial";
		ctx.textBase = "middle";
		ctx.textAlign = "center";
		ctx.fillText("Press 'R' to play again! Or click to play again!", canvas.width / 2, (canvas.height + 200) / 2);
	}
};

var update = function(modifier) {

	if(39 in keysDown) {
		player.x += player.speed * modifier;
	}

	if (82 in keysDown) {
		reset();
	}

	if (player.x >= treasure.x - 64) {
		win = true;
	}

	if (player.isMoving) {
		player.x += player.speed * modifier;
	}

	enemies.forEach(function(element, index) {
		element.y += element.speed * modifier;

		if (element.y <= 0) {
			element.speed *= -1;
		}
		if (element.y >= canvas.height - 64) {
			element.speed *= -1;
		}

		if (player.x <= (element.x + 31) && element.x <= (player.x + 44) && player.y <= (element.y + 36) && element.y <= (player.y + 64)) {
			attemps++;
			spawnPlayer();
		}
		
	});

};

var reset = function() {
	spawnPlayer();
	spawnTreasure();
	attemps = 0;
	win = false;
	enemies.forEach(function(element, index) {
		element.y = 0;
	});
};

var main = function() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();

spawnPlayer();
spawnTreasure();
main();
