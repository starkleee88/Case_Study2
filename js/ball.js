let DEFAULT_DAMAGE_RANGE = 20;

class Ball{
	constructor(mapWidth, mapHeight){  
    
    this.minX = 0;
    this.minY = -mapHeight;
    this.maxX = mapWidth - this.radius;
    this.maxY = mapHeight - this.radius;  
	this.visible = false;
	}
	show(startX,startY,directionX,directionY,power,x2damage){
		this.speedX = directionX * power;
	    this.speedY = directionY * power;

	    this.cx = startX;
	    this.cy = startY;
		
		this.isX2Damage = x2damage;
		this.damageRange = DEFAULT_DAMAGE_RANGE*(x2damage?2:1); // x2 range và damage
		this.visible = true;
	}
	draw(context){    
	    if(this.visible)
		{
			context.fillStyle = "black";
			context.beginPath();    
			context.arc(this.cx,this.cy,4,0,Math.PI*2,true);
			context.closePath();
			context.fill();
		}
	}
	update(wind){
	    this.speedY += GRAVITY+wind.y;
		this.speedX += wind.x;

		this.energy = (this.speedY*this.speedY+this.speedX*this.speedX); // E = 1/2*m*v^2
		console.log(this.energy) 
		if(this.energy<1)
			this.energy = 1;
			
		this.cx += this.speedX;
	    this.cy += this.speedY;    
	    if(this.cx < this.minX || this.cx > this.maxX ||
	        this.cy < this.minY || this.cy > this.maxY)
	        return true;
	    return false;
	}
}