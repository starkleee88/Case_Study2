function Map(backgroundImg,width,height){
	this.width = width;
	this.height = height;
	
	let centerX = width/2;
	let buffer = document.createElement("canvas");
	buffer.width = width;
	buffer.height = height;
	let context = buffer.getContext("2d");
	let offsetX = 0;
	
	// Vẽ map random
	context.beginPath();
	context.moveTo(0,Math.floor(Math.random()*buffer.height));
	let x=0;
	let step = Math.floor(buffer.width/20);
	for(let i=1;i<20;i++)
	{
		x += Math.floor(Math.random()*step)+step;
		context.lineTo(x,Math.floor(Math.random()*buffer.height/2)+buffer.height/2);
	}
	// line to bottom-right corner
	context.lineTo(buffer.width,buffer.height);
	// line to bottom-left corner
	context.lineTo(0,buffer.height);
	context.closePath();
	// context.clip();
	// context.drawImage(texture,0,0,width,height);
	context.fillStyle = "green";
	context.fill();
	imageData = context.getImageData(0,0,buffer.width,buffer.height);

	// imageData = context.getImageData(0,0,buffer.width,buffer.height);

		
	let lastTick = 0;
	// Thay đổi hướng gió mỗi 20s
	let windChangeInterval = 20000; 
	this.wind = {x: 0,y: 0};
	
	this.update = () =>{
		let newTick = (new Date()).getTime();
		if(newTick-lastTick>=windChangeInterval)
		{
			lastTick = newTick;
			
			this.wind.x = (Math.random()-Math.random())/30;
			this.wind.y = (Math.random()-Math.random())/30;
		}
	};
	this.draw = (ctx) =>{

		offsetX+=0.2;
		if(offsetX>width)
			offsetX = 0;
			
		// Background chạy
		ctx.drawImage(backgroundImg,offsetX,0,width-offsetX,height,0,0,width-offsetX,height);
		ctx.drawImage(backgroundImg,0,0,offsetX,height,width-offsetX,0,offsetX,height);
		
		ctx.drawImage(buffer,0,0,width,height);	
		ctx.fillStyle = "black";
		
		let fromx = centerX;
		let fromy = 20;
		let tox = fromx+this.wind.x*1000;
		let toy = fromy+this.wind.y*1000;
		
		ctx.fillStyle = "rgba(255,0,0,0.3)";
		ctx.beginPath();
		ctx.arc(fromx,fromy,20,0,Math.PI*2,true);
		ctx.fill();
		// Vẽ mũi tên chỉ hướng gió
		let headsize = 5;   
		let angle = Math.atan2(this.wind.y,this.wind.x);
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.lineTo(tox-headsize*Math.cos(angle-Math.PI/6),toy-headsize*Math.sin(angle-Math.PI/6));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox-headsize*Math.cos(angle+Math.PI/6),toy-headsize*Math.sin(angle+Math.PI/6));				
		ctx.stroke();

	};
	this.contain = (x,y) => {
		if(!imageData)
			return false;
		let index = Math.floor((x+y*width)*4+3);
		return imageData.data[index] && imageData.data[index]!=0;
	}
	
	this.collide = (ball) => {	
		let x = Math.floor(ball.cx);
		let y = Math.floor(ball.cy);
		if(this.contain(x,y))
		{	
			context.save();
			context.globalCompositeOperation = "destination-out";
			context.fillStyle = "rgba(0,0,0,1)";
			context.beginPath();    
			context.arc(x,y,ball.damageRange,0,Math.PI*2,true);
			context.fill();
			context.restore();
			imageData = context.getImageData(0,0,width,height);
			return true;
		}
		return false;
	};
}

