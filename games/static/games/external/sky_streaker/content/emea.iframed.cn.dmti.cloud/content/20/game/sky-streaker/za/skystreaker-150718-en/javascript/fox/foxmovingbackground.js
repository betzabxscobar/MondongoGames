function foxmovingbackground(name, xspeed, yspeed, widt, heig) {
	PIXI.Container.call( this );
	this.init(name, xspeed, yspeed, widt, heig);
}

foxmovingbackground.prototype = new foxmovieclip();

foxmovingbackground.prototype.init = function(name, xspeed, yspeed, widt, heig) {
	if(xspeed){}else{xspeed = 0};
	if(yspeed){}else{yspeed = 0};
	if(widt){}else{widt = 0};
	if(heig){}else{heig = 0};
	
	this.bgname = name;
	this.xs = xspeed;
	this.ys = yspeed;
	this.bwid = widt;
	this.bhei = heig;
	this.added();
}

foxmovingbackground.prototype.added = function() {
	this.setall();
	arClips.push(this);
}

foxmovingbackground.prototype.loop = function() {
	if (!this.xs) {
		this.a.y = (this.a.y + this.ys) % this.bhei;
	} else {
		this.a.x = (this.a.x + this.xs) % this.bwid;
	}
}

// set all
foxmovingbackground.prototype.setall = function() {
	var mc1 = fox.make(this.bgname, 0, 0, this.a);
	var mc2 = fox.make(this.bgname, 0, 0, this.a);
	if (!this.xs){
		mc2.y = this.bhei;
	} else {
		mc2.x = this.bwid;
	}
}