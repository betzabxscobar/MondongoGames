function ScrMainMenu() {
	PIXI.Container.call( this );
	this.init();
}

ScrMainMenu.prototype = Object.create(PIXI.Container.prototype);
ScrMainMenu.prototype.constructor = ScrMainMenu;

ScrMainMenu.prototype.init = function() {
	this._arButtons = [];
	this.box;
	this.bWindow = false;
	var bgMenu = addObj("bgMenu2", _W/2, _H/2, scG);
	this.addChild(bgMenu);
	var tfGame = addText(getText("game_setting_1"), 50, "#FFFFFF", "#D61767", undefined, 400, 5);
	tfGame.x = _W/2;
	tfGame.y = 80*scG;
	this.addChild(tfGame);
	var tfPaused = addText(getText("game_setting_2"), 36, "#FFFFFF", "#D61767", undefined, 400, 5);
	tfPaused.x = _W/2;
	tfPaused.y = tfGame.y + 60*scG;
	this.addChild(tfPaused);
	
	var sizeQ = 22;
	var sizeS = 22;
	if(language.current_id == "es" ||
	language.current_id == "it" ||
	language.current_id == "pl"){
		sizeQ = 18;
	} else if(language.current_id == "fr"){
		sizeQ = 18;
		sizeS = 18;
	}
	
	var btnSoundOn = addButton("btnPink2", 200, 242, 0.5);
	btnSoundOn.name = "btnSoundOn";
	this.addChild(btnSoundOn);
	this._arButtons.push(btnSoundOn);
	var tfSoundOn = addText(getText("sound_on"), sizeS, "#FFFFFF", undefined, undefined, 180);
	tfSoundOn.y = -tfSoundOn.height/2;
	btnSoundOn.addChild(tfSoundOn);
	var btnSoundOff = addButton("btnPink2", 200, 242, 0.5);
	btnSoundOff.name = "btnSoundOff";
	this.addChild(btnSoundOff);
	this._arButtons.push(btnSoundOff);
	var tfSoundOff = addText(getText("sound_off"), sizeS, "#FFFFFF", undefined, undefined, 180);
	tfSoundOff.y = -tfSoundOff.height/2;
	btnSoundOff.addChild(tfSoundOff);
	
	var btnResume = addButton("btnPink2", 200, 319, 0.5);
	btnResume.name = "btnReset";
	this.addChild(btnResume);
	this._arButtons.push(btnResume);
	var tfResume = addText(getText("reset"), 22, "#FFFFFF", undefined, undefined, 180);
	tfResume.y = -tfResume.height/2;
	btnResume.addChild(tfResume);
	
	this.btnSoundOn = btnSoundOn;
	this.tfSoundOn = tfSoundOn;
	this.btnSoundOff = btnSoundOff;
	this.tfSoundOff = tfSoundOff;
	
	var btnQuit = addButton("btnPink2", 200, 396, 0.5);
	btnQuit.name = "btnQuit";
	this.addChild(btnQuit);
	this._arButtons.push(btnQuit);
	var tfQuit = addText(getText("main_menu"), sizeQ, "#FFFFFF", undefined, undefined, 180);
	tfQuit.y = -tfQuit.height/2;
	btnQuit.addChild(tfQuit);
	
	btnResume.interactive = true;
	btnResume.buttonMode = true;
	btnSoundOn.interactive = true;
	btnSoundOn.buttonMode = true;
	btnSoundOff.interactive = true;
	btnSoundOff.buttonMode = true;
	btnQuit.interactive = true;
	btnQuit.buttonMode = true;
	
	this.refreshButtons();
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrMainMenu.prototype.refreshButtons = function(){
	if(options_sound){
		this.btnSoundOn.visible = false;
		this.btnSoundOff.visible = true;
	} else {
		this.btnSoundOn.visible = true;
		this.btnSoundOff.visible = false;
		musicStop();
	}
}

ScrMainMenu.prototype.update = function(diffTime){
	if(options_pause){
		return;
	}
	
	if(this.box){
		this.box.loop();
	}
}

ScrMainMenu.prototype.showBox = function() {
	if(this.box == undefined){
		this.box = new popreset();
		this.box.x = _W/2;
		this.box.y = _H/2;
		this.box.prnt = this;
		this.addChild(this.box);
	}
	this.box.added();
	this.bWindow = true;
}

ScrMainMenu.prototype.playMusic = function(){
	musicPlay("zloop");
}

ScrMainMenu.prototype.clickObj = function(item_mc) {
	// sound_play("button_click");
	var name = item_mc.name
	// console.log("clickObj:", name);
	item_mc._selected = false;
	if(item_mc.over){
		item_mc.over.visible = false;
	}
	
	if(name == "btnReset"){
		this.showBox();
	} else if(name == "btnSoundOn"){
		options_sound = true;
		options_music = true;
		this.refreshButtons();
		this.playMusic();
	} else if(name == "btnSoundOff"){
		options_sound = false;
		options_music = false;
		this.refreshButtons();
	} else if(name == "btnQuit"){
		this.removeAllListener();
		showMenu();
	}
}

ScrMainMenu.prototype.checkButtons = function(evt){
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

ScrMainMenu.prototype.touchHandler = function(evt){
	if(this.bWindow){
		return false;
	}
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

ScrMainMenu.prototype.removeAllListener = function(){
	clearClips();
	if(this.box){
		this.box.removeAllListener();
	}
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}