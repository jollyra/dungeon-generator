var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;
var canvas = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
var ctx = canvas.get(0).getContext("2d");
canvas.appendTo('body');

var ROCK = 0;
var PASSAGE = 1;

// The stage is a 2d array of tiles.
var y_max = 5;
var x_max = 5;

var drawTile = function (x, y, tile) {
	var tile_w = 5;
	var tile_h = 5;
	var TILES = {
		0: "#333300",  // Rock
		1: "#D6C2AD"   // Floor
	};
	// Draw a border around each tile.
	ctx.fillStyle = "#000000";
	ctx.fillRect(x * tile_w, y * tile_h, tile_w, tile_h);
	// Draw the tile over the border tile.
	ctx.fillStyle = TILES[tile];
	ctx.fillRect(x * tile_w + 1, y * tile_h - 1, tile_w - 1, tile_h - 1);
};

var worldConstructor = function (xsize, ysize) {
  "use strict";
  // Private
  var stage = initStage(xsize, ysize);

  function x_max() {
    if (stage && stage[0]) {
      return stage[0].length;
    } else {
      throw new Error('Where\'s my GODDAMN array? _stage = ', stage);
    }
  }

  function y_max() {
    if (stage) {
      return stage.length;
    } else {
      throw new Error('Where\'s my GODDAMN array? _stage = ', stage);
    }
  }

  function initStage(x, y) {
    var stage =  new Array(y);
    for(var i = 0; i < y; i++) {
      stage[i] = [];
      for(var j = 0; j < y; j++) {
        stage[i].push(0);
      }
    }
    return stage;
  }

  // Public
  var world = {
    getTile: function (x, y) {
      if (this.stage[y] === undefined || this.stage[y][x] === undefined) {
        return false;
      } else {
        return this.stage[y][x];
      }
    },

    render: function () {
      for(var y = 0; y < this.y_max; y++) {
        for(var x = 0; x < this.x_max; x++) {
          var tile = this.stage[y][x];
          drawTile(x, y, tile);
        }
      }
    }
  };

  var newWorld = Object.create(world);
  newWorld.y_max = y_max();
  newWorld.x_max = x_max();
  newWorld.stage = stage;
  return newWorld;
};
