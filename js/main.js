let FPS = 60;   
let GRAVITY = 0.1;     
let TOTAL_PLAYERS = 3;
let MAX_FIREPOWER = 100;
let FIREPOWER_CHARGE_INTERVAL = 500;
let POWERBAR_WIDTH = 300;
let COLORS = ["Red","Lime","Cyan","Orange","Violet"];
let _canvas;
let _context;
let _timer;
let _currentPlayer = 0;
let _cannons = [];
let _keypressed = {};
let _map;

let _ball;
let _explosionSprite;
let _alivePlayers = TOTAL_PLAYERS;
let _firepower = 0; 
let _x2damage = false;
let _output;
let _imgLoader;

function clear() {
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
}

function init() {
	_canvas = document.getElementById("canvas");
	_context = _canvas.getContext("2d");
	_context.font = "20px Arial";
	_output = document.getElementById("output");
	_canvas.onkeydown = canvas_keyDown;
	_canvas.onmousemove = canvas_mousemove;
	_canvas.onmousedown = canvas_mousedown;
	_canvas.onmouseup = canvas_mouseup;
			console.log("a");
	_imgLoader = new ImgLoader(
	{ 
		background: "images/background.png",
		x2: "images/x2.png",
		explosion: "images/explosion.png"
		
	},
	null,
	function(images){
		_explosionSprite = new AnimatedSprite({
			mapWidth: _canvas.width,	
			mapHeight: _canvas.height,	
			image: images.explosion,	
			frameWidth: 64,	
			frameHeight: 64,	
			interval: 50,
			isLooping: false
		});
		_explosionSprite.addSprite({
			name: "abc",
			startFrame: 0,
			framesCount: 25
		});
		
		_map = new Map(images.background,_canvas.width,_canvas.height);
		_ball = new Ball(_canvas.width,_canvas.height);
		for(let i=0;i<TOTAL_PLAYERS;i++)
		{		
			_cannons[i] = new Cannon(_map,Math.floor(Math.random()*_canvas.width),20,COLORS[i]);
		}

		draw();
		
		_timer = window.setInterval(update,1000/FPS);
	}
	);

}
function draw() {
    clear();        
	_map.draw(_context);
	for(let i=0;i<_cannons.length;i++)
		_cannons[i].draw(_context);
	
	_ball.draw(_context);
	
	if(_explosionSprite)
	_explosionSprite.draw(_context);
	
	if(_alivePlayers<=1)
	{
		_context.fillStyle = "rgba(255,0,0,0.5)";
		let x = _canvas.width/6;
		let y = _canvas.height/3;
		_context.beginPath();
		_context.rect(x,y,x*4,y);
		_context.fill();
	
		_context.fillStyle = "white";
		if(_alivePlayers==0)		
			_context.fillText("Game Over!",_canvas.width/2-60,_canvas.height/2-5);
		else
			_context.fillText("Player "+_cannons[_currentPlayer].color+" win!",_canvas.width/2-60,_canvas.height/2-5);
	}

	// Vẽ phần mũi tên player
	_context.beginPath();
	_context.moveTo(_cannons[_currentPlayer].left, _cannons[_currentPlayer].bottom+25); // bottom-left
	_context.lineTo(_cannons[_currentPlayer].right, _cannons[_currentPlayer].bottom+25); // Bottom Right
	_context.lineTo(_cannons[_currentPlayer].cx, _cannons[_currentPlayer].bottom+15); // top
	
	_context.closePath();
	_context.fillStyle = "orange";
	_context.fill();
		
	// vẽ thanh năng lượng
	_context.beginPath();
	_context.rect((_canvas.width-POWERBAR_WIDTH)/2,_canvas.height-20,POWERBAR_WIDTH,10);
	_context.stroke();
	_context.beginPath();
	_context.rect((_canvas.width-POWERBAR_WIDTH)/2,_canvas.height-20,(_firepower/MAX_FIREPOWER)*(POWERBAR_WIDTH),10);
	_context.fill();
	// Vẽ item x2 dmg
	if(_cannons[_currentPlayer].canDoubleDamage)
	{	
		_context.drawImage(_imgLoader.images.x2,10,_canvas.height-20,20,20);
		_context.fillText("X",10,_canvas.height-30);
	}
}
function update() {
		
	if(_firepower>0 && _firepower<MAX_FIREPOWER)	
		_firepower++;		
		
	_map.update();	
	
	let exploded;
	let endTurn;
	// Check đạn nổ
	if(_ball.visible) 
	{					
		endTurn = _ball.update(_map.wind);
		
		if(!endTurn)
		{
			exploded =_map.collide(_ball);		
		
			if(!exploded)		
				for(let i=0;i<_cannons.length;i++)			
				{
					exploded = _cannons[i].collide(_ball);		
					if(exploded)
						break;
				}
		}
	}
	
	// Update cannon
	for(let i=0;i<_cannons.length;i++)
	{
		if(_cannons[i].isDeath)		
		{
			_cannons[i].update();
			continue;
		}
		_cannons[i].update();
		
		if(exploded)
		{
			let hp_lost = _cannons[i].calculateDamage(_ball);
			if(hp_lost>0)
				log(_cannons[i].color,": -"+hp_lost+" HP.");
		}
		if(_cannons[i].isDeath)
		{
			_alivePlayers--;
			log(_cannons[i].color," died.");
		}
	}
	if(endTurn || exploded || _cannons[_currentPlayer].isDeath)
		changeTurn(exploded);
	if(_explosionSprite)
		_explosionSprite.update();	
	
    draw();
}
function changeTurn(showExplosion){	
	
	if(_ball.visible)
	{
		_explosionSprite.setPostion(Math.floor(_ball.cx), Math.floor(_ball.cy), true);			
		_ball.visible = false;
	}
	
	if(_alivePlayers<1)
		return;
	if(showExplosion && _explosionSprite)
		_explosionSprite.show();

	_currentPlayer++;
	if(_currentPlayer>=TOTAL_PLAYERS)	
		_currentPlayer = 0;		
	if(_cannons[_currentPlayer].isDeath)
		changeTurn();

}
function canvas_mousemove(e){    
		
    let x = e.pageX - _canvas.offsetLeft;
    let y = e.pageY - _canvas.offsetTop;
    _cannons[_currentPlayer].rotate(x,y);
}
function canvas_mousedown(e){    
	if(_alivePlayers==1)
		return;
	if(_ball.visible || _cannons[_currentPlayer].isFalling || e.which!=1) // Nhận chuột trái
		return;
		_firepower = 1; // bắt đầu tăng thanh năng lượng
}
function canvas_mouseup(e){    
	
	if(_alivePlayers>1 && !_ball.visible && _firepower>0)
	{
		_cannons[_currentPlayer].fire(_ball,_firepower/10,_x2damage);	
		_x2damage = false;
		_firepower = 0;
	}
}
function canvas_keyDown(e){    
	
	_cannons[_currentPlayer].handleInputs(e);
	if(_cannons[_currentPlayer].canDoubleDamage && e.keyCode == 88) // Phím X
	{
		_x2damage = true;
		_cannons[_currentPlayer].canDoubleDamage = false;
	}
}

function log(color,msg){
	_output.innerHTML +="<span style='color: "+color+"'>"+color+"</span>"+msg+"</br>";
}
// onload
// window.onload = function(){
// 	init();
	
// }
function play(){
	let mode = document.getElementById("gamemode").value;
	// console.log(mode);
	switch(mode){
		case('player2'):
			TOTAL_PLAYERS = 2;
			break;
		case('player3'):
			TOTAL_PLAYERS = 3;
			break;
		case('player4 '):
			TOTAL_PLAYERS = 4;
			break;
		case('player5'):
			TOTAL_PLAYERS = 5;
	}
	init();
	
	document.getElementById("select").innerHTML=" ";
}