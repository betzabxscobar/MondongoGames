function foxpopdisplayobject(name, xx, yy, time, jiggletime, fadeinspeed, fadeoutspeed) {
	PIXI.Container.call( this );
	this.init(name, xx, yy, time, jiggletime, fadeinspeed, fadeoutspeed);
}

foxpopdisplayobject.prototype = new foxmovieclip();


foxpopdisplayobject.prototype.init = function(name, xx, yy, time, jiggletime, fadeinspeed, fadeoutspeed) {
	this.d = time;
	this.displayobjectname = name;
	this.jiggle = jiggletime;
	this.fadein = fadeinspeed;
	this.fadeout = fadeoutspeed;
	this.x = xx;
	this.y = yy;
	arClips.push(this);
}

foxpopdisplayobject.prototype.added = function() {
	// jiggle
	if (this.jiggle > 0)
		fox.initjiggle(this);
	if (this.fadein > 0)
		this.alpha = 0;
	// fox.make(this.displayobjectname, 0, 0, this);
	var tf = addText(getText(this.displayobjectname), 33, "#FF0000", undefined, undefined, 200)
	this.addChild(tf);
}

foxpopdisplayobject.prototype.loop = function() {
	if (this.jiggle > 0)
		fox.jiggle(this);
	if (this.fadein > 0){
		// fade in
		this.alpha += this.fadein;
		if (this.alpha >= 1){
			this.alpha = 1;
			this.fadein = 0;
		}
	} else {
		this.d--;
		if (this.d <= 0){
			if (this.fadeout == 0){
				this.die();
			} else {
				// fade out
				this.alpha -= this.fadeout;
				if (this.alpha <= 0)
					this.die();
			}
		}
	}
}