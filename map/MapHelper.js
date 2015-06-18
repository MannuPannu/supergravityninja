
var MapHelper =  function (isMobile){

	var that = {};

	that.levels = ['doorintro', 'jumping', 'gravity', 'spikesintro', 
		'upsideintro' , 'upsideintro2', 'upsideintro3', 'bigjump_', 'upandjump_e', 'thedrop',
		'spikeandgravity', 'bigjump2', 'corridorrun_e', 'the_slide', 'bigjumpfly' , 'upandjump', 'corridorrun_h',
		  'upandjump_h', 'the_slide_insane_hell', 'the_slide_insane'];

	that.loadLevel = function (levelIndex) {

		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
  			xmlhttp = new XMLHttpRequest();
  		}
		else
  		{// code for IE6, IE5
  			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  		}

		xmlhttp.open("GET", 'map/mapfiles/' + that.levels[levelIndex] + ".tmx", false);		
		xmlhttp.send();
		xmlDoc = xmlhttp.response; 

		if (window.DOMParser)
	  	{
	  		parser=new DOMParser();
	  		xmlDoc=parser.parseFromString(xmlDoc,"application/xml");
	  	}
		else // Internet Explorer
	  	{
	  		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	  		xmlDoc.async=false;
	  		xmlDoc.loadXML(mapXML); 
	  	}

	  	var mapNode = xmlDoc.getElementsByTagName("map")[0];

	  	var mapWidth = parseInt(mapNode.getAttribute("width"));
	  	var mapHeight = parseInt(mapNode.getAttribute("height"));
	  	var tileWidth = parseInt(mapNode.getAttribute("tilewidth"));
	  	var tileHeight = parseInt(mapNode.getAttribute("tileheight"));

	  	//Get tilesets
		var tileSetsXML = mapNode.getElementsByTagName("tileset");

		var tileSets = [];

		for(var i = 0; i < tileSetsXML.length; i++){
			var tileSetXML = tileSetsXML[i];

			var image = tileSetXML.getElementsByTagName("image")[0];

			var imageWidth = parseInt(image.getAttribute("width"));
			var imageHeight = parseInt(image.getAttribute("height"));
			var imageSrc = image.getAttribute("source");

			var firstGid = parseInt(tileSetXML.getAttribute("firstgid"));
			var name = tileSetXML.getAttribute("name");
			var tileWidth = parseInt(tileSetXML.getAttribute("tilewidth"));
			var tileHeight = parseInt(tileSetXML.getAttribute("tileheight"));

			var _tileSet = tileset(firstGid, name, tileWidth, tileHeight, imageSrc, imageWidth, imageHeight);

			tileSets.push(_tileSet);
		}

		//Get layers
		var layersXML = mapNode.getElementsByTagName("layer");
		var layers = [];

		for(var i = 0; i < layersXML.length; i++) {
			var dataXML = layersXML[i].getElementsByTagName("data")[0];

			//Get layer tiles
			var tilesXML = dataXML.getElementsByTagName("tile");
			var tiles = [];

			for(var j = 0; j < tilesXML.length; j++){

				var tileXML = tilesXML[j];

				var gid = parseInt(tileXML.getAttribute("gid"));

				var _tile = tile(gid);
				tiles.push(_tile);
			
			}

			var _layer = layer(layersXML[i].getAttribute("name"), layersXML[i].getAttribute("width"), layersXML[i].getAttribute("height"),
				tiles);

			layers.push(_layer);
		}

		var playerStartPos = {x: 0, y: 0 };
		var levelStartText = "";
		var canToggleGravity = false;
		var scrollable = true;

		//Get map properties
		var propertiesNodeXML = mapNode.getElementsByTagName("properties")[0];

		var properties = propertiesNodeXML.getElementsByTagName("property");

		for(var i = 0; i < properties.length; i++) {
		
			if(properties[i].getAttribute("name") === 'playerstart') {
				var playerStartPosLst = properties[i].getAttribute("value").split(",");

				playerStartPos.x = parseInt(playerStartPosLst[0]);
				playerStartPos.y = parseInt(playerStartPosLst[1]);
			}

		    if (properties[i].getAttribute("name") === 'starttext') {
		        if (properties[i].getAttribute("value").indexOf(';') >= 0) {

		            var startTexts = properties[i].getAttribute("value").split(";");


		            if (!isMobile) {
		                levelStartText = startTexts[0];
		            } else {
		                levelStartText = startTexts[1];
		            }

		        } else {
		            levelStartText = properties[i].getAttribute("value");
		        }
		    }

		    if(properties[i].getAttribute("name") === 'togglegravity') {
				canToggleGravity = parseInt(properties[i].getAttribute("value")) === 1 ? true : false;
			}			


			if(properties[i].getAttribute("name") === 'scrollable') {
				scrollable = parseInt(properties[i].getAttribute("value")) === 1 ? true : false;
			}	
		};

	  	var _map = map(0, 0, mapWidth, mapHeight, tileWidth, tileHeight, tileSets, layers, playerStartPos, levelStartText, canToggleGravity, scrollable);

	  	return _map;
	}

	return that;
};