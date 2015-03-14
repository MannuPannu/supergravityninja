(function(exports) {

    // iPad events
    function setupPlayerEventsMobile(player) {
        var canJump = true;
        var canWalkIntoDoor = true;

        var TILT_NEUTRAL = "neutral",
            TILT_CCW = "counter-clockwise",
            TILT_CW = "clockwise";
        var TILT_THRESHOLD = 10;
        var currentTilt = TILT_NEUTRAL;

        function betaToTilt(beta) {
            if(Math.abs(beta) < TILT_THRESHOLD) {
                return TILT_NEUTRAL;
            } else if (beta >= TILT_THRESHOLD) {
                return TILT_CCW;
            } else if (beta <= -TILT_THRESHOLD) {
                return TILT_CW;
            }
        }

        gyro.frequency = 30;
        gyro.startTracking(function(o) {

            // `o` provides the three Euler angles (alpha, beta, gamma) telling the
            // orientation of the user's device. See here https://en.wikipedia.org/wiki/Euler_angles
            // for how they work.

            var newTilt = betaToTilt(o.beta);
            if(newTilt != currentTilt) {
                console.debug('Tilt went from ' + currentTilt + ' to ' + newTilt);
            }

            // FIXME: this would be clearer if the player object instead just
            // acted as a state machine - now we have to remember if we were
            // in "go left" or "go right" mode.
            switch(currentTilt) {
            case TILT_NEUTRAL:
                player.setGoLeft(false);
                player.setGoRight(false);
                break;
            case TILT_CCW:
                player.setGoRight(false);
                player.setGoLeft(true);
                break;
            case TILT_CW:
                player.setGoLeft(false);
                player.setGoRight(true);
                break;
            }

            // TODO: perhaps use the gamma angle to trigger up/down?

            currentTilt = newTilt;
        });

        // TODO: toggleGravity() on tap
    };

    function setupPlayerEventsDesktop(player) {

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
    };

    function isTouchDevice() {
      return ('ontouchstart' in window);
    };

    exports.events = {
        setupPlayerEvents: function(player) {
            if(isTouchDevice()) {
                return setupPlayerEventsMobile(player);
            } else {
                return setupPlayerEventsDesktop(player);
            }
        }
    };

})(window);
