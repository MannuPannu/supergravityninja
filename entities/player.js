var player = function(x, y, speedX, speedY, img, screenWidth, screenHeight) {
	var name = name;

	var playerWeapon = weapon();

	var that = movableEntity(x, y, 64, 64, speedX, speedY, img, 0.5, 6, screenWidth, screenHeight, 0.5, 20);

	that.walkIntoDoor = false;

	that.canToggleGravity = false;

	that.getName = function() {
		return name;
	};

	that.update = function(map) {

		if(!that.died) {
			that.updateMovement(map);

			that.animationHelper.update();
		}
		else {
			that.animationHelper.playDeathAnimation();
		}

	};

    that.toggleGravity = function() {
        if (that.canToggleGravity) {
            that.gravityVel *= -1;
        }
    };

    that.isOverDoor = function() {
        return that.overDoor;
    };

	that.setMap = function(map) {
		that.x = map.playerStartPos.x;
		that.y = map.playerStartPos.y;

		that.canToggleGravity = map.canToggleGravity;
	};

	that.died = false;

	return that;
};
