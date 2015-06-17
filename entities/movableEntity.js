var movableEntity = function(x, y, width, height, speedX, speedY, img, accelSpeed, maxSpeed, screenWidth, screenHeight, gravityVel, jumpPower) {
	var speedX = speedX;
	var speedY = speedY;

	var maxSpeed = 5;

    var maxGravity = 12;

	var that = entity(x, y, width, height, img);

	var goUp = false;
    var goDown = false;
    var goRight = false;
    var goLeft = false;

    var jump = false;
    
    var canJump = false;

    that.isJumping = true;
    that.isRunning = false;

    var accelSpeed = 1.3;
    var jumpAccelSped = 0.23;

    var frictionGround = 0.5;
    var frictionAir = 0.05;

    that.gravityVel = 0.6;
    var jumpPower = 12;

    var moveInAirFactor = 0.1;

    var closeLimit = 0.6;

    that.overDoor = false;

    that.offsetLeft = 13;
    that.offsetRight = 12;
    that.offsetTop = 8;

    // that.offsetLeft = 0;
    // that.offsetRight = 0;
    // that.offsetTop = 0;

    //Cap values if entity is smaller than collision box   
    function applyFriction() {

        var frictionToApply = frictionGround;

        if(!that.isJumping) {
            //Friction behaves different when player is in air and on ground
        	if(speedX < 0) {
        		speedX = speedX + frictionToApply;

        	}
            else if(speedX > 0) {
        		speedX = speedX - frictionToApply;
        	}

            if(speedX < closeLimit && -closeLimit < speedX) {
                speedX = 0;
            }
        }
    };

    function applyGravity() {
        if(-maxGravity < (speedY + that.gravityVel) && (speedY + that.gravityVel) < maxGravity){
            speedY += that.gravityVel;
        }
    };

	that.setGoDown = function(val) {
		goDown = val;
	};

	that.setGoUp = function(val) {
		goUp = val;
	};

	that.setGoLeft = function(val) {
        that.direction = 0;
		goLeft = val;
	};

	that.setGoRight = function(val) {
        that.direction = 1;
		goRight = val;
	};

    that.jump = function(val) {
        jump = val;
    };

	that.updateMovement = function(map) {

        //Is jumping ?
        if(jump && !that.isJumping) {

            if(that.gravityVel < 0){
                speedY += jumpPower;    
            }    
            else {
                speedY -= jumpPower;
            }

            jump = false;

            canJump = false;
        }
        else {
            jump = false;
        }

        applyFriction();

        that.updateSpeed();
        that.tryMove(speedX, speedY, map);

        applyGravity();
    	
        //Limit player to screen

        if(that.x < 0) {
            speedX = 2;
            that.x = 0;
        }

        if(that.x + that.width > screenWidth){
            speedX = -2;
            that.x = screenWidth - that.width;
        }

        //Is Jumping ?
        if(that.isOnGround(map)){
            that.isJumping = false;
        }
        else {
            that.isJumping = true;
        }

        //Is running ?
        if(speedX != 0) {
            that.isRunning = true;
        }
        else {
            that.isRunning = false;
        }

        //Check if enitity is over door
        if(that.collidingTileDoor(that.getTilesEntityCollidesWith(that.x, that.y, map))) {
            that.overDoor = true;
        }
        else {
            that.overDoor = false;
        }

        //Check if player is outside map, then die :)
        if(map.isEntityOutside(that)){
            that.died = true;
        }
        
	};

    that.isOnGround = function(map) {  

        //Is on ground depends which gravity it is
        if(that.gravityVel > 0) {
            var tiles = map.getTilesInRect({x: that.x + that.offsetLeft, y: that.y + that.height + 2, 
                width: that.width - that.offsetLeft - that.offsetRight, height: 5 }); 

        }
        else if(that.gravityVel < 0){
            var tiles = map.getTilesInRect({x: that.x + that.offsetLeft, y: that.y - 50, width: that.width - that.offsetLeft - that.offsetRight,
             height: 40});   
        }

        var isAnySolid = false;

        for(var i = 0; i < tiles.length; i++) {

            if(tiles[i].tile.solid) {
                isAnySolid = true;
            }
        }

        if(isAnySolid)
        {
            return true;
        }
        else{
            return false;
        }
    };
    
    that.tryMove = function(moveX, moveY, map) {

        if(moveX === 0 && moveY === 0){
            return;
        }

        var collidingTilesX = that.getTilesEntityCollidesWith(that.x + moveX, that.y, map);

        if(that.posValid(collidingTilesX)){
            
            //Scroll map if player reaches a certain point on the screen
            if(moveX > 0)
            {
                if(that.x > screenWidth - (screenWidth / 3) && map.scrollable) {
                    map.posX -= moveX;
                }
                else {
                    that.x += moveX;
                }

            }
            else if(moveX < 0)
            {
                if(that.x < screenWidth / 3 && map.scrollable) {
                    map.posX -= moveX;
                }
                else {
                    that.x += moveX;
                }
            }
            
        } else {
            speedX = 0;
        }

        var collidingTilesY = that.getTilesEntityCollidesWith(that.x, that.y + moveY, map);

        if(that.posValid(collidingTilesY)) {

            //Scroll map
            if(moveY > 0) {

                if(that.y > screenHeight * 3 / 4 && map.scrollable) {
                    map.posY -= moveY;
                }
                else {
                    that.y += moveY;    
                }
            }
            else if (moveY < 0){

                if(that.y < screenHeight / 4 && map.scrollable) {
                    map.posY -= moveY;
                }
                else {
                    that.y += moveY;
                }
            }
        
        }
        else {

            while(true) {

                if(speedY < 0 && that.gravityVel > 0) {
                    that.y -= 1;

                    var collidingTiles = that.getTilesEntityCollidesWith(that.x, that.y, map);

                    if(!that.posValid(collidingTiles)) {
                        //offset y a little from the other object
                        that.y += 1;
                        break;
                    }
                }
                else if(speedY > 0 && that.gravityVel < 0) {
                    that.y += 1;

                    var collidingTiles = that.getTilesEntityCollidesWith(that.x, that.y, map);

                    if(!that.posValid(collidingTiles)) {
                        //offset y a little from the other object
                        that.y -= 1;
                        break;
                    }
                }
                else {

                    break;
                }
            }

             speedY = 0;
        }  
    };

    that.getTilesEntityCollidesWith = function(newX, newY, map) {

        //Get tiles this entity is over (added some offesets since sprite is wider and taller)
        //Should be more general (later)
        
        var tilesInRect = that.gravityVel >= 0 ? map.getTilesInRect({x: newX + that.offsetLeft , y: newY + that.offsetTop , 
                                                                     width: that.width - that.offsetLeft - that.offsetRight, 
                                                                    height: that.height - that.offsetTop })

                                              : map.getTilesInRect({x: newX + that.offsetLeft, 
                                                                    y: newY + that.offsetTop - 6, 
                                                                    width: that.width + -that.offsetLeft - that.offsetRight, 
                                                                    height: that.height - that.offsetTop });

        return tilesInRect;
    };

    that.posValid = function(collidingTiles){
         var posValid = true;

         for(var i = 0; i < collidingTiles.length; i++) {
            if(collidingTiles[i].tile.solid){
                return false;
            }

            else if(collidingTiles[i].tile.deadly)
            {
                that.died = true; //Not so good having side effects in this "pure" function
            }
        }

        return true;
    };

    that.collidingTileDoor = function(collidingTiles) {
        for (var i = 0; i < collidingTiles.length; i++) {
            //Check if game over
            if (collidingTiles[i].tile.door) {
                return true;
            }
        }

        return false;
    };

    //Calculates the next position this entity will be at, if applying the current x and y speeds
    that.updateSpeed = function() {

        var curAccelSpeed = accelSpeed;

        //Player is not able to move so good in air
        curAccelSpeed *= that.isJumping ? moveInAirFactor : 1;
        //  if (goUp) {
        //     if(Math.abs(speedY - curAccelSpeed) < maxSpeed) {
        //         speedY -= curAccelSpeed;
        //     }
             
        // }

        //  if (goDown) {
        //     if(Math.abs(speedY - curAccelSpeed) < maxSpeed) {
        //         speedY += curAccelSpeed;
        //     }
            
        // }

        if (goLeft) {
            if(Math.abs(speedX - curAccelSpeed) < maxSpeed) {
                speedX -= curAccelSpeed;
            }
            
        }

        if(goRight) {
            if(Math.abs(speedX + curAccelSpeed) < maxSpeed) {
                speedX += curAccelSpeed;   
            }
        }   
    };

    that.stop = function() {
        speedX = 0;
        speedY = 0;
    };

	return that;
};