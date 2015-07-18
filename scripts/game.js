var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;
var canvas = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
var ctx = canvas.get(0).getContext("2d");
canvas.appendTo('body');


// The stage is a 2d array of tiles.
var y_max = 10;
var x_max = 10;
var tile_w = 10;
var tile_h = 10;
var stage =  new Array(this.y_max);
var init =  function () {
	_.fill(stage, _.fill(new Array(x_max), 0));
};
var drawTile = function (x, y, colour) {
	ctx.fillStyle = colour;
	console.log(x, y, tile_w, tile_h);
	ctx.fillRect(x, y, tile_w, tile_h);
};
var draw = function () {
	for(i = 0; i < y_max; i++) {
		for(k = 0; k < y_max; k++) {
			var c1 = "#FF0000";
			var c2 = "#0000FF";
			// Ternary operater for proof that iteration is working.
			drawTile(k * tile_w, i * tile_h, (k*i % 2 === 0 ? c1 : c2));
		}
	}
};


init();
draw();
