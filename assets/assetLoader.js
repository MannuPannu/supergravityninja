/* Loads all the assets for this game */

var assetLoader = function() {

	var playerImage = new Image();
	playerImage.src = "assets/img/ninja.png";

	var introScreen = new Image();
	introScreen.src = "assets/img/introscreen.png";


	var methods = {
		playerImage: playerImage,
		introScreen: introScreen
	};

	return methods;
};