function balloon() {
	PIXI.Container.call( this );
	this.init();
}

balloon.prototype = new coin();


balloon.prototype.init = function() {
}

balloon.prototype.added = function() {
	this.a = addObj("balloon",0,0,scG);
	this.addChild(this.a);
	
	g.coins.push(this);
	fox.initxfloat(this.a, 1.2, 0.7);
	fox.inityfloat(this.a, 2, 0.1);
}

balloon.prototype.update = function() {
	fox.xfloating(this.a);
	fox.yfloating(this.a);
	if (this.got) {
		soundPlay(fox.getrandom("sfxlaughs"));
		g.special = 1;
		this.die();
	} else {
		this.cekout();
	}
}