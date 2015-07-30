var x_m = 50;
var y_m = 50;

// Create a 2d array of zeros.
function emptyStage(x, y) {
	var stage =  new Array(y);
	for(i = 0; i < y; i++) {
		stage[i] = [];
		for(j = 0; j < y; j++) {
			stage[i].push(0);
		}
	}
	return stage;
}

function randomRoom(stage) {
	var MAX_WIDTH = 15,
		MAX_HEIGHT = 15,
		MIN_WIDTH = 3,
		MIN_HEIGHT = 3,
		h = _.random(MIN_HEIGHT, MAX_HEIGHT),
		w = _.random(MIN_WIDTH, MAX_WIDTH),
		x = _.random(3, stage.x_max - w - 1 - 3),  // -1 for array bounds and -3 for padding
		y = _.random(3, stage.y_max - h - 1 - 3);
	var room = { h: h, w: w, x: x, y: y };
	if (x + w >= x_m || y + h >= y_m) {
		throw new Error('Oi! That room is too big.', room);
	}
	return room;
}

function checkCollisionsOnStage(stage, room) {
	var roomWithPadding = {};
	roomWithPadding.x = room.x - 3;  // Add padding to room to ensure 3 tiles between nodes.
	roomWithPadding.y = room.y - 3;
	roomWithPadding.h = room.h + 6;
	roomWithPadding.w = room.w + 6;
	for(y = roomWithPadding.y; y <= roomWithPadding.y + roomWithPadding.h; y++) {
		for(x = roomWithPadding.x; x <= roomWithPadding.x + roomWithPadding.w; x++) {
			if(x >= x_m || y >= y_m) {
				throw new Error('Oi! That\'s out of bounds!', x, y);
			}
			if (stage.stage[y][x] !== 0) {
				return true;
			}
		}
	}
	return false;
}

/* Tries a certain number of times to place random sized rooms within the
 * constraints of the supplied stage. Rooms must not overlap.
 */
function placeRooms(stage, numTries) {
	var rooms = [];

	// Dig the room into the actual stage.
	function digRoom(stage, room) {
		for(y = room.y; y <= room.y + room.h; y++) {
			for(x = room.x; x <= room.x + room.w; x++) {
				stage.stage[y][x] = 1;
			}
		}
	}

	for(i = 0; i < numTries; i++) {
		var room = randomRoom(stage);
		if (checkCollisionsOnStage(stage, room) === false) {
			digRoom(stage, room);
			rooms.push(room);
		} else {
			//console.log('placeRooms: room: ', room, 'has collision.');
		}
	}
	return rooms;
}

function carvePassages(stage) {
	// find some rock
	// start cutting a passage there
	// cut up, down, left, right at random
	var x = 0;  // starting postions
	var	y = 0;
	var digHistory = [];  // For probability tuning.

	function delve(stage, x, y) {
		if (pickaxe.digDown(stage, x, y)) {
			console.log('dig');
			delve(stage, x, y + 1);
		} else if (pickaxe.digRight(stage, x, y)) {
			console.log('dig');
			delve(stage, x + 1, y);
		} else if (pickaxe.digUp(stage, x, y)) {
			console.log('dig');
			delve(stage, x, y - 0);
		} else if (pickaxe.digLeft(stage, x, y)) {
			console.log('dig');
			delve(stage, x - 1, y);
		} else {
			console.log('Delved too greedily, and too deep.');
		}
	}
	// Start delving.
	delve(stage, x, y);
}

// (x, y) are the current position
var pickaxe = {
	digUp: function (stage, x, y) {
		var x = x;
		var	y = y - 1;
		if (isRock(stage, x, y)) {
			dig(stage, x, y);
			return true;
		}
		return false;
	},
	digDown: function (stage, x, y) {
		var x = x;
		var	y = y + 1;
		if (isRock(stage, x, y)) {
			dig(stage, x, y);
			return true;
		}
		return false;
	},
	digLeft: function (stage, x, y) {
		var x = x - 1;
		var	y = y;
		if (isRock(stage, x, y)) {
			dig(stage, x, y);
			return true;
		}
		return false;
	},
	digRight: function (stage, x, y) {
		var x = x + 1;
		var	y = y;
		if (isRock(stage, x, y)) {
			dig(stage, x, y);
			return true;
		}
		return false;
	}
}

function isRock(stage, x, y) {
	// Bounds check.
	// TODO: this should be on the stage.
	if (stage.stage[y] === undefined || stage.stage[y][x] === undefined) {
		return false;
	}
	return stage.stage[y][x] === 0;
}

function dig(stage, x, y) {
	stage.stage[y][x] = 1;
}


var arr = emptyStage(x_m, y_m);
var stage = Stage.getStage(arr);
// var rooms = placeRooms(stage, 100);
carvePassages(stage);
drawStage(stage);
