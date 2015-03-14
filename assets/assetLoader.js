/* Loads all the assets for this game */

var assetLoader = function() {

	var playerImage = new Image();
	playerImage.src = "assets/img/supergirl.png";

	var methods = {
		playerImage: playerImage
	};

	return methods;
};