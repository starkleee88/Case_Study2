let AnimatedSprite = function(data) {
	this.init(data);
	this.isFinished = false;
	this.currentSprite = null;
	this.currentFrame = 0;
	this.lastTick = 0;
};

AnimatedSprite.prototype = {
	show: function(){
		this.isFinished = false;
		this.currentFrame = 0;
	},
	setPostion: function(x,y,isCenter){
		if(isCenter)
		{
			x = x-this.frameWidth/2;
			y = y-this.frameHeight/2;			
		}
		
		this.left = x;
		this.top = y;
		
	},
	init: function(data)
	{
		if(data){

			this.isLooping = data.isLooping;
			if(typeof this.isLooping!="boolean")
				this.isLooping = true;

			this.image = data.image;
			this.frameWidth = data.frameWidth;
			this.frameHeight = data.frameHeight || this.frameWidth;

			this.sprites = [];
			this.interval = data.interval;

			this.left = data.left;
			this.top = data.top;
			this.width = data.width || this.frameWidth;
			this.height = data.hegiht || this.frameHeight;

			this.onCompleted = data.onCompleted;
		}
	},
	addSprite: function(data){
		this.sprites[data.name]={
			name : data.name,
			startFrame : data.startFrame || 0,
			framesCount : data.framesCount || 1,
			framesPerRow : Math.floor(this.image.width/this.frameWidth)
		};

		this.currentSprite = this.currentSprite || this.sprites[data.name];
	},
	setSprite: function(name){
		if(this.currentSprite != this.sprites[name])
		{
			this.currentSprite = this.sprites[name];
			this.currentFrame = 0;
		}
	},
	update: function(){
		if(this.isFinished)
			return;
		let newTick = (new Date()).getTime();
		if(newTick-this.lastTick>=this.interval)
		{
			this.currentFrame++;

			if(this.currentFrame==this.currentSprite.framesCount)
			{
				if(this.isLooping)
					this.currentFrame=0;
				else
				{
					this.isFinished = true;
					if(this.onCompleted)
						this.onCompleted();
				}

			}
			this.lastTick = newTick;
		}

	},
	draw: function(context){

		if(this.isFinished)
			return;
		let realIndex = this.currentSprite.startFrame+this.currentFrame;
		let row = Math.floor(realIndex/this.currentSprite.framesPerRow);
		let col = realIndex % this.currentSprite.framesPerRow;

		context.drawImage(this.image,col*this.frameWidth,row*this.frameHeight,
		this.frameWidth,this.frameHeight,this.left,this.top,this.width,this.height);

	}
}
