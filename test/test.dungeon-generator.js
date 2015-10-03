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
});
