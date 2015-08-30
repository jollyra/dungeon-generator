var initCanvas = function () {
  "use strict";
  var CANVAS_WIDTH = 980;
  var CANVAS_HEIGHT = 720;

  function initCanvasInternal() {
    var canvas = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
    var ctx = canvas.get(0).getContext("2d");
    canvas.appendTo('body');
    return ctx;
  }

  return initCanvasInternal();
};

var graphicsConstructor = function () {
  "use strict";
  var graphics = {
    drawTile: function (x, y, colour) {
      var tile_w = 10;
      var tile_h = 10;
      var TILES = {
        0: "#333300",  // Rock
        1: "#1b85b8",
        2: "#c8cb77",
        3: "#559e83",
        4: "#ae5a41",
        5: "#c3cb71"
      };
      // Draw a border around each tile.
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(x * tile_w, y * tile_h, tile_w, tile_h);
      // Draw the tile over the border tile.
      if (colour === 0) {
        this.ctx.fillStyle = TILES[colour];
      } else if (colour === 'visited') {
        this.ctx.fillStyle = "#ffffff";
      } else {
        this.ctx.fillStyle = TILES[(colour % 5) + 1];
      }
      this.ctx.fillRect(x * tile_w + 1, y * tile_h - 1, tile_w - 1, tile_h - 1);
    }
  };

  var newGraphics = Object.create(graphics);
  newGraphics.ctx = initCanvas();
  return newGraphics;
};

var worldConstructor = function (xsize, ysize) {
  "use strict";
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
          this.graphics.drawTile(x, y, tile);
        }
      }
    }
  };

  var newWorld = Object.create(world);
  newWorld.y_max = y_max();
  newWorld.x_max = x_max();
  newWorld.stage = stage;
  newWorld.graphics = graphicsConstructor();
  return newWorld;
};
