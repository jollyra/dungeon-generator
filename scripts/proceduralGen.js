var x_m = 50;
var y_m = 50;

function emptyStage(x, y) {
	var stage =  new Array(y);
	_.fill(stage, _.fill(new Array(x), 0));
	return stage;
};

/* Tries a certain number of times to place random sized rooms within the
 * constraints of the supplied stage. Rooms must not overlap.
 */
function placeRooms(stage, numTries) {
	var rooms = [];
	function randomRoom() {
		return {
			h: _.random(3, 8),
			w: _.random(3, 8),
		}
	}
	function checkCollisions(rooms, room) {
		return false
	}
	for(i = 0; i < numTries; i++) {
		var room = randomRoom();
		if (checkCollisions() === false) {
			rooms.push(room);
		} else {
			console.log('placeRooms: room: ', room, 'has collision.');
		}
	}
	return rooms;
}

var emptyStage = emptyStage(x_m, y_m);
var stage = Stage.getStage(emptyStage);
drawStage(stage);
