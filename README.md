#Build Dungeons With Code

An implementation of Bob Nystrom's [dungeon generation algorithm](http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/).

Try it! http://jollyra.github.io/dungeon-generator

1. Randomly place some rooms
2. Fill the remaining space with a maze
3. Connect all nodes together creating a spanning tree
4. Add back some connectors depending on desired connectedness
4. Trim the passages back making them sparse
