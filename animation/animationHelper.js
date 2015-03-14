//Animates a tile during interval set 

var animationHelper = function(animationTileSet, entity, runningFrameRate) {

	var animationTileSet = animationTileSet;

	var entity = entity;

	var that = {};

	var runningAnimationInterval = {};
	var runningAnimationStarted = false;
	var currentRunningFrame = 0; //Means standing still
	var yPosRunningFrame = 0;

	var blinkLeftImg = {x: 64, y: 32};

	var blinkRightImg = {x: 96, y: 32};

	var deadImg = {x: 64, y: 64};

	var waitingToBlink = false;
	var isBlinking = false;

	var waitForBlinkTimeOut = {};
	var blinkTimeOut = {};

	that.drawCurImage = function(context){

		var upSideDownOffset = that.getIsUpsideDown() ? animationTileSet.height / 2 : 0;

		if(entity.died) {
			context.drawImage(animationTileSet, deadImg.x, deadImg.y + 2, entity.width / 2, entity.height / 2, entity.x, entity.y, 64, 64);
		}
		else if(!isBlinking || entity.isRunning || entity.isJumping) {
			context.drawImage(animationTileSet, that.getDirection() + that.isJumping(), 
				yPosRunningFrame + upSideDownOffset, 
				entity.width / 2, 
				entity.height / 2, 
				entity.x, 
				entity.y, 
				64, 
				64);
		}
		else {
			if(entity.direction === 0) {
				context.drawImage(animationTileSet, blinkLeftImg.x, blinkLeftImg.y + upSideDownOffset, entity.width / 2, entity.height / 2, entity.x, entity.y, 64, 64);	

			}
			else if(entity.direction === 1) {
				context.drawImage(animationTileSet, blinkRightImg.x, blinkRightImg.y + upSideDownOffset, entity.width / 2, entity.height / 2, entity.x, entity.y, 64, 64);	
			}
		}

		context.restore();
	};

	that.getDirection = function() {
		if(entity.direction === 0) {
			return 0;
		}
		else if(entity.direction === 1) {
			return 1 * entity.width / 2;
		}
	};

	that.getIsUpsideDown = function () {
		return entity.gravityVel <0;
	}

	that.update = function(){

		that.updateRunningAnimation();
	};

	that.isJumping = function() {
		if(entity.isJumping) {
			return 64;
		}
		else return 0;
	};

	that.isRunning = function() {
		return entity.isRunning;
	};

	//Functions for player is running
	that.updateRunningAnimation = function() {

		if(that.isRunning() && !that.isJumping() && !runningAnimationStarted) {

			runningAnimationInterval = setInterval(function() { that.tickRunningFrame() }, runningFrameRate);
			runningAnimationStarted = true;
		}
		
		if((!that.isRunning() || that.isJumping()) && runningAnimationStarted) {
			clearInterval(runningAnimationInterval);
			runningAnimationStarted = false;

			currentRunningFrame = 0; //Show player standing still
			yPosRunningFrame = 0;
		}		 
	};

	that.tickRunningFrame = function () {
		currentRunningFrame += 1;

		var yPos = currentRunningFrame * (entity.height / 2);	

		if(yPos >= animationTileSet.height / 2 ){
			currentRunningFrame = 0;
			yPos = 0;
		}

		yPosRunningFrame = yPos; 
	};
	

	that.waitForBlink = function () {

		var rand = Math.round(Math.random() * 1000 + 2000);
	
	    waitForBlinkTimeOut = setTimeout(function() {
	    		
	    		isBlinking = true;
	    		blinkTimeOut = setTimeout(function() { //Time how long to blink
	    		 	isBlinking = false;
	    		 	that.waitForBlink();
	    		 }, 90);
	    	}, rand);
	};	

	that.waitForBlink();

	return that;
};