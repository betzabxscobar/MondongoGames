function obstacle() {
	PIXI.Container.call( this );
	this.init();
}

obstacle.prototype = new foxmovieclip();


obstacle.prototype.init = function() {
	this.a = new PIXI.Container()
	this.addChild(this.a);
}

// added
obstacle.prototype.added = function() {
	g.obstacles.push(this)
	this.energy = 100;
	fox.make(g.obstaclepic, 0, 0, this.a);
}

obstacle.prototype.update = function() {
	if (this.y > g.gymax+40*scG || !this.energy) {
		this.die();
	}
}

obstacle.prototype.die = function() {
	fox.removevalue(this, g.obstacles);
	if(this.parent){
		this.parent.removeChild(this);
	}
}