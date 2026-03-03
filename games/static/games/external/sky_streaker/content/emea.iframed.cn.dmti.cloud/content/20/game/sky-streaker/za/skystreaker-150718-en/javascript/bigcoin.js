function bigcoin() {
	PIXI.Container.call( this );
	this.init();
}

bigcoin.prototype = new coin();


bigcoin.prototype.init = function() {
}

bigcoin.prototype.added = function() {
	this.a = addObj("bigcoin");
	this.a.img.play();
	this.a.img.animationSpeed = 0.5;
	this.addChild(this.a);
	
	g.coins.push(this);
	this.d = 5;
}

bigcoin.prototype.update = function() {
	// special?
	if (g.special == 1) {
		if (!this.got && g.p.y - 50*scG < this.y) {
			g.playztink = 1;
			this.got = 1;
		}
	}
	// cek got
	if (this.got) {
		if (this.d == 5) {
			soundPlay("zbonus");
			// CN Achievement -------------------------------------------------------
			g.bigcointotal++;
			if (g.bigcointotal >= 5) {
				sendstat(103, 1); // player collects 5 big coins in a run
			}
			// CN Achievement -------------------------------------------------------
		}
		// create 10 small coins
		var it1 = this.createCoin();
		var it2 = this.createCoin();
		it1.got = it2.got = 1;
		g.playztink = 1;
		this.visible = !this.visible;
		this.d--;
		if (!this.d) {
			this.die();
		}
	} else {
		this.cekmiss();
		this.cekout();
	}
}

bigcoin.prototype.createCoin = function() {
	var obj = new coin("coin");
	obj.x = this.x - 40*scG + fox.random(80*scG);
	obj.y = this.y - 40*scG + fox.random(80*scG);
	obj.added();
	g.m3.addChild(obj);
	return obj;
}