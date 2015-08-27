var roomBuilderConstructor = function (world, attempts) {
  "use strict";

  var roomBuilder = {
    digRoom: function (world, room) {
      for(var y = room.y; y <= room.y + room.h; y++) {
        for(var x = room.x; x <= room.x + room.w; x++) {
          world.stage[y][x] = room.colour;
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
      var MAX_WIDTH = 15; // if odd will use the previous even number
      var MAX_HEIGHT = 15;
      var MIN_WIDTH = 3;
      var MIN_HEIGHT = 3;
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
        room.colour = colourGenerator.next();
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
          return false;  // Not done yet
        }
      }
      return true;  // Now we're done
    },

    animate: function () {
      var that = this;
      var done;
      function timeout() {
        setTimeout(function () {
          done = that.update();
          that.world.render();
          if (!done) {
            timeout();
          }
        }, 0);
      }
      timeout();
    },

    quickRender: function () {
      var that = this;
      var done;
      while (!done) {
        done = that.update();
      }
      that.world.render();
    }
  };

  var newRoomBuilder = Object.create(roomBuilder);
  newRoomBuilder.world = world;
  newRoomBuilder.attempts = attempts;
  newRoomBuilder.rooms = [];
  return newRoomBuilder;
};


function findStartingTile(world) {
  'use strict';
  for (var y = 0; y < world.y_max; y++) {
    for (var x = 0; x < world.x_max; x++) {
      var valid = true;
      _.forEach(calculateAdjacentTiles(x, y), function (tile) {
        if (world.getTile(tile.x, tile.y) !== 0) {
          valid = false;
        }
      });
      if (valid === true) {
        return {x: x, y: y};
      }
    }
  }
}

function passageCarver(world, x0, y0) {
  'use strict';
  var stack = [];
  stack.push({x: x0, y: y0});
  var colour = colourGenerator.next();

  function delveDeeper() {
    if (stack.length > 0) {
      var tile = stack.pop();
      if (canDig(tile.x, tile.y) === false) {
        return false;
      }
      world.stage[tile.y][tile.x] = colour;
      _.forEach(_.shuffle([pushRight, pushLeft, pushUp, pushDown]), function (direction) {
        direction(tile.x, tile.y);
      });
      return false;
    } else {  // Send a signal to the game loop to stop
      return true;
    }
  }

  function pushRight(x, y) {
    if (canDig(x + 1, y)) {
      stack.push({x: x + 1, y: y});
    }
  }

  function pushLeft(x, y) {
    if (canDig(x - 1, y)) {
      stack.push({x: x - 1, y: y});
    }
  }

  function pushUp(x, y) {
    if (canDig(x, y - 1)) {
      stack.push({x: x, y: y - 1});
    }
  }

  function pushDown(x, y) {
    if (canDig(x, y + 1)) {
      stack.push({x: x, y: y + 1});
    }
  }

  function animate() {
    function timeout() {
      var done;
      setTimeout(function () {
        done = delveDeeper();
        world.render();
        if (!done) {
          timeout();
        }
      }, 0);
    }
    timeout();
  }

  function quickRender() {
    var done;
    while (!done) {
      done = delveDeeper();
    }
    world.render();
  }

  //animate();
  quickRender();
}

// Return the starting points of all passages created
function carvePassages(world) {
  var passages = [];
  function fn() {
    var tile = findStartingTile(world);
    if (tile) {
      passageCarver(world, tile.x, tile.y);
      tile.colour = world.stage[tile.y][tile.x];
      passages.push(tile);
      fn(world);
    }
  } fn(world);
  return passages;
}

function canDig(x, y) {
  if (world.stage[y] === undefined || world.stage[y][x] === undefined) {
    return false;
  }
  var adjacentStructures = 0;
  var adjacentTiles = calculateAdjacentTiles(x, y);
  _.forEach(adjacentTiles, function (tile) {
    if (world.getTile(tile.x, tile.y) > 0) {  // Can't be adjacent to anything other that rock
      adjacentStructures = adjacentStructures + 1;
    }
  });
  return adjacentStructures <= 2;  // A passage can connect to itself (of course)
}

function calculateAdjacentTiles(x0, y0) {
  'use strict';
  var tiles = [];
  for (var x = x0 - 1; x <= x0 + 1; x++) {
    for (var y = y0 - 1; y <= y0 + 1; y++) {
      tiles.push({x: x, y: y});
    }
  }
  return tiles;
}

function findAllConnectors(world) {
  'use strict';
  var connectors = [];
  for (var y = 0; y < world.y_max; y++) {
    for (var x = 0; x < world.x_max; x++) {
      if (world.getTile(x, y) === 0) {
        var w = world.getTile(x - 1, y) || 0;
        var e = world.getTile(x + 1, y) || 0;
        if (w !== 0 && e !== 0 && w !== e) {
          connectors.push({x: x, y: y, colour1: w, colour2: e});
          //world.stage[y][x] = 9999;  // TODO: remove this debugging logic
        }
        var n = world.getTile(x, y - 1) || 0;
        var s = world.getTile(x, y + 1) || 0;
        if (n !== 0 && s !== 0 && n !== s) {
          connectors.push({x: x, y: y, colour1: n, colour2: s});
          //world.stage[y][x] = 9999;
        }
      }
    }
  }
  return connectors;
}

/* 1. Pick a connector at random
 * 2. If it connects a new node keep it, else discard it
 * 3. Repeat until all nodes are connected
 */
function connectNodes(world, rooms, passages) {
  'use strict';
  var nodes = rooms.concat(passages);
  var nodesMap = {};
  _.forEach(nodes, function (node) {
    nodesMap[node.colour] = node;
  });
  //console.log(nodesMap);

  var connectors = findAllConnectors(world);
  connectors = _.shuffle(connectors);

  var graph = [];  // A list of the connected nodes
  // graph examples: [[132],[4], [56]]
  var keepers = [];
  var connector;
  while (connectors.length > 0) {
    console.log('graph:', graph);
    connector = connectors.pop();

    var connected = false;
    _.forEach(graph, function (node) {
      if (_.indexOf(node, connector.colour1 !== -1) || _.indexOf(node, connector.colour2 !== -1)) {
        connected = true;
      }
    });
    if (connected === false) {
      graph.push([connector.colour1, connector.colour2]);
      keepers.push(connector);
    } else {
      _.forEach(graph, function (node) {
        if (_.indexOf(node, connector.colour1 !== -1)) {
          if  (_.indexOf(node, connector.colour2 === -1)) {
            node.push(connector.colour2);
            keepers.push(connector);
          }
        } else if (_.indexOf(node, connector.colour2 !== -1)) {
          if (_.indexOf(node, connector.colour1 === -1)) {
            node.push(connector.colour1);
            keepers.push(connector);
          }
        }
      });
    }

  }
  console.log(keepers);
  return keepers;
}

function oddRng(min, max) {
  'use strict';
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
  'use strict';
	if (x === 0) { return x; }
	return _.floor(x / 2) * 2;
}

var colourGenerator = {
	count: 0,
  colours: [],
	next: function () {
		this.count++;
    this.colours.push(this.count);
		return this.count;
	}
};

var world = worldConstructor(18, 18);
var roomBuilder = roomBuilderConstructor(world, 100);
//roomBuilder.animate();
roomBuilder.quickRender();
world.passages = carvePassages(world);
connectNodes(world, roomBuilder.rooms, world.passages);
world.render();
