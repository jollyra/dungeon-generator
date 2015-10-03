describe('dungeon generator', function() {
    describe('#joinGraphs(forest, indexOfG1, indexOfG2)', function() {
        it('should join g1 and g2 into a single graph', function() {
            var forest = [[1,2], [3,4]],
                g1 = 0,
                g2 = 1;
            expect(dungeonGen._joinGraphs(forest, g1, g2)).to.eql([[1,2,3,4]]);
        });
    });
});
