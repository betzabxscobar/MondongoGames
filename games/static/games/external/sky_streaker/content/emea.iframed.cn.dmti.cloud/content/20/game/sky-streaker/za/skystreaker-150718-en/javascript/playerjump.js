function playerjump() {
	PIXI.Container.call( this );
	this.init();
}

playerjump.prototype = new foxmovieclip();


playerjump.prototype.init = function() {
	this.a = new PIXI.Container()
	this.addChild(this.a);
	
	this.richardjump = addObj("playerjump", -55*scG, -8*scG);
	this.richardjump.img.play();
	this.richardjump.img.animationSpeed = 0.5;
	this.a.addChild(this.richardjump);
}

playerjump.prototype.added = function() {
	this.d = 15;
	this.xs = -this.x / this.d;
	this.ys = -100*scG;
	this.grav = 10*scG;
}

playerjump.prototype.loop = function() {
	this.x += this.xs;
	this.y += this.ys;
	this.ys += this.grav;
	this.d--;
	if (!this.d) {
		// create kids
		var obj = new kids();
		obj.y = g.startpos + 500*scG;
		g.m4.addChild(obj);
		// create player on pole
		g.p = new player();
		g.p.x = 0; 
		g.p.y = g.startpos;
		g.p.added();
		g.m4.addChild(g.p);
		// make hint
		fox.pophint(0, g.p.y - 200*scG, 1, 9999, 10, g.m4);
		g.gamestart = 1;
		// show multiplier (if any)
		if (g.coinmulti > 1) {
			commonclass.showcoinmultiplier();
		}
		if (g.scoremulti > 1) {
			commonclass.showscoremultiplier();
		}
		this.die();
	}
}