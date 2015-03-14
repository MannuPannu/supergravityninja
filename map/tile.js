var tile = function (gid) {

	var that = {};
	that.gid = gid;
	that.solid = false;
	that.deadly = false;
	that.door = false;

	that.offsetRight = 0;
	that.offsetLeft = 0;
	that.offsetTop = 0;
	that.offsetBottom = 0;

	if(gid){
		that.solid = (gid === 1);
	
		that.door = gid >= 6 && gid <= 10;

		that.deadly = (gid >= 2 && gid <= 5);

		if(that.deadly) {

			//Create some offsets, because not the whole tile is deadly only part of it.
			if(gid === 2|| gid === 4) { //Up spike
				that.offsetTop = 2;
				that.offsetBottom = 2;
				that.offsetRight = 5;
				that.offsetLeft = 5;
			}
			else if(gid === 3 || gid === 5) { //Right spike

				that.offsetLeft = 2;
				that.offsetRight = 2;
				that.offsetTop = 5;
				that.offsetBottom = 5;
			}
		}
	}

	return that;
};