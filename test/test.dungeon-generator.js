describe('dungeon generator', function() {
    describe('#joinGraphs(forest, indexOfG1, indexOfG2)', function() {
        it('should join g1 and g2 into a single graph', function() {
            var forest = [[1,2], [3,4]];
            var g1 = 0;
            var g2 = 1;
            expect(dungeonGen._joinGraphs(forest, g1, g2)).to.eql([[1,2,3,4]]);
        });

        it('should join a large and small graph into a single graph', function() {
            var forest = [[1,2,3,4], [5,6]];
            var g1 = 0;
            var g2 = 1;
            expect(dungeonGen._joinGraphs(forest, g1, g2)).to.eql([[1,2,3,4,5,6]]);
        });

        xit('should throw an index out of bounds exception', function() {
            var forest = [[1,2]];
            var g1 = 0;
            var g2 = 1;
            expect(dungeonGen._joinGraphs).withArgs(forest, g1, g2).to.throwException(/Index out of bounds/);
        });

        it('should join two graphs and leave the third', function() {
            var forest = [[1,2], [5,6], [7,8]];
            var g1 = 1;
            var g2 = 2;
            expect(dungeonGen._joinGraphs(forest, g1, g2)).to.eql([[1,2],[5,6,7,8]]);
        });
    });

    describe('#canDig(world, x, y, colour)', function() {
        var testWorld = new dungeonGen._World('fakeDiv', 3, 3);

        it('should confirm diggable tile', function() {
          testWorld.stage = [
              [1,1,1,],
              [0,0,0,],
              [0,0,0,],
          ];
            var colour = 1;
            expect(dungeonGen._canDig(testWorld, 1, 1, colour)).to.eql(true);
        });

        it('should not confirm diagonal diggable tile', function() {
            testWorld.stage = [
                [1,1,1,],
                [1,0,0,],
                [0,0,0,],
            ];
            var colour = 1;
            expect(dungeonGen._canDig(testWorld, 2, 1, colour)).to.eql(false);
        });

        it('should not confirm surrounded diggable tile', function() {
            testWorld.stage = [
                [1,1,1,],
                [1,0,0,],
                [0,0,0,],
            ];
            var colour = 1;
            expect(dungeonGen._canDig(testWorld, 1, 1, colour)).to.eql(false);
        });

        it('should not confirm tile that is already dug', function() {
            testWorld.stage = [
                [1,1,1,],
                [1,0,0,],
                [0,0,0,],
            ];
            var colour = 1;
            expect(dungeonGen._canDig(testWorld, 0, 0, colour)).to.eql(false);
        });
    });
});
