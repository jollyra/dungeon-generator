var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;
var canvas = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
var ctx = canvas.get(0).getContext("2d");
canvas.appendTo('body');


// The stage is a 2d array of tiles.
var y_max = 5;
var x_max = 5;
var init =  function () {
	var stage =  new Array(y_max);
	_.fill(stage, _.fill(new Array(x_max), 0));
	return stage;
};

var drawTile = function (x, y, tile) {
	var tile_w = 5;
	var tile_h = 5;
	var TILES = {
		0: "#333300",  // Wall
		1: "#D6C2AD"   // Floor
	};
	ctx.fillStyle = TILES[tile];
	//console.log('x:', x * tile_w, 'y:', y * tile_h, 'x_w:', tile_w, 'y_w:', tile_h, 'tile:', TILES[tile]);
	ctx.fillRect(x * tile_w, y * tile_h, tile_w, tile_h);
};

var drawStage = function (stage) {
	for(i = 0; i < stage.y_max; i++) {
		for(k = 0; k < stage.x_max; k++) {
			var x = k;
			var y = i;
			var tile = stage.stage[y][x];
			drawTile(x, y, tile);
		}
	}
};

var Stage = {
	_stage: [
		[1, 1, 1, 1, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1]
	],
	x_max: function () {
		if (this._stage && this._stage[0]) {
			return this._stage[0].length;
		} else {
			throw new Error('Where\'s my GODDAMN array? _stage = ', this._stage);
		}
	},
	y_max: function () {
		if (this._stage) {
			return this._stage.length;
		} else {
			throw new Error('Where\'s my GODDAMN array? _stage = ', this._stage);
		}
	},
	// Optionally override with another stage.
	getStage: function (stage) {
		if (stage) {
			_.stage = stage;
		}
		return {
			stage: this._stage,
			y_max: this.y_max(),
			x_max: this.x_max()
		};
	}
}

//drawStage(Stage.getStage());
