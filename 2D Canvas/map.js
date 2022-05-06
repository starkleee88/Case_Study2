function Map(width,height){
    var buffer = document.createElement("canvas");
    buffer.width = width;
    buffer.height = height;
    var context = buffer.getContext("2d");
    var offsetX = 0;
    var self = this;
    var ready = false;
    var imageData = null;
 
    // create map
    context.beginPath();
    context.moveTo(0,Math.floor(Math.random()*buffer.height));
    var x=0;
    var step = Math.floor(buffer.width/10);
    for(var i=1;i<10;i++)
    {
        x += Math.floor(Math.random()*step)+step;
        context.lineTo(x,Math.floor(Math.random()*buffer.height/2)+100);
    }
    // line to bottom-right corner
    context.lineTo(buffer.width,buffer.height);
    // line to bottom-left corner
    context.lineTo(0,buffer.height);
 
    context.fillStyle = "green";
    context.fill();
    imageData = context.getImageData(0,0,buffer.width,buffer.height);
    this.draw = function(ctx){
 
        offsetX++;
        if(offsetX>width)
            offsetX = 0;
 
        ctx.drawImage(buffer,0,0,width,height);
 
    };
this.contain = function(x,y){
    if(!imageData)
        return false;
    var index = Math.floor((x+y*width)*4+3);
    return imageData.data[index]!=0;
}
 
this.collide = function(x,y){
    if(this.contain(x,y))
    {
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "white";
        context.beginPath();
        context.arc(x,y,20,0,Math.PI*2,true);
        context.fill();
        context.restore();
        imageData = context.getImageData(0,0,width,height);
        return true;
    }
    return false;
};
}