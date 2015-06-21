var requestAnimFrame = (function(){
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function(callback, element){
           window.setTimeout(callback, 1000 / 60);
         };
})();

window.onload = function () {

    var mobile = false;

	//Check for mobile or desktop
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
	{
		mobile = true;	
	}

	var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;

    window.DEBUG_MODE = false;
    window.FRAMERATE = 50;

    var mapHelper = MapHelper(mobile);

    var texthandler = TextHandler(width);

    var currentLevel = 0;
    var killCount = 0;

    var runningTimeStart = 0;
    var elapsedTime = 0;
    var timer;

    var _assetLoader = assetLoader();

    var ninja, gameOver, map;

    var initGameTimeOut = {};
    var initiatingGame = false;

    var showIntroScreen = true;
    var showEndGameScreen = false;

    var speakerButton = Button(window.innerWidth /2 + 350 , 50, _assetLoader.speakerImage);

    var teleprompterX = width + 100;

    document.body.addEventListener("keydown", startGame);

    var introMusic = new Howl({
        urls: ['assets/sound/ninja1.mp3'],
        loop: true,
        autoplay:true 
    });

    var viewFullScreenButton = $("#view-fullscreen");

	//Setup full screen button when mobile
	if(mobile) {
		viewFullScreenButton.on("click", function() {
	   	
		    if (canvas.requestFullscreen) {
		        canvas.requestFullscreen();
			}
		    else if (canvas.msRequestFullscreen) {
		        canvas.msRequestFullscreen();
			}
		    else if (canvas.mozRequestFullScreen) {
		        canvas.mozRequestFullScreen();
			}
		    else if (canvas.webkitRequestFullScreen) {
		        canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		});
	}
	else {
		viewFullScreenButton.css("display", "none");
	}

    var introMusicMuted = false;
    // //When clicking canvas with mouse mute music
    $("#canvas").on("click", function (e) {
		if (speakerButton.contains(e.pageX, e.pageY)) {
		    if (!introMusicMuted) {
		        introMusicMuted = true;
		        introMusic.mute();
		        speakerButton.setImage(_assetLoader.muteImage);
		    } else {
		        introMusicMuted = false;
		        introMusic.unmute();
		        speakerButton.setImage(_assetLoader.speakerImage);
		    }
		} else {
		    startGame();
		}
    });

    function startGame(e) {
        showIntroScreen = false;
        showEndGameScreen = false;

        $("#canvas").off();

        //Stop intro music
        initGame();
        introMusic.stop();
    }

    function initGame() {
        
        currentLevel = 0;

        startTimer();

        clearTimeout(initGameTimeOut);
        gameOver = false;
     
        ninja = player(0,0, 0, 0, _assetLoader.playerImage, width, height);

        loadLevel();
        document.body.removeEventListener("keydown", startGame);
        events.setupEvents(ninja);

        initiatingGame = false;
    };

    function restartLevel() {
        ninja.died = false;
        ninja.gravityVel = Math.abs(ninja.gravityVel);
        ninja.stop();
        loadLevel();
        initiatingGame = false;
    };

    function loadLevel() {
        if(mapHelper.levels.length <= currentLevel){
            gameOver = true;
            return;
        }

        map = mapHelper.loadLevel(currentLevel);

        texthandler.setLevelText(map.levelStartText);

        ninja.setMap(map); 
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);

        ////Always make sure canvas is resized if window size changes
        //width = canvas.width = window.innerWidth;
        //height = canvas.height = window.innerHeight;

        if(gameOver) {
            showEndGameScreen = true;
            stopTimer();
            gameOver = false;
            document.body.addEventListener("keydown", startGame);
			$("#canvas").on("click", startGame);	
        }

        if(showIntroScreen)
        {
            renderIntroScreen();
            teleprompterX -= 4;

            if (teleprompterX < -6500) {
                teleprompterX = width + 100;
            }
        }
        else if (showEndGameScreen){
            renderEndGameScreen();
        }
        else {

            if(!ninja.died) {
                update();
            }

        	render();

            if((ninja.died) && !initiatingGame) {
                initGameTimeOut = setTimeout(restartLevel, 1000);
                initiatingGame = true;
                killCount += 1;
            }

            if(ninja.isOverDoor()) {
                currentLevel += 1;
                loadLevel();
            }
        }
    };  

    function render() {

        //render
        context.fillStyle = "#000000";
        context.fillRect(0, 0, width, height);
        
        map.render(context, ninja, width, height); 

        ninja.render(context);

        texthandler.renderText(context);

        //Debug time
        //  var elapsedTimeObj = secondsToTime(elapsedTime);
        // context.fillText(elapsedTimeObj.minutes + ":" + (elapsedTimeObj.seconds < 10 ? "0" : "") + elapsedTimeObj.seconds, 900, 400);
    };

    function renderIntroScreen() {
        context.fillStyle = "#000000";
        context.fillRect(0, 0, width, height);
        context.font = "20px press_start_2pregular";
        
        context.fillStyle = "#333333";
        context.drawImage(_assetLoader.introScreen, window.innerWidth / 5, window.innerHeight / 9 - 100);

        //Create teleprompter
        context.fillStyle = "#FFFFFF";
        context.fillText("Game design, programming, music and gfx done by: Magnus Stenqvist @ Tape Worm Productions. Contact: magnus.p.stenqvist@gmail.com. DONE: Added mobile support! You can now play in your phone, yeah! TODO: Add better steering capability while tilting device. Add scoreboard. Add awesome outro sequence. Last but not least: Hi mom!"
            , window.innerWidth / 22 + teleprompterX, 25);

        context.fillStyle = "#00FFCC";
        context.fillText("Press key/touch screen to start!", window.innerWidth / 5 + 150, window.innerHeight / 9 + (400));

        //Draw black boxes wich acts as borders
        context.fillStyle = "#000000";
        context.fillRect(0, 0, window.innerWidth / 5, height);
        context.fillRect((window.innerWidth / 5) + _assetLoader.introScreen.width, 0, width - ((window.innerWidth / 5) + _assetLoader.introScreen.width), height);
        speakerButton.draw(context);
    };

     function renderEndGameScreen() {
        context.fillStyle = "#000000";
        context.fillRect(0, 0, width, height);
        context.font = "25px press_start_2pregular";
        context.fillStyle = getColorEffect();

        context.fillText("Congratulations!", 400, 200);
        context.font = "20px press_start_2pregular";
        context.fillText("You saved the world!", 400, 300);
        context.fillText("Deaths: ", 300, 400);

        context.fillStyle = "#E6E6E6";

        context.fillText(killCount.toString(), 500, 400);
        context.fillStyle = getColorEffect();
        context.fillText("Running time: ", 600, 400);
        context.fillStyle = "#E6E6E6";
        var elapsedTimeObj = secondsToTime(elapsedTime);
        context.fillText(elapsedTimeObj.minutes + ":" + (elapsedTimeObj.seconds < 10 ? "0" : "") + elapsedTimeObj.seconds, 900, 400);

        context.fillStyle = getColorEffect();
        context.fillText("Press any key/Touch screen to restart!", 350, 600);
    };

    var g = 100;
    var r = 100;
    var b = 150;

    var goUp = true;

    function getColorEffect() {

        if(goUp) {
            b += 4;
            g += 1;
            r += 1;    
        }
        else {
            b -= 4;
            g -= 1;
            r -= 1;    
        }

        if(b > 255) {
            goUp = false;
        }

        if(b < 150) {
            goUp = true;
        }

        return 'rgb(' + r + ',' + g + ',' + b +')';
    };

    function update() {
        ninja.update(map);
    };
    
    gameLoop();

    function startTimer() {

        runningTimeStart = new Date().getTime();

        timer = setInterval(function()
        {
            var time = new Date().getTime() - runningTimeStart;

            elapsedTime = Math.floor(time / 100) / 10;
            if(Math.round(elapsedTime) == elapsedTime) { elapsedTime += '.0'; }
        }, 100);
    };

    function stopTimer() {
        clearInterval(timer);
    };

    function secondsToTime(secs)
    {
        var hours = Math.floor(secs / (60 * 60));
       
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
     
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
       
        var obj = {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };

        return obj;
    }
};
