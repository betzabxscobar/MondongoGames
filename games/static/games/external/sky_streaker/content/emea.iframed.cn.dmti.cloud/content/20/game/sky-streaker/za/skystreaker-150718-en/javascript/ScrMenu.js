function ScrMenu() {
	PIXI.Container.call( this );
	this.init();
}

ScrMenu.prototype = Object.create(PIXI.Container.prototype);
ScrMenu.prototype.constructor = ScrMenu;

ScrMenu.prototype.init = function() {
	this.bg_mc = new PIXI.Container();
	this.addChild(this.bg_mc);
	this._arButtons = [];
	
	var bgMenu = addObj("bgMenu", _W/2, _H/2, scG);
	this.bg_mc.addChild(bgMenu);
	this.richard = addObj("title_richard", 146*scG, 302*scG, scG);
	this.bg_mc.addChild(this.richard);
	this.sun = addObj("title_sun", 281*scG, 42*scG, scG);
	this.bg_mc.addChild(this.sun);
	var darwin = addObj("title_darwin", 235*scG, 467*scG, scG);
	this.addChild(darwin);
	var gumball = addObj("title_gumball", 332*scG, 453*scG, scG);
	this.addChild(gumball);
	var logo = addObj("logo_"+language.current_id, 251*scG, 276*scG, scG);
	if(logo == undefined){
		logo = addObj("logo_en", 251*scG, 276*scG, scG);
	}
	this.addChild(logo);
	
	darwin.x = _W+darwin.w/2;
	createjs.Tween.get(darwin).wait(400).to({x: 235*scG}, 400);
	gumball.x = _W+gumball.w/2;
	createjs.Tween.get(gumball).wait(500).to({x: 332*scG}, 400);
	logo.x = _W+logo.w/2;
	createjs.Tween.get(logo).wait(800).to({x: 240*scG}, 300)
							.to({x: 260*scG}, 120).to({x: 245*scG}, 90)
							.to({x: 255*scG}, 70).to({x: 251*scG}, 50);
	
	var btnMenu = addButton("btnOrange", 85, 545, 0.5);
	this.addChild(btnMenu);
	this._arButtons.push(btnMenu);
	var tfMenu = addText(getText("menu"), 22, "#FFFFFF", undefined, undefined, 100);
	tfMenu.y = - tfMenu.height/2;
	btnMenu.addChild(tfMenu);
	var btnStart = addButton("btnPink", 315, 545, 0.5);
	this.addChild(btnStart);
	this._arButtons.push(btnStart);
	var tfStart = addText(getText("play"), 22, "#FFFFFF", undefined, undefined, 100);
	tfStart.y = - tfStart.height/2;
	btnStart.addChild(tfStart);
	
	var realW = window.innerWidth;
    var realH = window.innerHeight;
	if(ScreenLock){
		options_pause = false;
		ScreenLock.visible = false;
	}
	
	this.bg_mc.scale.x = 3;
	this.bg_mc.scale.y = 3;
	this.bg_mc.x = -_W*2;
	
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

ScrMenu.prototype.update = function(diffTime){
	if(options_pause){
		return;
	}
	
	if(this.bg_mc.scale.x > 1){
		this.bg_mc.scale.x -= 0.1;
		this.bg_mc.x += _W*0.1
		if(this.bg_mc.scale.x < 1){
			this.bg_mc.scale.x = 1;
			this.bg_mc.x = 0;
		}
		this.bg_mc.scale.y = this.bg_mc.scale.x;
	}
}

ScrMenu.prototype.clickObj = function(item_mc) {
	// soundPlay("button_click");
	var name = item_mc.name
	// console.log("clickObj:", name);
	item_mc._selected = false;
	if(item_mc.over){
		item_mc.over.visible = false;
	}
	
	if(name == "btnPink"){
		this.removeAllListener();
		showInto1();
	} else if(name == "btnOrange"){
		this.removeAllListener();
		showMainMenu();
	}
}

ScrMenu.prototype.checkButtons = function(evt){
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

ScrMenu.prototype.touchHandler = function(evt){
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

ScrMenu.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}
