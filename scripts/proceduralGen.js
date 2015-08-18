/* Tries a certain number of times to place random sized rooms within the
 * constraints of the supplied stage. Rooms must not overlap.
 */
var roomBuilderConstructor = function (world, attempts) {
  "use strict";

  var roomBuilder = {
    digRoom: function (world, room) {
      for(var y = room.y; y <= room.y + room.h; y++) {
        for(var x = room.x; x <= room.x + room.w; x++) {
          world.stage[y][x] = 1;
        }
      }
    },

    checkRoomCollisions: function (world, room) {
      var roomWithPadding = {};
      roomWithPadding.x = room.x;
      roomWithPadding.y = room.y;
      roomWithPadding.h = room.h;
      roomWithPadding.w = room.w;
      for(var y = roomWithPadding.y; y <= roomWithPadding.y + roomWithPadding.h; y++) {
        for(var x = roomWithPadding.x; x <= roomWithPadding.x + roomWithPadding.w; x++) {
          if(x >= world.x_max || y >= world.y_max) {
            throw new Error('Oi! That\'s out of bounds!', x, y);
          }
          if (world.stage[y][x] !== 0) {
            return true;
          }
        }
      }
      return false;
    },

    randomRoom: function (world) {
      var MAX_WIDTH = 19; // if odd will use the previous even number
      var MAX_HEIGHT = 19;
      var MIN_WIDTH = 5;
      var MIN_HEIGHT = 5;
      var h = evenize(_.random(MIN_HEIGHT, MAX_HEIGHT));
      var w = evenize(_.random(MIN_WIDTH, MAX_WIDTH));
      var x = oddRng(1, world.x_max - w - 1);
      var y = oddRng(1, world.y_max - h - 1);
      var room = { h: h, w: w, x: x, y: y };
      if (x + w >= world.x_max || y + h >= world.y_max) {
        throw new Error('Oi! That room is too big.', room);
      }
      return room;
    },

    placeRoom: function () {
      var room = this.randomRoom(this.world);
      if (this.checkRoomCollisions(this.world, room) === false) {
        this.digRoom(this.world, room);
        this.rooms.push(room);
        return true;
      }
      return false;
    },

    update: function () {
      while (this.attempts > 0) {
        this.attempts = this.attempts - 1;
        var wasSuccessful = this.placeRoom();
        if (wasSuccessful === true) {
          return;
        }
      }
    }
  };

  var newRoomBuilder = Object.create(roomBuilder);
  newRoomBuilder.world = world;
  newRoomBuilder.attempts = attempts;
  newRoomBuilder.rooms = [];
  return newRoomBuilder;
};

function passageCarver(world, x0, y0) {
  'use strict';
  var stack = [];
  stack.push({x: x0, y: y0});
  var colour = colourGenerator.next();

  function delveDeeper() {
    if (stack.length > 0) {
      var tile = stack.pop();
      var x = tile.x;
      var y = tile.y;
      if (canDig(colour, x, y) === false) {
        return false;
      }
      world.stage[tile.y][tile.x] = colour;
      pushRight(x, y);
      pushLeft(x, y);
      pushUp(x, y);
      pushDown(x, y);
    }
  }

  function pushRight(x, y) {
    if (canDig(colour, x + 1, y)) {
      stack.push({x: x + 1, y: y});
    }
  }

  function pushLeft(x, y) {
    if (canDig(colour, x - 1, y)) {
      stack.push({x: x - 1, y: y});
    }
  }

  function pushUp(x, y) {
    if (canDig(colour, x, y - 1)) {
      stack.push({x: x, y: y - 1});
    }
  }

  function pushDown(x, y) {
    if (canDig(colour, x, y + 1)) {
      stack.push({x: x, y: y + 1});
    }
  }

  function canDig(colour, x, y) {
    if (world.stage[y] === undefined || world.stage[y][x] === undefined) {
      return false;
    }
    if (world.stage[y][x] !== 0) {
      return false;
    }
    var adjacentSameColorTiles = 0;
    var leftTile = world.getTile(x - 1, y);
    if (leftTile === colour) {
      adjacentSameColorTiles = adjacentSameColorTiles + 1;
    }
    var rightTile = world.getTile(x + 1, y);
    if (rightTile === colour) {
      adjacentSameColorTiles = adjacentSameColorTiles + 1;
    }
    var downTile = world.getTile(x, y + 1);
    if (downTile === colour) {
      adjacentSameColorTiles = adjacentSameColorTiles + 1;
    }
    var upTile = world.getTile(x, y - 1);
    if (upTile === colour) {
      adjacentSameColorTiles = adjacentSameColorTiles + 1;
    }
    if (adjacentSameColorTiles > 1) {
      return false;
    }
    return true;
  }

  function timeout() {
    'use strict';
      setTimeout(function () {
        delveDeeper();
        world.render();
        timeout();
      }, 1);
  }
  timeout();
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

var world = worldConstructor(50, 50);
var roomBuilder = roomBuilderConstructor(world, 20);

function timeout() {
  'use strict';
    setTimeout(function () {
      roomBuilder.update();
      world.render();
      timeout();
    }, 1);
}
timeout();

passageCarver(world, 0, 0);
