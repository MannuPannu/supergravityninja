# supergravitygirl
A game where you travel through dangerous levels avoiding spikes using your power to change gravity.


** HOWO run this locally **

1. Start a local python web server in the same dir as index.html

	 python simplehttpserver 8000 

2. Goto "localhost:8000" in any browser


** HOWTO upload this online **

1. Install node (if u havent already, its really nice :))

In root folder do:

2. Run "npm install" to install node dependencies
3. Run "grunt build" to create a folder called "prod" with all content
4. Upload the content of "prod" to any web server

***

** HOWTO create levels for this game **

1. Download Tiled, a free map editor software from http://www.mapeditor.org/

2. Open any .tmx file in map/mapfiles

3. Change the map to your liking and save it to for example foo.tmx 
	NOTE! You cannot change tilesets or any images because the game will crash when trying to load
	the game. The game is hardcoded when it reads the number of tilessets and in what order they come
	like map tileset comes first etc. The things you can edit is the map layout like tiles, spikes and door positions as well as start position of player. 

4. To add the map to the game, goto MapHelper.js and add the the map foo.tmx to the list "that.levels" 