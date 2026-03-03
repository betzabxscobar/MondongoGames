function hint(xx, yy, n, timer, delay) {
	PIXI.Container.call( this );
	this.init(xx, yy, n, timer, delay);
}

hint.prototype = new foxmovieclip();


hint.prototype.init = function(xx, yy, n, timer, delay) {
	if(timer){}else{timer=100}
	if(delay){}else{delay=0}
	
	if(n == 5){
		this.a = addObj("hint5");
		this.a.setReg0();
	} else if(n == 1){
		if(options_mobile){
			this.timeBg = 10;
			var bg = new PIXI.Graphics();
			bg.beginFill(0xFA0D00).drawRect(-g.hscreenwid, -180*scG, g.hscreenwid, g.screenhei).endFill();
			bg.alpha = 0.3;
			this.addChild(bg);
			this.bg = bg;
		} else {
			var arrowkeys = addObj("arrowkeys", 0, -50*scG, 0.5*scG);
			arrowkeys.img.play();
			arrowkeys.img.animationSpeed = 0.5;
			this.addChild(arrowkeys);
		}
	} else {
		this.a = new PIXI.Container();
	}
	this.addChild(this.a);
	
	this.d = timer
	this.dl = delay
	this.visible = false
	this.x = xx
	this.y = yy
	this.no = n
	
	arClips.push(this);
	
	this.arText = ["", "use_arrow",
	"desc_intro_1", 
	"desc_intro_2", 
	"desc_intro_3",
	"click_to_take_off"]
	if(options_mobile){
		this.arText = ["", "use_arrow",
						"desc_intro_1", 
						"desc_intro_2", 
						"desc_intro_3",
						"click_to_take_off"]
	}
	
	var styleGlass = {
		font : 16*scG + "px " + fontMain,
		fill : "#D61767",
		align : "center",
		wordWrapWidth : 260*scG,
		wordWrap : true,
		stroke : "#FFFFFF",
		strokeThickness : 4*scG
	};
	
	this.tfHint = new PIXI.Text(getText(this.arText[n]), styleGlass);
	if(n == 5){
		this.tfHint.x = -this.tfHint.width/2 + 115*scG;
		this.tfHint.y = 12*scG;
	} else {
		this.tfHint.x = -this.tfHint.width/2;
	}
	this.a.addChild(this.tfHint);
	
	fox.initjiggle(this.a, 2, 1, 0.6, 0.6)
}

hint.prototype.loop = function() {
	this.dl--
	if(!this.dl){
		this.visible = true;
	}
	if(this.bg){
		this.timeBg--;
		if(this.timeBg < 0){
			this.timeBg = 15;
			if(this.bg.x == 0){
				this.bg.x = g.hscreenwid;
			} else {
				this.bg.x = 0;
			}
		}
	}
	if (this.dl < 0) {
		fox.jiggle(this.a)
		// remove hints if certain conditions met
		if (this.no == 1 && g.p.y-this.y < 2*g.yspacing) this.d = 1;
		this.d--, !this.d ? (this.die()) : (undefined);
	}
}