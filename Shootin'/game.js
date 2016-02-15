var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var mouseX = 0, mouseY = 0, mouseDown = false, shoot = 1, reload = false, menu = true;

var player = {
	kills: 0
};

canvas.addEventListener("mousemove", function(e) {
	mouseX = e.offsetX;
	mouseY = e.offsetY;
}, false);

canvas.addEventListener("mousedown", function(e) {
	mouseDown = true;
}, false);

canvas.addEventListener("mouseup", function(e) {
	mouseDown = false;
	shoot = 0;
}, false);

var visierReady = false;
var visierImage = new Image();

var visier = {
	x: 0,
	y: 0
}

var rects = [
	{x: 10, y: 85, speed: 200, w: 20, h: 40, color: "rgb(250, 0, 0)"},
	{x: 10, y: 216, speed: 150, w: 40, h: 80, color: "rgb(250, 100, 0)"},
	{x: 10, y: 303, speed: 100, w: 50, h: 100, color: "rgb(0, 250, 0)"}
];

visierImage.src = "media/visier.png";

visierImage.onload = function() {
	visierReady = true;
};

var bgReady = false;
var bgImg = new Image();

bgImg.src = "media/bg.png";

bgImg.onload = function() {
	bgReady = true;
};

function render() {
	context.fillStyle = "rgb(250, 250, 250)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	if(bgReady) {
		context.drawImage(bgImg, 0, 0);
	}

	context.fillStyle = "rgb(0, 0, 0)";
	context.font = "24px Helvetica";
	context.textBase = "top";
	context.textAlign = "left";
	context.fillText("X: " + mouseX, 32, 32);

	context.fillStyle = "rgb(0, 0, 0)";
	context.font = "24px Helvetica";
	context.textAlign = "left";
	context.textBase = "top";
	context.fillText("Y: " + mouseY, 32, 60);

	context.fillStyle = "rgb(0, 0, 0)";
	context.font = "24px Helvetica";
	context.textBase = "top";
	context.textAlign = "right";
	context.fillText("Treffer: " + player.kills, canvas.width - 32, 32);

	if(reload) {
		context.fillStyle = "rgb(250, 0, 0)";
		context.font = "24px Helvetica";
		context.textBase = "top";
		context.textAlign = "right";
		context.fillText("Nachladen", canvas.width - 32, 60);
	} else {
		context.fillStyle = "rgb(0, 0, 0)";
		context.font = "24px Helvetica";
		context.textBase = "top";
		context.textAlign = "right";
		context.fillText("Schussbereit", canvas.width - 32, 60);
	}

	context.fillStyle = "rgb(250, 250, 250)";
	context.font = "12px Helvetica";
	context.textBase = "bottom";
	context.textAlign = "right";
	context.fillText("Programmierer und Designer: nitohu", canvas.width - 32, canvas.height - 12);

	rects.forEach(function(elem) {
		context.fillStyle = elem.color;
		context.fillRect(elem.x, elem.y, elem.w, elem.h);
	});

	if(visierReady) {
		context.drawImage(visierImage, visier.x, visier.y);
	}

	if(menu == true) {
		context.fillStyle = "rgb(0, 0, 0)";
		context.font = "50px Arial";
		context.textBase = "middle";
		context.textAlign = "center";
		context.fillText("Shootin'", canvas.width / 2, 50);
	}
}

function update(modifier) {
	visier.x = mouseX - 32;
	visier.y = mouseY - 32;

	rects.forEach(function(elem) {
		elem.x += elem.speed * modifier;

		if(elem.x >= canvas.width - elem.w - 10) {
			elem.speed *= -1;
		} else if (elem.x <= 10) {
			elem.speed *= -1;
		}

		if(shoot == 1 && mouseDown == true && mouseX >= elem.x && mouseX <= elem.x + elem.w && mouseY >= elem.y && mouseY <= elem.y + elem.h) {
			if (elem.w == 20 && elem.h == 40) {
				player.kills = player.kills + 3;
			} else if (elem.w == 40 && elem.h == 80 ) {
				player.kills = player.kills + 2;
			} else {
				player.kills++;
			}

			elem.x = 10;

		}

	});

	if(shoot == 0) {
		var reloadTimeout = setTimeout(function() {
			shoot = 1;
			reload = false;
		}, 1000);

		console.log(reload);

		reload = true;
	}

}

function menuFn() {
	menu = true;
}

function main() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	requestAnimationFrame(main);
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();

main();