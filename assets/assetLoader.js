/* Loads all the assets for this game */

var assetLoader = function() {

	var playerImage = new Image();
	playerImage.src = "assets/img/ninja.png";

	var introScreen = new Image();
	introScreen.src = "assets/img/introscreen.png";

	var speakerImage = new Image();
	speakerImage.src = "assets/img/speaker_white.png";

	var muteImage = new Image();
	muteImage.src = "assets/img/mute_white.png";

	var methods = {
		playerImage: playerImage,
		introScreen: introScreen,
		speakerImage: speakerImage,
		muteImage: muteImage
	};

	return methods;
};
