function icon() {
	PIXI.Container.call( this );
	this.init();
}

icon.prototype = new foxmovieclip();

var obj = this;

icon.prototype.init = function() {
	this._arButtons = [];
	this.xnow = 0;
	this.idx = 0;
	this.itemcategory = 0;
	this.itempaid = 0;
	this.itemcost = 0;
	
	this.iconslot = addObj("iconslot", 27*scG);
	this.addChild(this.iconslot);
	this.a = new PIXI.Container();
	this.addChild(this.a);
	this.a.b1 = addObj("iconcircle1");
	this.a.addChild(this.a.b1);
	this.a.b2 = addObj("iconcircle2");
	this.a.addChild(this.a.b2);
	this.buttonq = addButton("btnQuestion", 109,0,0.5);
	this.addChild(this.buttonq);
	this.coinpic = addObj("coinpicmini", 53*scG, 16*scG);
	this.addChild(this.coinpic);
	this._arButtons.push(this.buttonq);
	
	var sizeTf = 22;
	if(language.current_id == "de"){
		sizeTf = 19;
	} else if(language.current_id == "es"){
		sizeTf = 16;
	} else if(language.current_id == "fr"){
		sizeTf = 16;
	} else if(language.current_id == "it"){
		sizeTf = 16;
	} else if(language.current_id == "pl"){
		sizeTf = 16;
	} else if(language.current_id == "ru"){
		sizeTf = 16;
	} else if(language.current_id == "tr"){
		sizeTf = 16;
	}
	
	var tfName = addText(getText("name"), sizeTf, "#D61767", undefined, "left", 190);
	tfName.x = 44*scG;
	tfName.y = -32*scG;
	this.addChild(tfName);
	this.nama = tfName;
	var tfCost = addText(getText("name"), 23, "#D61767", undefined, "left", 110);
	tfCost.x = 64*scG;
	tfCost.y = 5*scG;
	this.addChild(tfCost);
	this.cost = tfCost;
	
	this.buttonq.interactive = true;
	this.buttonq.buttonMode = true;
	this.a.interactive = true;
	this.a.buttonMode = true;
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('mouseup', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

icon.prototype.added = function() {
	this.x1 = 0;
	this.x2 = 50*scG;
	this.cekstatus();
	this.a.x = this.xnow;
	fox.initjiggle(this.a, 1, 1, 0.6, 0.6);
}

icon.prototype.loop = function() {
	if (this.itempaid) {
		this.a.x = this.a.x + (this.xnow - this.a.x) / 2;
		if (g.itemequip[this.idx]) {
			this.a.b2.alpha = Math.min(1, this.a.b2.alpha + 0.15);
			this.xnow = this.x2;
		} else {
			this.a.b2.alpha = Math.max(0, this.a.b2.alpha - 0.15);
			this.xnow = this.x1;
		}
	} else {
		fox.jiggle(this.a);
		this.cekbuy();
	}
}

// cek buy
icon.prototype.cekbuy = function() {
	if (g.itemequip[this.idx]) {
		// just purchased
		this.itempaid = 1;
		if (this.idx < 4 && !g.udashophint) {
			g.udashophint = 1;
			fox.pophint(this.x+84*scG, this.y, 5, 100, 10, this.hintplace);
		}
		this.cekstatus();
	}
}

// cekstatus
icon.prototype.cekstatus = function() {
	if (g.itemequip[this.idx]) {
		this.xnow = this.x2;
	}
	this.pic = fox.make(this.icontype, 0, 0, this.a);
	if (!this.itempaid) {
		this.iconslot.visible = this.a.b2.visible = this.buttonq.visible = false;
		this.cost.setText(this.itemcost);
		this.nama.setText(getText(this.itemname));
		this.coinpic.visible = true;
	} else {
		this.iconslot.visible = this.a.b2.visible = this.buttonq.visible = true;
		this.cost.setText("");
		this.nama.setText("");
		this.coinpic.visible = false;
	}
}

// do over
icon.prototype.doover = function() {
	if (!this.itempaid) {
		obj.a.scale.x = obj.a.scale.y = 1.5;
	}
}


icon.prototype.clickObj = function(item_mc) {
	// soundPlay("button_click");
	var name = item_mc.name
	
	if(name.indexOf("btn") == -1){
		item_mc._selected = false;
		if(item_mc.over){
			item_mc.over.visible = false;
		}
	}
	
	if(name == "btnQuestion"){
		this.prnt.showBox(this);
	}
}

icon.prototype.checkButtons = function(evt){
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

icon.prototype.touchHandler = function(evt){
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

icon.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}
