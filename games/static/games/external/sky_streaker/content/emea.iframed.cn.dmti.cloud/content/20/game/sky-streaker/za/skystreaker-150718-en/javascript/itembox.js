function itembox() {
	PIXI.Container.call( this );
	this.init();
}

itembox.prototype = new foxmovieclip();


itembox.prototype.init = function() {
	this._arButtons = [];
	var bg = new PIXI.Graphics();
	bg.beginFill(0x000000).drawRect(0, 0, 800*scG, 1200*scG).endFill();
	bg.x = -400*scG;
	bg.y = -600*scG;
	bg.alpha = 0.3;
	this.addChild(bg)
	
	var bgItembox = addObj("bgItembox", 0, 40*scG)
	this.addChild(bgItembox);
	this.a = new PIXI.Container();
	this.a.y = -108*scG;
	this.addChild(this.a);
	var iconcircle3 = addObj("iconcircle3")
	this.a.addChild(iconcircle3);
	
	var sizeTf = 20;
	var sizeBtn = 22;
	if(language.current_id == "es"){
		sizeTf = 18;
		sizeBtn = 18;
	} if(language.current_id == "fr"){
		sizeBtn = 18;
	} if(language.current_id == "it"){
		sizeBtn = 20;
	} if(language.current_id == "tr"){
		sizeBtn = 18;
	}
	
	var tfCost = addText("0", 22, "#D61767");
	tfCost.x = 0;
	tfCost.y = 31*scG;
	this.a.addChild(tfCost);
	this.tfCost = tfCost;
	var tfNama = addText("0", sizeTf, "#FFFFFF", undefined, undefined, 300);
	tfNama.x = 0;
	tfNama.y = 93*scG;
	this.a.addChild(tfNama);
	this.tfNama = tfNama;
	var tfDescription = addText("", 16, "#FFDD55", undefined, undefined, 300);
	tfDescription.x = 0;
	tfDescription.y = 132*scG;
	this.a.addChild(tfDescription);
	this.tfDescription = tfDescription;
	
	var btnOk = addButton("btnPink", 0, 130,0.5);
	this.addChild(btnOk);
	this._arButtons.push(btnOk);
	var tfBtn = addText(getText("ok"), sizeBtn, "#FFFFFF", undefined, undefined, 100);
	tfBtn.y = - tfBtn.height/2;
	btnOk.addChild(tfBtn);
	this.tfBtn = tfBtn;
	var btnClose = addButton("btnClose", 159, -102, 0.5);
	this.addChild(btnClose);
	this._arButtons.push(btnClose);
	
	btnOk.interactive = true;
	btnOk.buttonMode = true;
	btnClose.interactive = true;
	btnClose.buttonMode = true;
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
	
}

itembox.prototype.added = function() {
	this.visible = true;
	if(this.ico){
		this.a.removeChild(this.ico);
	}
	this.ico = addButton(this.itemtype, 0, -10, 1);
	this.a.addChild(this.ico);
	this.tfNama.setText(getText(this.itemname));
	if(this.itemcost == 99999999){
		this.tfCost.setText("");
	} else {
		this.tfCost.setText(this.itemcost);
	}
	this.tfDescription.setText(getText(this.itemdescription));
	fox.initjiggle(this, 2, 1, 0.7, 0.5);
	if (g.itempaid1[this.idx] > 0) {
		this.tfBtn.setText(getText("ok"));
	} else {
		this.tfBtn.setText(getText("buy"));
	}
}

// loop
itembox.prototype.loop = function() {
	fox.jiggle(this);
}

itembox.prototype.clickObj = function(item_mc) {
	// soundPlay("button_click");
	var name = item_mc.name
	
	if(name.indexOf("btn") == -1){
		item_mc._selected = false;
		if(item_mc.over){
			item_mc.over.visible = false;
		}
	}
	
	if(name == "btnPink"){
		if (g.itempaid1[this.idx] > 0) {
			this.visible = false;
		} else {
			if (g.totalcoins >= this.itemcost) {
				// buy it
				g.totalcoins -= this.itemcost;
				g.itempaid1[this.idx] = 1;
				commonclass.equip(this.idx);				
				login_obj["coins"] = g.totalcoins;
				login_obj["item1"] = g.itempaid1;
				saveData();
				soundPlay("zbuy");
				g.refreshrichard = 1;
				// CN Achievement -------------------------------------------------------
				if (g.itempaid1[2] == 1) {
					sendstat(102, 1); // player buys the foil hat
				}
				// CN Achievement -------------------------------------------------------
				this.visible = false;
			} else {
				commonclass.popmsg(this.prnt, g.hscreenwid, g.hscreenhei, "not_enough_coins");
				soundPlay("zmiss");
				this.visible = false;
			}
		}
	} else if(name == "btnClose"){
		this.visible = false;
	}
}

itembox.prototype.checkButtons = function(evt){
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

itembox.prototype.touchHandler = function(evt){
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

itembox.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}
