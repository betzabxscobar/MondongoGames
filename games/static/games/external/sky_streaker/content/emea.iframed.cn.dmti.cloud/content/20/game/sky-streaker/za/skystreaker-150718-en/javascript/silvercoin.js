function silvercoin() {
	PIXI.Container.call( this );
	this.init();
}

silvercoin.prototype = new coin();


silvercoin.prototype.init = function() {
}

silvercoin.prototype.added = function() {
	this.a = addObj("silvercoin");
	this.a.img.play();
	this.a.img.animationSpeed = 0.5;
	this.addChild(this.a);
	
	g.coins.push(this);
	this.d = 3;
}

silvercoin.prototype.update = function() {
	// special?
	if (g.special == 1) {
		if (!this.got && g.p.y - 50*scG < this.y) {
			g.playztink = 1;
			this.got = 1;
		}
	}
	// cek got
	if (this.got) {
		if (this.d == 3) {
			soundPlay("zbonus");
		}
		// create 5 small coins
		var it1 = this.createCoin();
		if (this.d > 0) {
			var it2 = this.createCoin();
			it2.got = 1;
		}
		it1.got = 1;
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

silvercoin.prototype.createCoin = function() {
	var obj = new coin("coin");
	obj.x = this.x - 40*scG + fox.random(80*scG);
	obj.y = this.y - 40*scG + fox.random(80*scG);
	obj.added();
	g.m3.addChild(obj);
	return obj;
}