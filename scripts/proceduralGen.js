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
	var MAX_WIDTH = 19, // if odd will use the previous even number
		MAX_HEIGHT = 19,
		MIN_WIDTH = 5,
		MIN_HEIGHT = 5,
		h = evenize(_.random(MIN_HEIGHT, MAX_HEIGHT)),
		w = evenize(_.random(MIN_WIDTH, MAX_WIDTH)),
		x = oddRng(1, stage.x_max - w - 1),  // -1 for array bounds and -3 for padding
		y = oddRng(1, stage.y_max - h - 1);
	var room = { h: h, w: w, x: x, y: y };
	if (x + w >= x_m || y + h >= y_m) { // TODO: This should be on the stage object
		throw new Error('Oi! That room is too big.', room);
	}
	return room;
}

function checkCollisionsOnStage(stage, room) {
	var roomWithPadding = {};
	roomWithPadding.x = room.x;  // Add padding to room to ensure 3 tiles between nodes.
	roomWithPadding.y = room.y;
	roomWithPadding.h = room.h;
	roomWithPadding.w = room.w;
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

	// find some rock
	// start cutting a passage there
	// cut up, down, left, right at random
function carvePassages(stage, x0, y0) {
	var pos = {x: x0, y: x0};  // Current position initialized to the initial position.
	dig(stage, pos.x, pos.y); // Excavate the starting tile.
	var prevDig = null;
	delve();

	function delve() {
		if (prevDig && prevDig(stage, pos)) {
			delve();
		} else if (Dig.down(stage, pos)) {
			prevDig = Dig.down;
			delve();
		} else if (Dig.right(stage, pos)) {
			prevDig = Dig.right;
			delve();
		} else if (Dig.up(stage, pos)) {
			prevDig = Dig.up;
			delve();
		} else if (Dig.left(stage, pos)) {
			prevDig = Dig.left;
			delve();
		} else {
			console.log('Delved too greedily, and too deep.');
		}
	}
}

// pos(x, y) is the current position
// returns true if dig was successful
var Dig = {
	up: function (stage, pos) {
		if (dig(stage, pos.x, pos.y - 1)) {
			pos.y = pos.y - 1;
			return true;
		} else {
			return false;
		}
	},
	down: function (stage, pos) {
		if (dig(stage, pos.x, pos.y + 1)) {
			pos.y = pos.y + 1;
			return true;
		} else {
			return false;
		}
	},
	left: function (stage, pos) {
		if (dig(stage, pos.x - 1, pos.y)) {
			pos.x = pos.x - 1;
			return true;
		} else {
			return false;
		}
	},
	right: function (stage, pos) {
		if (dig(stage, pos.x + 1, pos.y)) {
			pos.x = pos.x + 1;
			return true;
		} else {
			return false;
		}
	}
}

function dig(stage, x, y) {
	if (isRock(stage, x, y)) {
		stage.stage[y][x] = 1;
		return true;
	} else {
		return false;
	}
}

function isRock(stage, x, y) {
	// Bounds check.
	// TODO: this should be on the stage.
	if (stage.stage[y] === undefined || stage.stage[y][x] === undefined) {
		return false;
	} else {
		return stage.stage[y][x] === 0;
	}
}

function oneIn(num, callback) {
	if (_.random(1, num) % num === 0) {
		return callback();
	}
}

function oddRng(min, max) {
	var rn = _.random(min, max);
	if (rn % 2 === 0) {
		if (rn === max) {
			rn = rn - 1;
		} else if (rn === min) {
			rn = rn + 1;
		} else {
			var adjustment = _.random(1,2) === 2 ? 1 : -1;
			rn = rn + adjustment;
		}
	}
	return rn;
}

function evenize(x) {
	if (x === 0) { return x; }
	return _.floor(x / 2) * 2
}

var arr = emptyStage(x_m, y_m);
var stage = Stage.getStage(arr);
var rooms = placeRooms(stage, 100);
//carvePassages(stage, 0, 0);
stage.update();
