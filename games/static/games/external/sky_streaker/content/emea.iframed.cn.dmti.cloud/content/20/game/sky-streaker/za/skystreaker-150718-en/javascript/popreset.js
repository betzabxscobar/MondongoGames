function popreset() {
	PIXI.Container.call( this );
	this.init();
}

popreset.prototype = new foxmovieclip();


popreset.prototype.init = function() {	
	this._arButtons = [];
	
	var bg = new addObj("bgReset");
	this.addChild(bg);
	this.b = addText(getText("reset_desc"), 16, "#FFFFFF", undefined, "center", 200);
	this.b.x = 0;
	this.b.y = -60*scG;
	this.addChild(this.b);
	
	var btnYes = addButton("btnPink", -60, 48, 0.5);
	btnYes.name = "btnYes";
	this.addChild(btnYes);
	this._arButtons.push(btnYes);
	var tfYes = addText(getText("yes"), 22, "#FFFFFF", undefined, undefined, 80);
	tfYes.y = - tfYes.height/2;
	btnYes.addChild(tfYes);
	var btnNo = addButton("btnPink", 60, 48, 0.5);
	btnNo.name = "btnNo";
	this.addChild(btnNo);
	this._arButtons.push(btnNo);
	var tfNo = addText(getText("no"), 22, "#FFFFFF", undefined, undefined, 80);
	tfNo.y = - tfNo.height/2;
	btnNo.addChild(tfNo);
	
	btnYes.interactive = true;
	btnYes.buttonMode = true;
	btnNo.interactive = true;
	btnNo.buttonMode = true;
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

popreset.prototype.added = function(){
	this.visible = true;
	fox.initjiggle(this, 2, 1, 0.7, 0.5);
}

// loop
popreset.prototype.loop = function() {
	fox.jiggle(this);
}

popreset.prototype.clickObj = function(item_mc) {
	// soundPlay("button_click");
	var name = item_mc.name
	
	if(name.indexOf("btn") == -1){
		item_mc._selected = false;
		if(item_mc.over){
			item_mc.over.visible = false;
		}
	}
	
	if(name == "btnYes"){
		resetData();
		commonclass.popmsg(this.parent, g.hscreenwid, g.hscreenhei, "game_reset");
		soundPlay("zbuy");
		this.visible = false;
	} else if(name == "btnNo"){
		this.visible = false;
	}
	if(!this.visible){
		this.prnt.bWindow = false;
	}
}

popreset.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x;
	var mouseY = evt.data.global.y;
	
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		var obj = {x:item_mc.getGlobalPosition().x, y:item_mc.getGlobalPosition().y}
		if(hit_test_rec(obj, item_mc.w, item_mc.h, mouseX, mouseY)){
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

popreset.prototype.touchHandler = function(evt){
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

popreset.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}
