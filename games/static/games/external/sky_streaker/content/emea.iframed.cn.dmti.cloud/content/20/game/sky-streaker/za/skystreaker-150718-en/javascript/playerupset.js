function playerupset() {
	PIXI.Container.call( this );
	this.init();
}

playerupset.prototype = new foxmovieclip();


playerupset.prototype.init = function() {
	this.a = new PIXI.Container();
	this.addChild(this.a);
	
	this.d = 10;
	this.ys = -22*scG;
	this.grav = 2*scG;
	
	this.obj = addObj(g.upsetani, 0-7*scG, -20*scG+11*scG);
	this.obj.img.play();
	this.obj.img.animationSpeed = 0.5;
	this.a.addChild(this.obj);
	arClips.push(this);
}

playerupset.prototype.loop = function() {
	this.y += this.ys;
	this.ys += this.grav;
	this.d--;
	
	if(this.obj.img.currentFrame >= this.obj.img.totalFrames-1){
		this.obj.img.stop();
	}
	
	if (!this.d) {
		soundPlay("zuuh");
	}
	if (this.y > g.gymax + 100*scG) {
		g.endgame = 1;
		this.die();
	}
}