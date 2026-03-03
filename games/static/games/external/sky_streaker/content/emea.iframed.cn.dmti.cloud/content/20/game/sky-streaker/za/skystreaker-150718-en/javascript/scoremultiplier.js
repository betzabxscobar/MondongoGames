function scoremultiplier() {
	PIXI.Container.call( this );
	this.init();
}

scoremultiplier.prototype = new foxmovieclip();


scoremultiplier.prototype.init = function() {	
	this.state = 1;
	this.num = g.scoremulti;
	this.ratio = 0;
	this.dv = 0.2;
	this.d = 50;
	this.colorarray = [0x0099FF, 0x00FF00, 0xFFFF00, 0xFF0000];
	
	this.sh = addObj("bgScoreMultiplier");
	this.addChild(this.sh);
	this.a = new PIXI.Container();
	this.addChild(this.a);
	this.a.b = addText(String(this.num) + "x", 50, "#FF0000", undefined, "center", 70, 1, undefined, true, "#FFFFFF")
	this.a.b.y = -50*scG;
	this.addChild(this.a.b);
	var tfCoin = addText(getText("score"), 25, "#FF0000", undefined, "center", 70, 1, undefined, true, "#FFFFFF")
	tfCoin.y = 0;
	this.addChild(tfCoin);
	
	fox.initjiggle(this, 2, 1, 0.9, 0.85);
	arClips.push(this);
}

scoremultiplier.prototype.loop = function() {
	fox.jiggle(this);
	this.rotatecolor();
	this.rotatesh();
	if (this.state == 1) {
		this.cekmulti();
	} else {
		this.fading();
	}
}

// rotate color
scoremultiplier.prototype.rotatecolor = function() {
	// var myColor = this.a.transform.colorTransform;
	// myColor.color = fox.fadeHexArr(colorarray, ratio);
	this.ratio += this.dv;
	if (this.ratio > 1) {
		this.ratio = 1;
		this.dv = -this.dv;
	}
	if (this.ratio < 0) {
		this.ratio = 0;
		this.dv = -this.dv;
	}
	// a.transform.colorTransform = myColor;
}

// rotate sh
scoremultiplier.prototype.rotatesh = function() {
	this.sh.rotation += 6;
}

// cek multi
scoremultiplier.prototype.cekmulti = function() {
	if (this.num != g.scoremulti) {
		this.state = 2;
		this.d = 30;
	}
}

// fading
scoremultiplier.prototype.fading = function() {
	this.visible = !this.visible;
	this.a.scale.x *= 0.95;
	this.sh.scale.x = this.sh.scale.y = this.a.scale.x = this.a.scale.y;
	this.d--;
	if (!this.d) {
		this.die();
	}
}