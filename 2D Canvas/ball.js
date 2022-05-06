
class Ball{
    constructor(mapWidth, mapHeight,startX,startY,directionX,directionY,power){
        // the "life-zone"
        this.minX = this.radius;
        this.minY = this.radius;
        this.maxX = mapWidth - this.radius;
        this.maxY = mapHeight - this.radius;
     
        this.speedX = directionX * power;
        this.speedY = directionY * power;
     
        this.cx = startX;
        this.cy = startY;
    }
     
    draw(context){
        context.fillStyle = "black";
        context.beginPath();
        context.arc(this.cx,this.cy,4,0,Math.PI*2,true);
        context.closePath();
        context.fill();
    }
    update(){
        this.speedY += GRAVITY;
        this.cx += this.speedX;
        this.cy += this.speedY;
        if(this.cx < this.minX || this.cx > this.maxX ||
            this.cy < this.minY || this.cy > this.maxY)
            return true;
        return false;
    }
}