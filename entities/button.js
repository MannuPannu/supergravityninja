var Button = function(x, y, image){
	var that = {};		

	that.x = x;
    that.y = y;
	that.image = image;

	that.draw = function(context){
		context.drawImage(that.image, window.innerWidth - 200, 10);	
	};

	that.contains = function(x, y){
		return x < that.x + that.image.width && that.x < x && y < that.y + that.image.height && that.y < y;
	};

	that.setImage = function(image) {
		that.image = image;		
	};

	return that;
};
