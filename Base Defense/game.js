var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var GAME_WIDTH = 1300;
var GAME_HEIGHT = 900;

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

playerImage.src = "media/plane_0.png";

var enemieReady = false;
var enemieImage = new Image();

enemieImage.onload = function() {
	enemieReady = true;
};

enemieImage.src = "media/plane_1.png";

var player = {
	health: 100,
	kills: 0,
	speed: 125,
	x: 100,
	y: 0
};

var enemie = {
	speed: 150,
	x: 500,
	y: 100
};

var enemie2 = {
	speed: 100,
	x: 600,
	y: 100
};

var enemie3 = {
	speed: 200,
	x: 400,
	y: 100
};

var keysDown = {};

addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false);

var render = function() {
	if(bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if(playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}

	if(enemieReady) {
		ctx.drawImage(enemieImage, enemie.x, enemie.y);
		ctx.drawImage(enemieImage, enemie2.x, enemie2.y);
		ctx.drawImage(enemieImage, enemie3.x, enemie3.y);
	}

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBase = "top";
	ctx.fillText("Gesundheit: " + player.health, 32, 32);

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBase = "top";
	ctx.fillText("Kills: " + player.kills, 32, 60);

	if(player.health == 0) {
		stopGame();
	}

};

var spawnPlayer = function() {
	player.x = 200;
	player.y = (canvas.height - 87) / 2;
};

var spawnEnemie = function() {
	if (player.health > 0) {
		enemie.x = canvas.width - 68;
		enemie.y = Math.random() * (GAME_HEIGHT - 87);
	} else {
		enemie.speed = 0;
		enemie2.speed = 0;
		enemie3.speed = 0;
		enemie2.x = -68;
		enemie3.x = -68;
		enemie.x = -68;
	}
};

var spawnSecondEnemie = function() {
	if (player.health > 0) {
		enemie2.x = canvas.width - 68;
		enemie2.y = Math.random() * (GAME_HEIGHT - 87);
	} else {
		enemie2.speed = 0;
		enemie2.x = -68;
	}
};

var spawnThirdEnemie = function() {
	if (player.health > 0) {
		enemie3.x = canvas.width - 68;
		enemie3.y = Math.random() * (GAME_HEIGHT - 87);
	} else {
		enemie3.speed = 0;
		enemie3.x = -68;
	}
};

var stopGame = function() {
	ctx.fillStyle = "rgb(200, 0, 50)";
	ctx.font = "50px Helvetica";
	ctx.textAlign = "center";
	ctx.textBase = "top";
	ctx.fillText("Spielende", canvas.width / 2, 200);

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "30px Helvetica";
	ctx.textAlign = "center";
	ctx.textBase = "top";
	ctx.fillText("Kills: " + player.kills, canvas.width / 2, 275);

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "30px Helvetica";
	ctx.textAlign = "center";
	ctx.textBase = "top";
	ctx.fillText("Drücke \"R\" um das Spiel noch einmal zu spielen", canvas.width / 2, canvas.height / 2);
};

var update = function(modifier) {
	if (player.health > 0) {
		if (87 in keysDown) {
			player.y -= player.speed * modifier;
		}

		if (83 in keysDown) {
			player.y += player.speed * modifier;
		}

		if (32 in keysDown) {
			// Leerzeichen = Schießen
			if (player.x < enemie.x - 68 && player.y >= enemie.y - 87 && player.y - 87 <= enemie.y) {
				spawnEnemie();
				player.kills++;
			}

			if (player.x < enemie2.x - 68 && player.y >= enemie2.y - 87 && player.y - 87 <= enemie2.y) {
				spawnSecondEnemie();
				player.kills++;
			}

			if (player.x < enemie3.x - 68 && player.y >= enemie3.y - 87 && player.y - 87 <= enemie3.y) {
				spawnThirdEnemie();
				player.kills++;
			}
		}

		if(enemie.x <= 0) {
			player.health = player.health - 10;
			spawnEnemie();
		}

		if (enemie2.x <= 0) {
			player.health = player.health - 10;
			spawnSecondEnemie();
		}

		if (enemie3.x <= 0) {
			player.health = player.health - 10;
			spawnThirdEnemie();
		}

		enemie.x -= enemie.speed * modifier;
		enemie2.x -= enemie2.speed * modifier;
		enemie3.x -= enemie3.speed * modifier;
	}

	if(82 in keysDown) {
		reset();
	}
};

var reset = function() {
	spawnPlayer();
	enemie.speed = 150;
	enemie2.speed = 100;
	enemie3.speed = 200;
	player.health = 100;
	player.kills = 0;
	spawnEnemie();
	spawnSecondEnemie();
	spawnThirdEnemie();
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

spawnEnemie();
spawnSecondEnemie();
spawnThirdEnemie();
spawnPlayer();
main();
