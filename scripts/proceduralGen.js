"use strict";

var x_m = 50;
var y_m = 50;

function emptyStage(x, y) {
	var stage =  new Array(y);
  var i, j;
	for(i = 0; i < y; i++) {
		stage[i] = [];
		for(j = 0; j < y; j++) {
			stage[i].push(0);
		}
	}
	return stage;
}

/* Tries a certain number of times to place random sized rooms within the
 * constraints of the supplied stage. Rooms must not overlap.
 */
var Rooms = {
	rooms: [],
	tries: 0,
	stage: null,

	init: function (stage, tries) {
		this.stage = stage;
		this.tries = tries;
	},
	digRoom: function (stage, room) {
    var y, x;
		for(y = room.y; y <= room.y + room.h; y++) {
			for(x = room.x; x <= room.x + room.w; x++) {
				stage.stage[y][x] = 1;
			}
		}
	},
	checkRoomCollisions: function (stage, room) {
		var roomWithPadding = {};
		roomWithPadding.x = room.x;
		roomWithPadding.y = room.y;
		roomWithPadding.h = room.h;
		roomWithPadding.w = room.w;
    var y, x;
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
	},
	randomRoom: function (stage) {
		var MAX_WIDTH = 19, // if odd will use the previous even number
			MAX_HEIGHT = 19,
			MIN_WIDTH = 5,
			MIN_HEIGHT = 5,
			h = evenize(_.random(MIN_HEIGHT, MAX_HEIGHT)),
			w = evenize(_.random(MIN_WIDTH, MAX_WIDTH)),
			x = oddRng(1, stage.x_max - w - 1),
			y = oddRng(1, stage.y_max - h - 1);
		var room = { h: h, w: w, x: x, y: y };
		if (x + w >= x_m || y + h >= y_m) { // TODO: This should be on the stage object
			throw new Error('Oi! That room is too big.', room);
    }
    return room;
	},
	placeRoom: function () {
		var room = this.randomRoom(this.stage);
		if (this.checkRoomCollisions(this.stage, room) === false) {
			this.digRoom(this.stage, room);
			this.rooms.push(room);
		}
	},
	update: function () {
		if (this.tries > 0) {
			this.placeRoom();
			this.tries = this.tries - 1;
		}
	}
};

/**
 * 1. take a starting position
 * 2. explore all adjacent tiles and push excavatable ones onto the stack
 *   2.2 the order that tiles are pushed changes the shape of the passage
 * 3. pop off the stack and go back to 1.
 */
// TODO:
//   passages must not touch anything
//   prefer to dig in the same direction
//   start new passage if there is space left on stage
//   must choose between other directions randomly
//
//   SOLUTION: use colours to identify which region we can touch!
function carvePassage(stage, x0, y0) {
	var stack = [],
		x = x0,
		y = y0,
		colour = colourGenerator.next();
	stack.push({x: x, y: y});
	while (stack.length > 0) {
		if (canDig(colour, stage, x + 1, y)) {
			stack.push({x: x + 1, y: y});
		}
		if (canDig(colour, stage, x - 1, y)) {
			stack.push({x: x - 1, y});
		}
		if (canDig(colour, stage, x, y - 1)) {
			stack.push({x: x, y: y - 1});
		}
		if (canDig(colour, stage, x, y + 1)) {
			stack.push({x: x, y: y + 1});
		}
		var tile = stack.pop();
		x = tile.x;
		y = tile.y;
		stage.stage[y][x] = colour;
	}

	function canDig(colour, stage, x, y) {
		if (stage.stage[y] === undefined || stage.stage[y][x] === undefined) {
			return false;
		}
		if (stage.stage[y][x] !== ROCK) {
			return false;
		}
		var adjacentSameColorTiles = 0;
		var leftTile = stage.getTile(x - 1, y);
		if (leftTile === colour) {
			adjacentSameColorTiles = adjacentSameColorTiles + 1;
		}
		var rightTile = stage.getTile(x + 1, y);
		if (rightTile === colour) {
			adjacentSameColorTiles = adjacentSameColorTiles + 1;
		}
		var downTile = stage.getTile(x, y + 1);
		if (downTile === colour) {
			adjacentSameColorTiles = adjacentSameColorTiles + 1;
		}
		var upTile = stage.getTile(x, y - 1);
		if (upTile === colour) {
			adjacentSameColorTiles = adjacentSameColorTiles + 1;
		}
		if (adjacentSameColorTiles > 1) {
			return false;
		}
		return true;
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
	return _.floor(x / 2) * 2;
}

var colourGenerator = {
	count: 0,
	next: function () {
		this.count = this.count + 1;
		return this.count;
	}
};

var arr = emptyStage(x_m, y_m);
var stage = Stage.getStage(arr);
Rooms.init(stage, 20);
//carvePassage(stage, 0, 0);

function timeout() {
    setTimeout(function () {
		update();
		stage.render();
        timeout();
    }, 75);
}
timeout();

function update() {
	Rooms.update();
}
