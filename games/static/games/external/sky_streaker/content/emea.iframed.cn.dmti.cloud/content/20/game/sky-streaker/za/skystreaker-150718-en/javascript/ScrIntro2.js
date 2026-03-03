function ScrIntro2() {
	PIXI.Container.call( this );
	this.init();
}

ScrIntro2.prototype = Object.create(PIXI.Container.prototype);
ScrIntro2.prototype.constructor = ScrIntro2;

ScrIntro2.prototype.init = function() {
	this.b = new PIXI.Container();
	this.addChild(this.b);
	
	this._arButtons = [];
	g.state = 2;
	this.uda = 0;
	this.ys = -70*scG;
	this.grav = 10*scG;
	this.d = 220;
	var yy = 50*scG;
	var sizeTf = 22;
	if(language.current_id == "es" ||
	language.current_id == "fr"){
		sizeTf = 17;
	} else if(language.current_id == "it" ||
	language.current_id == "tr"){
		sizeTf = 15;
	}
	
	this.setall();
	
	var btnMenu = addButton("btnOrange", 85, 545, 0.5);
	this.addChild(btnMenu);
	this._arButtons.push(btnMenu);
	var tfMenu = addText(getText("shop"), sizeTf, "#FFFFFF", undefined, undefined, 100);
	tfMenu.y = - tfMenu.height/2;
	btnMenu.addChild(tfMenu);
	var btnStart = addButton("btnPink", 315, 545, 0.5);
	this.addChild(btnStart);
	this._arButtons.push(btnStart);
	var tfStart = addText(getText("next"), sizeTf, "#FFFFFF", undefined, undefined, 100);
	tfStart.y = - tfStart.height/2;
	btnStart.addChild(tfStart);
	
	btnStart.interactive = true;
	btnStart.buttonMode = true;
	btnMenu.interactive = true;
	btnMenu.buttonMode = true;
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

// set all
ScrIntro2.prototype.setall = function(){
	// make bg
	this.bgIntro = fox.popmovingbackground("bgIntro2", this.b, 0, 0, -20*scG, 0, 530*scG, 0);
	
	var yy = 500*scG;
	// this.b.x = -300*scG;
	var sh1 = fox.make("shadow", 300*scG, yy, this.b);
	var sh2 = fox.make("shadow", 147*scG, yy, this.b);
	var sh3 = fox.make("shadow", 89*scG, yy, this.b);
	var sh4 = fox.make("shadow", 36*scG, yy, this.b);
	this.richard = fox.make2("richardrun", 300*scG, yy, this.b);
	fox.make2("nicolerun", 37*scG, yy, this.b);
	fox.make2("gumballrun", 147*scG, yy, this.b);
	fox.make2("darwinrun", 89*scG, yy, this.b);
	fox.make2("anaisrun", 36*scG, yy, this.b);
	sh2.scale.x = sh2.scale.y = sh3.scale.x = sh3.scale.y = sh4.scale.x = sh4.scale.y = 0.5;
	
	fox.pophint(g.hscreenwid, 100*scG, 4, 9999, 10, this);
	
	this.d = 10;
	this.xs = g.hscreenwid / this.d;
}

ScrIntro2.prototype.update = function(diffTime){
	if(options_pause){
		return;
	}
	
	if (!this.bgIntro.xs) {
		this.bgIntro.y = (this.bgIntro.y + this.bgIntro.ys) % this.bgIntro.bhei;
	} else {
		this.bgIntro.x = (this.bgIntro.x + this.bgIntro.xs) % this.bgIntro.bwid;
	}
	
	if (this.uda) {
		this.b.x = this.b.x + (0 - this.b.x) / 2;
		this.richard.x += this.xs;
		this.richard.y += this.ys;
		this.ys += this.grav;
		this.d--;
		if (!this.d) {
			g.r.init();
		}
	} else {
		this.b.x = Math.min(0, this.b.x + 7);
	}
}

ScrIntro2.prototype.clickObj = function(item_mc) {
	// soundPlay("button_click");
	var name = item_mc.name
	// console.log("clickObj:", name);
	if(name.indexOf("btn") == -1){
		item_mc._selected = false;
		if(item_mc.over){
			item_mc.over.visible = false;
		}
	}
	
	if(name == "btnPink"){
		this.removeAllListener();
		showGame();
	} else if(name == "btnOrange"){
		this.removeAllListener();
		showShop();
	}
}

ScrIntro2.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x;
	var mouseY = evt.data.global.y;
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, mouseX, mouseY)){
			if(item_mc.visible && item_mc.alpha == 1){
				if(item_mc._selected == false){
					item_mc._selected = true;
					if(item_mc.over){
						item_mc.over.visible = true;
					} else if(item_mc.overSc){
						item_mc.scale.x = 1.1*item_mc.vX;
						item_mc.scale.y = 1.1;
					}
				}
			}
		} else {
			if(item_mc._selected){
				item_mc._selected = false;
				if(item_mc.over){
					item_mc.over.visible = false;
				} else if(item_mc.overSc){
					item_mc.scale.x = 1*item_mc.vX;
					item_mc.scale.y = 1;
				}
			}
		}
	}
}

ScrIntro2.prototype.touchHandler = function(evt){
	var phase = evt.type;
	if(phase=='mousemove' || phase == 'touchmove' || phase == 'touchstart'){
		this.checkButtons(evt);
	}else{
		var mouseX = evt.data.global.x;
		var mouseY = evt.data.global.y;
		
		for (var i = 0; i < this._arButtons.length; i++) {
			var item_mc = this._arButtons[i];
			if(item_mc._selected){
				this.clickObj(item_mc);
				item_mc._selected = false;
				if(item_mc.over){
					item_mc.over.visible = false;
				} else if(item_mc.overSc){
					item_mc.scale.x = 1*item_mc.vX;
					item_mc.scale.y = 1;
				}
				return;
			}
		}
	}
}

ScrIntro2.prototype.removeAllListener = function(){
	clearClips();
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}
