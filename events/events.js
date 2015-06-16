var events = {
    setupPlayerEvents: function (player) {

        var canJump = true;
        var canWalkIntoDoor = true;

    	function movePlayer (e, isKeyDown) {

    		if(e.keyCode === actions.PLAYER_DOWN || e.keyCode === actions.ARROW_KEY_DOWN){
				player.setGoDown(isKeyDown);        		
        	}

        	if(e.keyCode === actions.PLAYER_UP || e.keyCode === actions.ARROW_KEY_UP){
				player.setGoUp(isKeyDown);        		

        	}

        	if(e.keyCode === actions.PLAYER_LEFT || e.keyCode === actions.ARROW_KEY_LEFT){
				player.setGoLeft(isKeyDown);        		
        	}

        	if(e.keyCode === actions.PLAYER_RIGHT || e.keyCode === actions.ARROW_KEY_RIGHT){
				player.setGoRight(isKeyDown);        		
        	}

            if(e.keyCode === actions.ARROW_KEY_UP && isKeyDown){
                
                player.toggleGravity();
            }

            if(e.keyCode === actions.ARROW_KEY_DOWN){
                if(isKeyDown && canWalkIntoDoor) {
                    player.tryWalkIntoDoor();
                    canWalkIntoDoor = false;

                }

                if(!isKeyDown) {
                    canWalkIntoDoor = true;
                }
            }

        	if(e.keyCode === actions.PLAYER_JUMP) {

                if(isKeyDown && canJump) {
        		  player.jump(isKeyDown);

                  canJump = false;
                }

                if(!isKeyDown){ //Key up
                    canJump = true;
                }   

        	}

            e.preventDefault();
        }

    	var actions = keyEnum;

        document.body.addEventListener("keydown", function(e){
        	movePlayer(e, true);	
        });

        document.body.addEventListener("keyup", function(e) {
        	movePlayer(e, false);
        });
    }
};
