function ScrEnd() {
	PIXI.Container.call( this );
	this.init();
}

ScrEnd.prototype = Object.create(PIXI.Container.prototype);
ScrEnd.prototype.constructor = ScrEnd;

ScrEnd.prototype.init = function() {	
	this._arButtons = [];
	g.itemequip = fox.clone(g.startitemequip);
	g.nopress = 99999;
	this.d = 30;
	
	var bgEnd = addObj("bgEnd", _W/2, _H/2, scG);
	this.addChild(bgEnd);
	var nicol = addObj("nicolestanding", 360*scG, 165*scG, 0.5*scG);
	nicol.img.play();
	nicol.img.animationSpeed = 0.5;
	this.addChild(nicol);
	var richard = new player();
	richard.act = "dancing";
	richard.showact();
	richard.x = 192*scG;
	richard.y = 160*scG;
	this.addChild(richard);
	var sizeTf = 22;
	if(language.current_id == "es" ||
	language.current_id == "fr"){
		sizeTf = 17;
	} else if(language.current_id == "it" ||
	language.current_id == "tr"){
		sizeTf = 15;
	}
	
	this.a = new PIXI.Container();
	this.a.x = _W/2;
	this.a.y = 350*scG;
	this.addChild(this.a);
	// addText(text, size, color, glow, _align, width, px, font)
	var tfScore = addText(getText("your_score_r"), 16, "#FFFFFF", "#000000", undefined, 320, 5);
	tfScore.y = - 94*scG;
	this.a.addChild(tfScore);
	this.tfScore = addText(String(g.score), 40, "#FF6801", "#000000", undefined, 320, 5);
	this.tfScore.y = - (74+5)*scG;
	this.a.addChild(this.tfScore);
	var tfCoins = addText(getText("coins_r"), 16, "#FFFFFF", "#000000", undefined, 320, 5);
	tfCoins.y = - 8*scG;
	this.a.addChild(tfCoins);
	this.tfCoins = addText(String(g.coingot), 40, "#FF6801", "#000000", undefined, 320, 5);
	this.tfCoins.y = (2+5)*scG;
	this.a.addChild(this.tfCoins);
	var tfBest = addText(getText("best_score_r"), 16, "#FFFFFF", "#000000", undefined, 320, 5);
	tfBest.y = 75*scG;
	this.a.addChild(tfBest);
	var sizeBest = 40;
	if (g.score > g.highscore) {
		sizeBest = 24;
	}
	this.tfBest = addText(String(g.highscore), sizeBest, "#FF6801", "#000000", undefined, 400, 5);
	this.tfBest.y = (85+5)*scG;
	this.a.addChild(this.tfBest);
	
	if (g.score > g.highscore) {
		g.highscore = g.score
		this.tfBest.setText(getText("new_best_score"));
		this.tfBest.y = (85+15)*scG;
	}
	// CN Achievement -------------------------------------------------------
	if ((g.score >= 4000) && (g.itemequip[4] == 1)) {
		sendstat(105, 1); // player scores 4000 wearing the blonde wig
	}
	// CN Achievement -------------------------------------------------------
	fox.initjiggle(this.a, 1.6, 1, 0.7, 0.7)
	this.a.d = 40;
	
	var btnMenu = addButton("btnOrange", 85, 545, 0.5);
	this.addChild(btnMenu);
	this._arButtons.push(btnMenu);
	var tfMenu = addText(getText("shop"), sizeTf, "#FFFFFF", undefined, undefined, 100);
	tfMenu.y = - tfMenu.height/2;
	btnMenu.addChild(tfMenu);
	var btnStart = addButton("btnPink", 315, 545, 0.5);
	this.addChild(btnStart);
	this._arButtons.push(btnStart);
	var tfStart = addText(getText("play"), sizeTf, "#FFFFFF", undefined, undefined, 100);
	tfStart.y = - tfStart.height/2;
	btnStart.addChild(tfStart);
	
		saveData();
		// Notifica a Django el resultado de la partida actual (iframe -> parent).
		if (typeof reportPartidaToDjango === "function") {
			reportPartidaToDjango(g.score);
		}
		
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

ScrEnd.prototype.update = function(diffTime){
	if(options_pause){
		return;
	}
	
	if (g.automatic) {
		// automatic skip this screen
		this.d--;
		if (!this.d) {
			this.removeAllListener();
			showGame();
		}
	}
	
	if(this.a){
		this.a.d--
		if (this.a.d > 0) {
			fox.jiggle(this.a)
		}
		// Space bar to play again
		if (g.key.f1) {
			this.removeAllListener();
			showGame();
		}
	}
}

ScrEnd.prototype.clickObj = function(item_mc) {
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

ScrEnd.prototype.checkButtons = function(evt){
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

ScrEnd.prototype.touchHandler = function(evt){
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

ScrEnd.prototype.removeAllListener = function(){
	clearClips();
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}
