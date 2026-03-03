function kids() {
	PIXI.Container.call( this );
	this.init();
}

kids.prototype = new foxmovieclip();


kids.prototype.init = function() {
	this.a = new PIXI.Container();
	this.addChild(this.a);
	
	this.darwin = addObj("darwinclimb", -26*scG, 6*scG);
	this.darwin.img.play();
	this.darwin.img.animationSpeed = 0.5;
	this.a.addChild(this.darwin);
	this.gumball = addObj("gumballclimb", 32*scG, -1*scG, 0.5*scG, -1);
	this.gumball.img.play();
	this.gumball.img.animationSpeed = 0.5;
	this.a.addChild(this.gumball);
	this.darwin2 = addObj("darwinslide", -26*scG, -1*scG);
	this.a.addChild(this.darwin2);
	this.gumball2 = addObj("gumballslide", -26*scG, -2*scG);
	this.a.addChild(this.gumball2);
	
	this.ny = this.y = g.p.y + 500*scG;
	this.uda = 0;
	this.wait = 100;
	this.range = 400*scG;
	this.ystart1 = 0;
	this.ystart2 = 100*scG;
	this.ys = this.ysnormal = -6*scG;
	this.speedmax = -20*scG;
	this.ys1 = this.ys2 = 1*scG;
	this.ty1 = this.ystart1;
	this.ty2 = this.ystart2;
	this.darwin.y = this.ystart1 + 10*scG;
	this.gumball.y = this.ystart2 + 10*scG;
	this.darwin2.visible = this.gumball2.visible = false;
	this.d = 100;
	
	arClips.push(this);
}

kids.prototype.loop = function() {
	this.move();
	this.movekids();
	this.switchup();
	this.cekhit();
	this.cekfail();
}

// switch up
kids.prototype.switchup = function() {
	this.d--;
	if (this.d < 0) {
		this.d = 100 + fox.random(100);
		var foo = this.ystart1;
		this.ystart1 = this.ystart2;
		this.ystart2 = foo;
	}
}

// cek fail
kids.prototype.cekfail = function() {
	if (g.pull1 == 2) {
		// push kids back
		this.range = 500*scG;
		this.ny = this.y = g.p.y + this.range;
		this.ys = Math.min(this.ysnormal, 0.6*this.ys);
		this.darwin.y = this.ystart1 + 10*scG;
		this.gumball.y = this.ystart2 + 10*scG;
		this.darwin.visible = this.gumball.visible = true;
		this.darwin2.visible = this.gumball2.visible = false;
		g.pull1 = g.pull2 = g.hit = 0;
		this.wait = 30;
	}
}

// cekhit
kids.prototype.cekhit = function() {
	if (!g.hit) {
		// cek pulling
		if (!g.pull1 && (this.y + this.darwin.y < g.p.y + 50*scG)) {
			g.pull1 = 1;
			this.darwin.visible = false;
			// g.hit = true;
		}
		if (!g.pull2 && (this.y + this.gumball.y < g.p.y + 50*scG)) {
			g.pull2 = 1;
			this.gumball.visible = false;
			// g.hit = true;
		}
	}
}

// move
kids.prototype.move = function() {
	if (g.special == 1) {
		// do nothing
		if (!this.wait) {
			this.wait = 50;
			// reduce speed a bit
			this.ys = Math.min(this.ysnormal, this.ys-2*scG);
		}
	} else {
		if (!this.wait) {
			if (g.score > 0) {
				// difficulty get harder
				this.ny = Math.min(g.p.y + this.range, this.ny + this.ys);
				this.y = this.y + (this.ny - this.y) / 4;
				if (this.ys > -10*scG) {
					this.ys = Math.max(this.speedmax, this.ys - 0.01*scG);
				} else if (this.ys <= -10*scG && this.ys > -13*scG) {
					this.ys = Math.max(this.speedmax, this.ys - 0.005*scG);
				} else if (this.ys <= -13*scG && this.ys > -16*scG) {
					this.ys = Math.max(this.speedmax, this.ys - 0.002*scG);
				} else {
					this.ys = Math.max(this.speedmax, this.ys - 0.001*scG);
				}
				this.range = Math.max(300*scG, this.range - 0.5*scG);
			} else {
				// before game begins
				this.ny = this.y + this.ys;
				this.y = this.ny;
			}
		} else {
			this.wait = Math.max(0, this.wait - 1);
		}
	}
	if (g.hit) {
		this.ys *= 0.98;
	}
}

// move kids
kids.prototype.movekids = function() {
	if (!g.hit) {
		this.darwin.y += this.ys1;
		this.gumball.y += this.ys2;
		if ((this.ys1 > 0 && this.darwin.y > this.ty1) || (this.ys1 < 0 && this.darwin.y < this.ty1)) {
			this.darwin.y = this.ty1;
			this.ty1 = 10*scG + fox.random(30*scG);
			this.ys1 = 1*scG + 0.1 * fox.random(10*scG);
			if (this.ystart1 + this.ty1 < this.darwin.y) {
				this.ty1 = this.ystart1 - this.ty1;
				this.ys1 = -this.ys1;
			} else {
				this.ty1 = this.ystart1 + this.ty1;
			}
		}
		if ((this.ys2 > 0 && this.gumball.y > this.ty2) || (this.ys2 < 0 && this.gumball.y < this.ty2)) {
			this.gumball.y = this.ty2;
			this.ty2 = 10*scG + fox.random(30*scG);
			this.ys2 = 1*scG + 0.1 * fox.random(10*scG);
			if (this.ystart2 + this.ty2 < this.gumball.y) {
				this.ty2 = this.ystart2 - this.ty2;
				this.ys2 = -this.ys2;
			} else {
				this.ty2 = this.ystart2 + this.ty2;
			}
		}
	} else {
		// slide down
		if (!this.uda) {
			this.darwin.visible = this.gumball.visible = false;
			this.darwin2.visible = this.gumball2.visible = true;
			this.darwin2.x = this.darwin.x;
			this.darwin2.y = this.darwin.y;
			this.gumball2.x = this.gumball.x;
			this.gumball2.y = this.gumball.y;
			this.uda = 1;
		}
		this.darwin2.y += this.ys1;
		this.gumball2.y += this.ys2;
		this.ys1 = Math.max(0, this.ys1 + 2*scG);
		this.ys2 = Math.max(0, this.ys2 + 1.5*scG);
	}
}