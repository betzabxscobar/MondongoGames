function ScrShop() {
	PIXI.Container.call( this );
	this.init();
}

ScrShop.prototype = Object.create(PIXI.Container.prototype);
ScrShop.prototype.constructor = ScrShop;

ScrShop.prototype.init = function() {
	this._arButtons = [];
	this._arIcons = [];
	this.box;
	
	var bgMenu = addObj("bgShop", _W/2, _H/2, scG);
	this.addChild(bgMenu);
	var coin = addObj("coin", 375*scG, 30*scG, 0.5*scG);
	coin.img.play();
	coin.img.animationSpeed = 0.5;
	this.addChild(coin);
	var tfCoin = addText("0", 22, "#FFFFFF", "#D61767", "right", 300, 4);
	tfCoin.x = 355*scG;
	tfCoin.y = 20*scG;
	this.addChild(tfCoin);
	this.tfCoin = tfCoin;
	var tfShop = addText(getText("shop"), 40, "#FFFFFF", "#D61767", "left", 300, 4);
	tfShop.x = 10*scG;
	tfShop.y = 12*scG;
	this.addChild(tfShop);
	
	this.a = new PIXI.Container();
	this.addChild(this.a);
	this.richard = new PIXI.Container();
	this.addChild(this.richard);
	this.hintplace = new PIXI.Container();
	this.addChild(this.hintplace);
	
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
	var btnArrow1 = addButton("btnArrow1", -170, 545, 0.5);
	this.addChild(btnArrow1);
	this._arButtons.push(btnArrow1);
	var btnArrow2 = addButton("btnArrow2", -97, 545, 0.5);
	this.addChild(btnArrow2);
	this._arButtons.push(btnArrow2);
	this.btnArrow1 = btnArrow1;
	this.btnArrow2 = btnArrow2;
	
	this.added();
	
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

ScrShop.prototype.added = function(){
	// test
	if (g.usecheats) {
		g.totalcoins = 80000;
	}
	
	if (!g.backgrounds) {
		g.backgrounds = [];
	}
	g.itemequip = fox.clone(g.startitemequip);
	
	if (g.coingot > 0) {
		this.coinnow = g.totalcoins - g.coingot;
		this.countstep = Math.max(1, Math.round(g.coingot / 30));
		g.coingot = 0;
	} else {
		this.coinnow = g.totalcoins;
	}
	this.icons = [];
	this.tfCoin.setText(this.coinnow);
	this.xpos = 64*scG;
	this.ypos = this.ynow = 120*scG;
	this.iconspacing = 83*scG;
	this.iconperpage = 5;
	this.pagemax = g.itemtype1.length / this.iconperpage;
	this.a.x = this.xpos;
	this.a.y = this.ypos;
	this.pagenow = 1;
	this.pagemax = Math.ceil(g.itemtype1.length / this.iconperpage);
	// make richard
	this.richardshop = new player();
	this.richardshop.act = "stand2";
	this.richardshop.showact();
	this.richardshop.x = g.screenwid - 115*scG+60*scG;
	this.richardshop.y = 280*scG;
	if(language.current_id == "es"){
		this.richardshop.y = 190*scG;
	} else if(language.current_id == "fr"){
		this.richardshop.y = 260*scG;
	} else if(language.current_id == "pl"){
		this.richardshop.y = 180*scG;
	} else if(language.current_id == "ru"){
		this.richardshop.y = 130*scG;
	} else if(language.current_id == "tr"){
		this.richardshop.y = 130*scG;
	}
	this.richard.addChild(this.richardshop);
	// make icons
	this.showicons(1);
	// load sfx
	commonclass.playmusicloop(99);
}

// cek equip
ScrShop.prototype.cekequip = function(){
	if (g.refreshrichard) {
		g.refreshrichard = 0;
		// redresh wear
		this.richardshop.refreshEquip();
	}
}

// cek buttons
ScrShop.prototype.cekbuttons = function(){
	if (this.pagenow == 1) {
		if (this.btnArrow2.alpha > 0.4) {
			this.btnArrow2.alpha = 0.4;
			this.btnArrow2.scale.x = this.btnArrow2.scale.y = 0.9;
		}
	} else {
		if (this.btnArrow2.alpha < 1) {
			this.btnArrow2.alpha = 1;
			this.btnArrow2.scale.x = this.btnArrow2.scale.y = 1;
		}
	}
	if (this.pagenow == this.pagemax) {
		if (this.btnArrow1.alpha > 0.4) {
			this.btnArrow1.alpha = 0.4;
			this.btnArrow1.scale.x = this.btnArrow1.scale.x = 0.9;
		}
	} else {
		if (this.btnArrow1.alpha < 1) {
			this.btnArrow1.alpha = 1;
			this.btnArrow1.scale.x = this.btnArrow1.scale.y = 1;
		}
	}
}

// scroll icons
ScrShop.prototype.scrollicons = function(){
	this.a.y = this.a.y + (this.ynow - this.a.y) / 8;
	this.hintplace.x = this.a.x;
	this.hintplace.y = this.a.y;
}

// count coins
ScrShop.prototype.countcoins = function(){
	if (this.coinnow != g.totalcoins) {
		if (this.coinnow < g.totalcoins) {
			// counting up
			this.coinnow = Math.min(g.totalcoins, this.coinnow + this.countstep);
			this.tfCoin.setText(this.coinnow);
			soundPlay("zcount");
			if (this.coinnow == g.totalcoins) {
				// end of count
				// TweenLite.to(coinbox, 1, {scaleX: coinbox.scaleX, scaleY: coinbox.scaleY, ease: Elastic.easeOut});
				// this.tfCoin.scale.x = this.tfCoin.scale.y = 2 * this.tfCoin.scale.x;
			}
		} else if (this.coinnow > g.totalcoins) {
			// just bought something
			this.coinnow = g.totalcoins;
			this.tfCoin.setText(this.coinnow);
		}
	}
}

// show icons
ScrShop.prototype.showicons = function(id){
	// clear icons
	for (var i = this.icons.length - 1; i >= 0; i--) {
		this.icons[i].removeAllListener();
		this.icons[i].die();
	}
	this.icons = [];
	// display icons based on category
	if (id == 1) {
		for (i = 0; i < g.itemtype1.length; i++) {
			mc = new icon();
			mc.prnt = this;
			mc.hintplace = this.hintplace;
			mc.icontype = g.icontype1[i];
			mc.itemtype = g.itemtype1[i];
			mc.itemname = g.itemname1[i];
			mc.itemcost = commonclass.getitemcost(1, i + 1);
			mc.itempaid = g.itempaid1[i];
			mc.itemcategory = 1;
			mc.itemdescription = g.itemdescription1[i];
			mc.y = i * this.iconspacing;
			mc.idx = i;
			mc.added();
			this.a.addChild(mc);
			this.icons.push(mc);
			arClips.push(mc);
			var mcA = mc.a.b1;
			var xA = mcA.getGlobalPosition().x;
			var step = 50*scG;
			if(xA > 80*scG){
				step = -50*scG;
			}
			mcA.glPoint = {x:xA, y:mcA.getGlobalPosition().y};
			mcA.glPoint2 = {x:xA+step, y:mcA.getGlobalPosition().y};
			mcA.rr = mc.a.b1.rr;
			mcA.doover = mc.doover;
			mcA.prnt = mc;
			mcA.a = mc.a;
			mcA._selected = false;
			this._arIcons.push(mcA);
		}
	}
}

ScrShop.prototype.update = function(diffTime){
	if(options_pause){
		return;
	}
	
	// coin counter
	this.countcoins();
	// scroll icons
	this.scrollicons();
	// cek buttons
	this.cekbuttons();
	// cek equip
	this.cekequip();
	
	if(this.box){
		this.box.loop();
	}
}

ScrShop.prototype.showBox = function(item_mc) {
	if(this.box == undefined){
		this.box = new itembox();
		this.box.prnt = this;
		this.addChild(this.box);
	}
	
	this.box.itemtype = item_mc.itemtype;
	this.box.itemname = item_mc.itemname;
	this.box.itemcost = item_mc.itemcost;
	this.box.itemcategory = 1;
	this.box.itemdescription = item_mc.itemdescription;
	this.box.idx = item_mc.idx;
	this.box.x = g.hscreenwid;
	this.box.y = g.hscreenhei - 30*scG;
	this.box.added();
}

ScrShop.prototype.clickIcon = function(item_mc) {
	if (item_mc.itempaid) {
		// use item
		if (g.itemequip[item_mc.idx]) {
			g.itemequip[item_mc.idx] = 0;
			g.startitemequip = fox.clone(g.itemequip);
			// clear hint, if exist
			if (this.hintplace.numChildren > 0)
				this.hintplace.removeChildAt(0);
		} else {
			commonclass.equip(item_mc.idx);
		}
		g.refreshrichard = 1;
		soundPlay("zslot");
	} else {
		// pop up item box
		this.showBox(item_mc);
	}
}

ScrShop.prototype.clickObj = function(item_mc) {
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
		showMenu();
	}
}

ScrShop.prototype.checkButtons = function(evt){
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
	
	for (var i = 0; i < this._arIcons.length; i++) {
		var item_mc = this._arIcons[i];
		if(hit_test(item_mc.glPoint,item_mc.rr,mouseX,mouseY) || 
		hit_test(item_mc.glPoint2,item_mc.rr,mouseX,mouseY)){
			if(item_mc._selected == false){
				item_mc._selected = true;
				if (!item_mc.prnt.itempaid) {
					item_mc.a.scale.x = item_mc.a.scale.y = 2;
				}
			}
		} else {
			if(item_mc._selected){
				item_mc._selected = false;
			}
		}
	}
}

ScrShop.prototype.touchHandler = function(evt){
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
		
		for (var i = 0; i < this._arIcons.length; i++) {
			var item_mc = this._arIcons[i];
			if(item_mc._selected){
				this.clickIcon(item_mc.prnt);
				return;
			}
		}
	}
}

ScrShop.prototype.removeAllListener = function(){
	clearClips();
	if(this.box){
		this.box.removeAllListener();
	}
	for (var i = this.icons.length - 1; i >= 0; i--) {
		this.icons[i].removeAllListener();
		this.icons[i].die();
	}
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}
