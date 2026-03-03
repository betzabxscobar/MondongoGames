function ScrPause() {
	PIXI.Container.call( this );
	this.init();
}

ScrPause.prototype = Object.create(PIXI.Container.prototype);
ScrPause.prototype.constructor = ScrPause;

ScrPause.prototype.init = function() {
	this._arButtons = [];
	var bgMenu = addObj("bgPause", _W/2, _H/2, scG);
	this.addChild(bgMenu);
	var tfGame = addText(getText("game"), 50, "#FFFFFF", "#D61767", undefined, 300, 5);
	tfGame.x = _W/2;
	tfGame.y = 90*scG;
	this.addChild(tfGame);
	var tfPaused = addText(getText("paused"), 36, "#FFFFFF", "#D61767", undefined, 300, 5);
	tfPaused.x = _W/2;
	tfPaused.y = tfGame.y + 50*scG;
	this.addChild(tfPaused);
	
	var sizeQ = 22;
	var sizeS = 22;
	if(language.current_id == "fr"){
		sizeS = 18;
	}else if(language.current_id == "it"){
		sizeQ = 18;
	}
	
	var btnResume = addButton("btnPink2", 200, 242, 0.5);
	btnResume.name = "btnResume";
	this.addChild(btnResume);
	this._arButtons.push(btnResume);
	var tfResume = addText(getText("resume"), 22, "#FFFFFF", undefined, undefined, 180);
	tfResume.y = -tfResume.height/2;
	btnResume.addChild(tfResume);
	
	var btnSoundOn = addButton("btnPink2", 200, 319, 0.5);
	btnSoundOn.name = "btnSoundOn";
	this.addChild(btnSoundOn);
	this._arButtons.push(btnSoundOn);
	var tfSoundOn = addText(getText("sound_on"), sizeS, "#FFFFFF", undefined, undefined, 180);
	tfSoundOn.y = -tfSoundOn.height/2;
	btnSoundOn.addChild(tfSoundOn);
	var btnSoundOff = addButton("btnPink2", 200, 319, 0.5);
	btnSoundOff.name = "btnSoundOff";
	this.addChild(btnSoundOff);
	this._arButtons.push(btnSoundOff);
	var tfSoundOff = addText(getText("sound_off"), sizeS, "#FFFFFF", undefined, undefined, 180);
	tfSoundOff.y = -tfSoundOff.height/2;
	btnSoundOff.addChild(tfSoundOff);
	
	this.btnSoundOn = btnSoundOn;
	this.tfSoundOn = tfSoundOn;
	this.btnSoundOff = btnSoundOff;
	this.tfSoundOff = tfSoundOff;
	
	var btnQuit = addButton("btnPink2", 200, 396, 0.5);
	btnQuit.name = "btnQuit";
	this.addChild(btnQuit);
	this._arButtons.push(btnQuit);
	var tfQuit = addText(getText("quit_game"), sizeQ, "#FFFFFF", undefined, undefined, 180);
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

ScrPause.prototype.refreshButtons = function(){
	if(options_sound){
		this.btnSoundOn.visible = false;
		this.btnSoundOff.visible = true;
	} else {
		this.btnSoundOn.visible = true;
		this.btnSoundOff.visible = false;
		musicStop();
	}
}

ScrPause.prototype.playMusic = function(){
	musicPlay("zloop1", 1, 0, 999999);
}

ScrPause.prototype.clickObj = function(item_mc) {
	// sound_play("button_click");
	var name = item_mc.name
	// console.log("clickObj:", name);
	item_mc._selected = false;
	if(item_mc.over){
		item_mc.over.visible = false;
	}
	
	if(name == "btnResume"){
		this.visible = false;
		options_pause = false;
		refreshTime();
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
		options_pause = false;
		if(ScreenGame){
			ScreenGame.removeAllListener();
		}
		showMenu();
		this.playMusic();
	}
}

ScrPause.prototype.checkButtons = function(evt){
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

ScrPause.prototype.touchHandler = function(evt){
	if(options_pause == false){
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

ScrPause.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}