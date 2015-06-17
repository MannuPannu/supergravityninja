var events = {

    setupEvents: function (player) {

        function isTouchDevice() {
            return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };

        function setupPlayerEventsMobile(player) {
            var canJump = true;
            var canWalkIntoDoor = true;

            //var TILT_NEUTRAL = "neutral",
            //    TILT_CCW = "counter-clockwise",
            //    TILT_CW = "clockwise";
            //var TILT_THRESHOLD = 10;
            //var currentTilt = TILT_NEUTRAL;

            //function betaToTilt(beta) {
            //    if (Math.abs(beta) < TILT_THRESHOLD) {
            //        return TILT_NEUTRAL;
            //    } else if (beta >= TILT_THRESHOLD) {
            //        return TILT_CCW;
            //    } else if (beta <= -TILT_THRESHOLD) {
            //        return TILT_CW;
            //    }
            //}

            //gyro.frequency = 60;
            //gyro.startTracking(function (o) {
            //    var newTilt = betaToTilt(o.beta);
            //    if (newTilt != currentTilt) {
            //        alert('Tilt went from ' + currentTilt + ' to ' + newTilt);
            //    }

            //    currentTilt = newTilt;
            //});

            // Jump on tap 

            document.body.addEventListener("touchstart", function(e) {
                if (canJump) {
                    player.jump(true);
                    canJump = false;
                }
            });

            document.body.addEventListener("touchend", function(e) {
                canJump = true;
            });
        };

        function setupPlayerEventsDesktop(player) {

            var canJump = true;
            var canWalkIntoDoor = true;

            function movePlayer(e, isKeyDown) {

                if (e.keyCode === actions.PLAYER_DOWN || e.keyCode === actions.ARROW_KEY_DOWN) {
                    player.setGoDown(isKeyDown);
                }

                if (e.keyCode === actions.PLAYER_UP || e.keyCode === actions.ARROW_KEY_UP) {
                    player.setGoUp(isKeyDown);

                }

                if (e.keyCode === actions.PLAYER_LEFT || e.keyCode === actions.ARROW_KEY_LEFT) {
                    player.setGoLeft(isKeyDown);
                }

                if (e.keyCode === actions.PLAYER_RIGHT || e.keyCode === actions.ARROW_KEY_RIGHT) {
                    player.setGoRight(isKeyDown);
                }

                if (e.keyCode === actions.ARROW_KEY_UP && isKeyDown) {
                    player.toggleGravity();
                }

                if (e.keyCode === actions.PLAYER_JUMP) {

                    if (isKeyDown && canJump) {
                        player.jump(isKeyDown);

                        canJump = false;
                    }

                    if (!isKeyDown) { //Key up
                        canJump = true;
                    }
                }

                e.preventDefault();
            }

            var actions = keyEnum;

            document.body.addEventListener("keydown", function(e) {
                movePlayer(e, true);
            });

            document.body.addEventListener("keyup", function(e) {
                movePlayer(e, false);
            });
        };

        if (isTouchDevice()) {
            return setupPlayerEventsMobile(player);
        } else {
            return setupPlayerEventsDesktop(player);
        }
    }
};