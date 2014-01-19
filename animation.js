var animation;
var Animation = function() {
	var canvas = document.getElementById('canvas'),
	gridSize = 10,
	blockWidth = 600/gridSize,
	context = canvas.getContext('2d'),
	rover,

	init = function() {
		rover = new Rover();
		rover.setPosition(0, 0);
		rover.setInstructions(["M", "M", "M", "M"]);
		rover.nextCommand();
		animate(canvas, context, new Date().getTime());
	},
	drawGrid = function() {
		var gradient=context.createLinearGradient(0,0,600, 600);
		gradient.addColorStop("0","#999");
		gradient.addColorStop("0.5","#eee");
		gradient.addColorStop("1.0","#777");
		context.strokeStyle=gradient;
		context.lineWidth=1;
		for(var x = 600/gridSize; x < 600; x += 600/gridSize) {
			context.beginPath();
			context.moveTo(x, 0);
			context.lineTo(x, 600);
			context.stroke();
			context.closePath();
		}
		for(var y = 600/gridSize; y < 600; y += 600/gridSize) {
			context.beginPath();
			context.moveTo(0, y);
			context.lineTo(600, y);
			context.stroke();
			context.closePath();
		}
	},
	drawRover = function(rover, animPercentage) {
		var gradient=context.createLinearGradient(0,0,600, 600);
		var preciseX, preciseY;
		gradient.addColorStop("0","#999");
		gradient.addColorStop("0.5","#eee");
		gradient.addColorStop("1.0","#777");
		context.fillStyle=gradient;
		context.lineWidth=1;
		context.beginPath();
		preciseX = (blockWidth * rover.getX()) + (blockWidth * ((animPercentage/100) * (rover.getTargetX() - rover.getX())));
		preciseY = (blockWidth * rover.getY()) + (blockWidth * ((animPercentage/100) * (rover.getTargetY() - rover.getY())));
		context.moveTo(preciseX, preciseY);
		context.lineTo(preciseX + blockWidth, preciseY + blockWidth / 2);
		context.lineTo(preciseX, preciseY + blockWidth);
		context.lineTo(preciseX, preciseY);
		context.fill();
	},
	animate = function(canvas, context, startTime) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		var time = new Date().getTime() - startTime;
		if (Math.floor(time /10) > 100) {
			startTime = new Date().getTime();
			time = new Date().getTime() - startTime;
			rover.movementCompleted();
			rover.nextCommand();
		}
		drawGrid();
		drawRover(rover, time/10);
		requestAnimFrame(function() {
			animate(canvas, context, startTime);
		});
	},
	requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	this.context = context;
	init();
};
var Rover = function() {
	var x, y, direction,
	targetX, targetY, targetDirection,
	commands,
	nextInstructionIndex = 0;
	this.setPosition = function(newX, newY) {
		x = newX;
		y = newY;
	};
	this.setInstructions = function(newCommands) {
		commands = newCommands;
	}
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getTargetX = function() { return targetX; };
	this.getTargetY = function() { return targetY; };
	this.setDirection = function(newDirection) {
		direction = newDirection;
	};
	this.turn = function(isLeft) {
		//TODO
	};
	this.move = function() {
		// TODO hard coded to one move to right
		targetX = x + 1;
		targetY = 0;
	};
	this.movementCompleted = function() {
		x = targetX;
		y = targetY;
		direction = targetDirection;
	};
	this.nextCommand = function() {
		var instruction = commands[nextInstructionIndex];
		if(instruction === "M") {
			this.move();
		}
		nextInstructionIndex ++;
	}
};
$(function() {
	animation = new Animation();
});
