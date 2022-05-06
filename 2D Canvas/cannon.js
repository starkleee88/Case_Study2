
class Cannon{

    constructor (mapWidth, mapHeight,x,y){
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.radius = 10;
        this.speed = 5;
        this.power = 3;
        this.cx = x;
        this.cy = y;
        this.angle = 0;
        this.balls = [];
        this.cannonHeight = this.radius/2;
        this.cannonWidth = this.cannonHeight*3;
    }
    draw(context){
        context.beginPath();
        context.fillStyle = "blue";
        context.arc(this.cx,this.cy,this.radius,0,Math.PI*2,true);
        context.closePath();
        context.fill();
     
        context.save();
        context.translate(this.cx,this.cy);
        context.rotate(this.angle);
        context.beginPath();
        context.fillStyle = "red";
        context.rect(0,-this.cannonHeight/2,this.cannonWidth,this.cannonHeight);
        context.closePath();
        context.fill();
        context.restore();
     
        context.beginPath();
        context.fillStyle = "yellow";
        context.arc(this.cx,this.cy,this.radius/2,0,Math.PI*2,true);
        context.closePath();
        context.fill();
     
        for(var i=0;i<this.balls.length;i++)
        {
            this.balls[i].draw(context);
        }
    }
     
    update(map){
        if(!map.contain(this.cx,this.cy+this.radius))
            this.cy += this.speed;
        for(var i=0;i<this.balls.length;i++)
        {
            var item = this.balls[i];
            var x = Math.floor(item.cx);
            var y = Math.floor(item.cy);
            if(item.update() || map.collide(x,y))
            {
                this.balls.splice(i,1);
            }
        }
    }

     
    fire(targetX, targetY){
        var dx = targetX - this.cx;
        var dy = targetY - this.cy;
        var power = Math.floor(Math.sqrt(dx*dx+dy*dy)/20);
     
        if(this.balls.length > 5)
            return;
        var dirX = Math.cos(this.angle);
        var dirY = Math.sin(this.angle);
     
        var startX = this.cx + this.cannonWidth * dirX;
        var startY = this.cy + this.cannonWidth * dirY;
     
        var ball = new Ball(this.mapWidth,this.mapHeight,startX,startY,dirX,dirY,power);
        this.balls.push(ball);
    }
    rotate(targetX, targetY){
        var dx = targetX - this.cx;
        var dy = targetY - this.cy;
        this.angle = Math.atan2(dy,dx);
    }
}