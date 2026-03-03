function coin() {
	PIXI.Container.call( this );
	this.init();
}

coin.prototype = new foxmovieclip();


coin.prototype.init = function() {	
	this.got = 0;
}

coin.prototype.added = function() {
	this.a = addObj("coin");
	this.a.img.play();
	this.a.img.animationSpeed = 0.5;
	this.addChild(this.a);
	
	g.coins.push(this);
	this.ro = 45;
	this.dv = 8;
	this.gyminadd = -10*scG + fox.random(20*scG);
	if (fox.random(100) > 50) {
		this.a.scale.x = this.a.scale.y = -1;
		this.ro = -this.ro;
	}
	if (this.x < 0) {
		this.scale.x = -1;
	}
}

coin.prototype.update = function() {
	// special?
	if (g.special == 1) {
		if (!this.got && g.p.y - 50*scG < this.y) {
			g.playztink = 1;
			this.got = 1;
		}
	}
	// cek got
	if (this.got) {
		if (this.got == 1) {
			this.got = 2;
			g.coingot += g.coinmulti;
			this.cekcoinmulti();
			// init floating
			this.a.frange = 20*scG + fox.random(5*scG);
			this.a.fspeed = 3*scG + fox.random(3*scG);
			this.a.fstartx = this.a.x;
			this.a.fxs = this.a.frange;
		}
		this.fly();
	} else {
		this.cekmiss();
		this.cekout();
	}
}

// cek miss
coin.prototype.cekmiss = function() {
	if (this.y > g.p.y) {
		var udapopmiss = 0;
		if (g.usecoinmulti && (g.coinmulti > g.coinmultistart)) {
			g.coinmulti = g.coinmultistart;
			g.coinmultistep = g.coinmultistepnormal;
			g.coincombo = 0;
			if (g.coinmulti > 1) {
				commonclass.showcoinmultiplier();
			}
			fox.popdisplayobject("miss", g.m4, this.x, this.y - (0.5 * this.height) - 20*scG, 20, 10, 0, 0);
			soundPlay("zmiss");
			udapopmiss = 1;
		}
		if (g.usescoremulti && (g.scoremulti > g.scoremultistart)) {
			g.scoremulti = g.scoremultistart;
			g.scoremultistep = g.scoremultistepnormal;
			g.scorecombo = 0;
			if (g.scoremulti > 1) {
				commonclass.showscoremultiplier();
			}
			if (!this.udapopmiss) {
				fox.popdisplayobject("miss", g.m4, this.x, this.y - (0.5 * this.height) - 20*scG, 20, 10, 0, 0);
				soundPlay("zmiss");
			}
		}
	}
}

// cek out of cekout
coin.prototype.cekout = function() {
	if (this.y > g.gymax + 40*scG) {
		this.die();
	}
}

// cek coin multi
coin.prototype.cekcoinmulti = function() {
	if (g.usecoinmulti && (g.coinmulti < g.coinmultimax)) {
		g.coincombo++;
		if (g.coincombo >= g.coinmultistep) {
			g.coincombo = 0;
			g.coinmultistep += 10;
			g.coinmulti++;
			commonclass.showcoinmultiplier();
			// CN Achievement -------------------------------------------------------
			if ((g.coinmulti >= 6) && (g.obstaclepic == "shirt4")) {
				sendstat(104, 1); // player gets a 6x coin multiplier at the school
			}
			// CN Achievement -------------------------------------------------------
		}
	}
}

// fly
coin.prototype.fly = function() {
	this.a.rotation += this.ro;
	this.x = this.x + (0 - this.x) / this.dv;
	this.y = this.y + (g.gymin + this.gyminadd - this.y) / this.dv;
	this.dv = Math.max(1, 0.95 * this.dv);
	if (Math.abs(this.x) < 10*scG && Math.abs(g.gymin + this.gyminadd - this.y) < 20*scG &&
		Math.abs(this.a.x) < 20*scG) {
		this.die();
	}
	fox.xfloating(this.a);
}

coin.prototype.die = function() {
	fox.removevalue(this, g.coins);
	fox.removevalue(this, arClips);
	if (this.parent){
		this.parent.removeChild(this)
	}
}