let MAX_HP = 700;
let RADIUS = 10;
let SPEED = 1;
class Cannon{
	constructor(map,x,y,color){
    this.map = map;        
    this.cx = x;
    this.cy = y;
    this.angle = 0;
    this.ball = null;
    this.cannonHeight = RADIUS/2; 
    this.cannonWidth = this.cannonHeight*3;    	
	this.color = color;
	this.isFalling = true;
	this.hp = MAX_HP;
	this.isDeath = false;
	this.canDoubleDamage = true;
	
	}
	draw(context){
	if(this.isDeath)
	{
		// Vẽ quan tài
		context.save();
		context.lineWidth = 3;
		context.strokeStyle = this.color;
		
		context.fillStyle = "black";
		context.beginPath();
		context.rect(this.cx-6,this.top,12,RADIUS*2);		
		context.fill();
		
		context.beginPath();
		context.moveTo(this.cx,this.top+1);
		context.lineTo(this.cx,this.bottom-1);
		context.stroke();
		
		context.beginPath();
		context.moveTo(this.cx-6,this.cy-3);
		context.lineTo(this.cx+6,this.cy-3);
		context.closePath();
		context.stroke();	
			
		context.restore();
	}else
	{		
		context.beginPath();
		context.fillStyle = this.color;
		context.arc(this.cx,this.cy,RADIUS,0,Math.PI*2,true);
		context.closePath();
		context.fill();
		
		context.fillStyle = "black";
		
		context.save();
		context.translate(this.cx,this.cy);
		context.rotate(this.angle);
		context.beginPath();
		
		context.rect(0,-this.cannonHeight/2,this.cannonWidth,this.cannonHeight);
		context.fill();		
		context.restore();	
		context.beginPath();
		context.arc(this.cx,this.cy,RADIUS/2,0,Math.PI*2,true);
		context.fillStyle = "white";
		context.fill();
		
		
		// Vẽ thanh hp
		context.fillStyle = "red";
		context.beginPath();
		let barWidth = RADIUS*2;
		let length = (this.hp/MAX_HP)*barWidth;
		context.rect(this.left,this.bottom + 5,barWidth,5);
		context.stroke();
		context.beginPath();
		context.rect(this.left,this.bottom + 5,length,5);
		context.fill();
		if(this.ball)
			this.ball.draw(context);    
		}
	}

	update(){
		
		if(!this.isDeath && this.bottom>=this.map.height)	
		{
			this.cy = this.map.height - RADIUS;
			this.isDeath = true;	
		}
		
		this.left = this.cx - RADIUS;
	    this.right = this.cx + RADIUS;
		this.top = this.cy - RADIUS;
	    this.bottom = this.cy + RADIUS;
		
		if(this.bottom<this.map.height && !this.map.contain(this.cx,this.bottom))
		{
			this.cy += 2;
			this.isFalling = true;
		}else
			this.isFalling = false;	   
	}

	fire(ball,power,x2damage){  
		if(this.isDeath || this.isFalling)
			return;
			
	    let dirX = Math.cos(this.angle);
	    let dirY = Math.sin(this.angle);
	    
	    let startX = this.cx + this.cannonWidth * dirX;
	    let startY = this.cy + this.cannonWidth * dirY;
		
	    ball.show(startX,startY,dirX,dirY,power,x2damage);  	
	}
	rotate(targetX, targetY){
	    let dx = targetX - this.cx;
	    let dy = targetY - this.cy;
	    this.angle = Math.atan2(dy,dx);
	}

	handleInputs(e){
		if(this.isFalling || this.isDeath)
			return;
		switch(e.keyCode)
		{
			case 65: // left arrow		
				this.move(-SPEED);
				break;		
			case 68: // right arrow
				this.move(SPEED);
				break;
			default:
			 break;
		}
	}
	move(speedX){
		if(this.isDeath)
			return;
		let px;
		if(speedX<0) // move left
			px = this.left;
		else
			px = this.right;
		
		if(!this.map.contain(px,this.cy))
		{
			this.cy -= 1;
			this.cx += speedX;
		}	
	}
	collide(ball){
		if(this.isDeath)
			return false;
			
		let dx = this.cx - ball.cx;
		let dy = this.cy - ball.cy;
		
		let d =  Math.sqrt(dx*dx+dy*dy);
		return d<=RADIUS;	
	}
	// Tính dmg
	calculateDamage(ball){
		if(this.isDeath)
			return 0;
		let dx = this.cx - ball.cx;
		let dy = this.cy - ball.cy;
			
		// Khoảng cách giữa 2 canon
		let d =  Math.sqrt(dx*dx+dy*dy);
		
		if(d<=ball.damageRange){
			
			let hp_lost = Math.floor(ball.energy+(200-100*d/ball.damageRange))*(ball.isX2Damage?2:1);
			this.hp -= hp_lost;
			
			if(this.hp<=0)
			{
				this.hp = 0;
				this.isDeath = true;
			}
			return hp_lost;
		}
		return 0;
	}
}