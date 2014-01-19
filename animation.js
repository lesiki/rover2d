var animation;
var Animation = function() {
	var canvas = document.getElementById('canvas'),
	gridSize = 10,
	blockWidth = 600/gridSize,
	context = canvas.getContext('2d'),
	rover,

	init = function() {
		rover = new Rover(gridSize);
		rover.setPosition(0, 0);
		rover.setDirection(1);
		rover.copyCurrentToTarget();
		rover.setInstructions(["R", "M", "M"]);
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
		var preciseX, preciseY, xOffset, yOffset;
		if(rover.getState() === 'crashed') {
			gradient.addColorStop("0","#f22");
			gradient.addColorStop("0.5","#f88");
			gradient.addColorStop("1.0","#f00");
		}
		else if (rover.getState() === 'finished') {
			gradient.addColorStop("0","#2f2");
			gradient.addColorStop("0.5","#8f8");
			gradient.addColorStop("1.0","#0f0");
		}
		else {
			gradient.addColorStop("0","#999");
			gradient.addColorStop("0.5","#eee");
			gradient.addColorStop("1.0","#777");
		}
		context.fillStyle=gradient;
		context.lineWidth=1;
		context.beginPath();
		xOffset = (blockWidth * ((animPercentage/100) * (rover.getTargetX() - rover.getX())));
		yOffset = (blockWidth * ((animPercentage/100) * (rover.getTargetY() - rover.getY())));

		preciseX = rover.getX() * blockWidth;
		preciseY = rover.getY() * blockWidth;
		preciseX += xOffset;
		preciseY += yOffset;
		var theta = (2 * Math.PI) * ((rover.getCurrentDirection() - 1) / 4);	
		if(rover.getTargetDirection() !== rover.getCurrentDirection()) {
			theta += animPercentage/100 * (2 * Math.PI) * ((rover.getTargetDirection() - rover.getCurrentDirection()) /4);
		}
		var centerOfRotationX = preciseX + blockWidth/2;
		var centerOfRotationY = preciseY + blockWidth/2;
		var a = rotatePoint(preciseX, preciseY, theta, centerOfRotationX, centerOfRotationY);
		context.moveTo(a.x, a.y);
		var b = rotatePoint(preciseX + blockWidth, preciseY + blockWidth / 2, theta, centerOfRotationX, centerOfRotationY);
		context.lineTo(b.x, b.y);
		var c = rotatePoint(preciseX, preciseY + blockWidth, theta, centerOfRotationX, centerOfRotationY);
		context.lineTo(c.x, c.y);
		context.lineTo(a.x, a.y);
		context.fill();
	},
	rotatePoint = function(x, y, theta, centerX, centerY) {
		newX = centerX + (x-centerX)*Math.cos(theta) - (y-centerY)*Math.sin(theta);
		newY = centerY + (x-centerX)*Math.sin(theta) + (y-centerY)*Math.cos(theta);
		return {x: newX, y: newY};
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
		if(rover.getState() !== 'finished' && rover.getState() !== 'crashed') {
			requestAnimFrame(function() {
				animate(canvas, context, startTime);
			});
		}
	},
	requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	this.context = context;
	this.gridSize = gridSize;
	init();
};
var Rover = function(inputGridSize) {
	var x, y, direction,
	gridSize = inputGridSize,
	targetX, targetY, targetDirection,
	commands,
	state,
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
	this.getCurrentDirection = function() { return direction; };
	this.getTargetDirection = function() { return targetDirection; };
	this.getState = function() {
		return state;
	};
	this.turn = function(isLeft) {
		//TODO
		if(isLeft) {
			targetDirection = (direction - 1) % 4;
			if (targetDirection == -1) {
				targetDirection = 3;
			}
		}
		else {
			targetDirection = (direction + 1) % 4;
		}
	};
	this.move = function() {
		// TODO hard coded to one move to right
		if(direction == 1) {
			targetX = x + 1;
		}
		else if(direction == 2) {
			targetY = y + 1;
		}
		else if(direction == 3) {
			targetX = x - 1;
		}
		else if(direction == 0) {
			targetY = y - 1;
		}
		if(targetX < 0 || targetY < 0 || targetX > gridSize || targetY > gridSize) {
			state = 'crashed';
			this.copyCurrentToTarget();
		}
	};
	this.movementCompleted = function() {
		x = targetX;
		y = targetY;
		direction = targetDirection;
	};
	this.copyCurrentToTarget = function() {
		targetX = x;
		targetY = y;
		targetDirection = direction;
	};
	this.nextCommand = function() {
		var instruction = commands[nextInstructionIndex];
		if(instruction === "M") {
			this.move();
		}
		if(instruction === "R") {
			this.turn(false);
		}
		if(instruction === "L") {
			this.turn(true);
		}
		nextInstructionIndex ++;
		if (nextInstructionIndex > commands.length) {
			state = 'finished';
		}
	};
};
$(function() {
	animation = new Animation();
});
