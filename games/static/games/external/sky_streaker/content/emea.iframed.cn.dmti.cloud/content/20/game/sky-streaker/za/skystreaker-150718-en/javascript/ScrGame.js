function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

ScrGame.prototype.init = function() {
	this.game_mc = new PIXI.Container();
	this.face_mc = new PIXI.Container();
	
	this._gameOver = false;
	this._arButtons = [];
	
	this.addChild(this.game_mc);
	this.addChild(this.face_mc);
	
	this.btnPause = addButton("btnPause", 380, 21, 0.5);
	this.face_mc.addChild(this.btnPause);
	this._arButtons.push(this.btnPause);
	
	this.added();
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('mouseup', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
	window.addEventListener("keydown", this.keydown); 
	window.addEventListener("keyup", this.keyup);
}

ScrGame.prototype.added = function() {
	g.udainit = 1;
	this.clearpage();
	// setup 1
	this.setup1();
	
	// create player and backgrounds
	g.all = new PIXI.Container(), this.game_mc.addChild(g.all)
	g.bg = new PIXI.Container(), g.all.addChild(g.bg)
	g.m = new PIXI.Container(), g.all.addChild(g.m)
	g.stats = new statistics(), g.all.addChild(g.stats);
	g.m0 = new PIXI.Container(), g.m.addChild(g.m0) // layer for platforms
	g.m1 = new PIXI.Container(), g.m.addChild(g.m1) // layer for items under the player
	g.m2 = new PIXI.Container(), g.m.addChild(g.m2) // layer for player
	g.m3 = new PIXI.Container(), g.m.addChild(g.m3) // layer for items over the player
	g.m4 = new PIXI.Container(), g.m.addChild(g.m4) // layer for special effects
	
	// setup 2
	this.setup2();
}

// setup 
ScrGame.prototype.setup1 = function() {
	// automatic play for testing xxx
	// g.automatic = 1;
	g.itemequip = fox.clone(g.startitemequip);
	// start new game
	g.paused = false;
	g.stopEnterFrame = g.gamestart = g.notalking = g.inv = g.endgame = g.score = g.coingot = 0;
	g.scrollmax = g.refreshrichard = g.usecoinmulti = g.usescoremulti = g.ydiv = g.playztink = 0;
	g.hit = g.pull1 = g.pull2 = g.special = g.coincombo = g.scorecombo = g.baloontotal = g.bigcointotal = 0;
	g.coinmultistart = 1;
	g.scoremulti = g.scoremultistart = 1;
	g.pyspace = g.pyspacenormal = g.hscreenhei + 80*scG;
	g.coinmultimax = g.scoremultimax = 10;
	g.coinmultistep = g.scoremultistep = g.coinmultistepnormal = g.scoremultistepnormal = 10;
	
	g.coinmulti = g.coinmultistart;
	if (g.itemequip[2] == 1) {
		g.usecoinmulti = 1;
	}
	g.scoremulti = 1;
	if (g.itemequip[4] == 1) {
		g.usescoremulti = 1;
		g.scoremulti = g.scoremultistart = 2;
	}
	g.nopress = 10;
	g.pts = 10;
	g.nextob = 0;
	g.xspacing = 80*scG;
	g.yspacing = 100*scG;
	g.noobstacle = 10; // no obstacles in the beginning
	g.specialdelay = g.sd = 99999999;
	if (g.itemequip[0] == 1) {
		// balloon
		g.specialdelay = 30;
		g.sd = 10;
	}
	g.bonusdelay = g.bd = 99999999;
	if (g.itemequip[1] == 1 || g.itemequip[3] == 1) {
		// big coins & silver coins
		g.bonusdelay = 20;
		g.bd = 5;
	}
	g.balloonrange = 10*scG;
	// backgrounds
	this.setbackground();
	g.obtype1 = [];
	g.obtype2 = [];
	g.ob1 = [];
	g.ob2 = [];
	g.coins = [];
	g.obstacles = [];
	g.hd = 1;
}

// setup 2
ScrGame.prototype.setup2 = function() {
	// make background
	g.bga = commonclass.makemovingbg(g.bgapic, g.bgadiv);
	g.bgb = commonclass.makemovingbg(g.bgbpic, g.bgbdiv);
	// move everything to the center
	g.m.x = g.hscreenwid;
	g.m.y = 0;
	g.gymin = -g.m.y;
	g.gymax = -g.m.y + g.screenhei;
	// make player
	g.startpos = g.nextob + 2 * g.yspacing;
	g.p = new playerjump();
	g.p.x = -g.hscreenwid; 
	g.p.y = g.startpos + 500*scG;
	g.p.added();
	g.m4.addChild(g.p);
	g.pole = fox.make("pole1", 0, g.hscreenhei, g.m1);
	// make blank space above player
	g.obtype1.push(0);
	g.obtype2.push(0);
	g.ob1.push(undefined);
	g.ob2.push(undefined);
	// make initial items
	this.cekmake();
	this.cekmake();
	this.cekmake();
	// difficulty
	g.diff = 50;
	// play music loop
	commonclass.playmusicloop(1);
}

// cek make 
ScrGame.prototype.cekmake = function() {
	var xx = (fox.random(100*scG) > 50*scG) ? -g.xspacing : g.xspacing;
	if (g.nextob > g.gymin - 30*scG) {
		// make coin
		var nama = "coin";
		g.bd--;
		if (g.bd < 0) {
			// make bonus
			if (g.itemequip[3] == 1) {
				nama = "bigcoin";
			} else {
				if (g.itemequip[1] == 1) {
					nama = "silvercoin";
				}
			}
			g.bd = g.bonusdelay + fox.random(10);
			g.bonusdelay++;
			g.sd = Math.max(g.sd, 7);
		}
		g.sd--;
		if (g.sd < 0) {
			// make special
			nama = "balloon";
			g.sd = g.specialdelay + fox.random(10);
			g.specialdelay++;
			g.bd = Math.max(g.bd, 5);
		}
		var it;
		if(nama == "coin"){
			it = new coin();
		}else if(nama == "bigcoin"){
			it = new bigcoin();
		}else if(nama == "silvercoin"){
			it = new silvercoin();
		}else if(nama == "balloon"){
			it = new balloon();
		}
		it.x = xx;
		it.y = g.nextob;
		it.added();
		g.m3.addChild(it);
		
		if(nama != "balloon"){
			if(it.img){
				it.img.play();
				it.img.animationSpeed = 0.5;
			}
		}
		if (xx < 0) {
			g.obtype1.push(2);
			g.ob1.push(it);
		} else {
			g.obtype2.push(2);
			g.ob2.push(it);
		}
		if (g.noobstacle > 0 || fox.random(100) > g.diff) {
			// blank spot
			if (xx > 0) {
				g.obtype1.push(0);
				g.ob1.push(undefined);
			} else {
				g.obtype2.push(0);
				g.ob2.push(undefined);
			}
			g.noobstacle = Math.max(0, g.noobstacle - 1);
		} else {
			// make obstacle
			var ob = new obstacle();
			ob.x = -xx;
			ob.y = g.nextob;
			ob.added();
			g.m2.addChild(ob);
			if (xx > 0) {
				g.obtype1.push(1);
				g.ob1.push(ob);
			} else {
				g.obtype2.push(1);
				g.ob2.push(ob);
			}
		}
		g.nextob -= g.yspacing;
		// increase difficulty
		g.diff = Math.min(80, g.diff + 0.1);
	}
}

// random plus minus
ScrGame.prototype.randomplusminus = function(value) {
	return (1 - (fox.random(1) * 2)) * value;
}

// move screen to follow player
ScrGame.prototype.movescreen = function() {
	g.m.y = g.m.y + (Math.max(g.scrollmax, -g.p.y + g.pyspace) - g.m.y) / 5;
	g.m1.y = -g.m.y;
	g.scrollmax = Math.max(g.m.y, g.scrollmax);
	g.gymin = -g.m.y;
	g.gymax = -g.m.y + g.screenhei;
	// move background
	g.bga.update();
	g.bgb.update();
}

// cek end game
ScrGame.prototype.cekendgame = function() {
	if (g.endgame && !this._gameOver) {
		this.removeAllListener();
		g.totalcoins += g.coingot;
		g.stopEnterFrame = 1;
		showEnd();
	}
}

// cek nopress
ScrGame.prototype.ceknopress = function() {
	if (g.nopress > 0) {
		g.nopress--;
	}
}

// set background 
ScrGame.prototype.setbackground = function() {
	g.bgadiv = 0.3//*scG;
	g.bgbdiv = 0.6//*scG;
	var ran = fox.getrandom("randombackgrounds");
	if (g.backgroundpriority > 0) {
		ran = g.backgroundpriority;
		g.backgroundpriority = 0;
	}
	if (ran == 2) {
		// amusement park
		g.bgapic = ["bg3a", "bg3b"];
		g.bgbpic = ["bgblank", "bgblank", "bgblank", "bg3c"];
		g.obstaclepic = "shirt3";
		g.upsetani = "richardupset3";
	} else if (ran == 3) {
		// school
		g.bgapic = ["bg5a", "bg5b"];
		g.bgbpic = ["bgblank", "bgblank", "bgblank", "bg5c"];
		g.obstaclepic = "shirt4";
		g.upsetani = "richardupset4";
	} else {
		// home
		g.bgapic = ["bg1a", "bg1b"];
		g.bgbpic = ["bgblank", "bg1c"];
		g.obstaclepic = "pants1";
		g.upsetani = "richardupset2";
	}
}

// clear page
ScrGame.prototype.clearpage = function() {
	// if (g.page) {
		// g.page.button1 ? (EC.remove(g.page.button1)) : (undefined);
		// g.page.button2 ? (EC.remove(g.page.button2)) : (undefined);
		// g.page.button3 ? (EC.remove(g.page.button3)) : (undefined);
		// g.page = undefined
	// }
	// fox.removechildren(g.r)
}

ScrGame.prototype.update = function(diffTime){
	if(options_pause || (g.paused && g.stopEnterFrame)){
		return;
	}
	
	if(g.p){
		g.p.loop();
	}
	
	this.updateall();
	this.movescreen();
	this.ceknopress();
	this.cekendgame();
	this.cekmake();
	this.ceksfx();
}

// update all
ScrGame.prototype.updateall = function(){
	for (var i = 0; i < g.coins.length; i++) {
		g.coins[i].update();
	}
	for (var f = 0; f < g.obstacles.length; f++) {
		g.obstacles[f].update();
	}
}

// cek sfx
ScrGame.prototype.ceksfx = function(){
	if (!g.delayztink) {
		if (g.playztink) {
			soundPlay("ztink");
			g.delayztink = 1;
			g.playztink = 0;
		}
	} else {
		g.delayztink--;
	}
	// VO
	if (g.notalking > 0) {
		g.notalking--;
	}
}

ScrGame.prototype.clickObj = function(item_mc) {
	// sound_play("button_click");
	var name = item_mc.name
	// console.log("clickObj:", name);
	item_mc._selected = false;
	if(item_mc.over){
		item_mc.over.visible = false;
	}
	
	if(name == "btnPause"){
		options_pause = true;
		if(ScreenPause){
			ScreenPause.visible = true;
			ScreenPause.refreshButtons();
		}
	}
}

ScrGame.prototype.checkButtons = function(evt){
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

ScrGame.prototype.touchHandler = function(evt){
	if(options_pause){
		return false;
	}
	var phase = evt.type;
	if(phase == 'touchstart' || phase == "mousedown"){
		this.checkButtons(evt);
		if(this.btnPause._selected == false){
			if(options_mobile){
				var mouseX = evt.data.global.x;
				if(mouseX < _W/2){
					g.key.ki = true;
				} else {
					g.key.ka = true;
				}
			}
		}
	} else if(phase=='mousemove' || phase == 'touchmove'){
		this.checkButtons(evt);
	} else {
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
				return false;
			}
		}
		
		if(options_mobile){
			if(mouseX < _W/2){
				g.key.ki = false;
			} else {
				g.key.ka = false;
			}
		}
	}
}

// keydown
ScrGame.prototype.keydown = function(evt){
	if(options_pause){
		return false;
	}
	var k = evt.keyCode
	var keyp;
	// player control keys
	k == g.key1 ? (g.key.at = true) : (undefined)
	k == g.key2 ? (g.key.ba = true) : (undefined)
	k == g.key3 ? (g.key.ki = true) : (undefined)
	k == g.key4 ? (g.key.ka = true) : (undefined)
	k == g.key5 ? (g.key.f1 = true) : (undefined)
	k == g.key6 ? (g.key.f2 = true) : (undefined)
	// others
	k >= 65 && k <= 90 ? (keyp = g.letterkeys[k - 65]) : (undefined)
	k >= 48 && k <= 57 ? (keyp = g.numberkeys[k - 48]) : (undefined)
	k >= 96 && k <= 111 ? (keyp = g.numpadkeys[k - 96]) : (undefined)
	
	if (keyp){
		// Check cheat words
		g.keypressed += keyp
		// trace("g.keypressed : " + g.keypressed);
		if (g.keypressed.substr(g.keypressed.length - 3, 3) == 'NNN'){
			// skip level
		}
		g.keypressed.length > 100 ? (g.keypressed = '') : (undefined)
	}
}

// key up
ScrGame.prototype.keyup = function(evt){
	if(options_pause){
		return false;
	}
	switch (evt.keyCode){
		case g.key1:
			g.key.at = false
			break;
		case g.key2:
			g.key.ba = false
			break;
		case g.key3:
			g.key.ki = false
			break;
		case g.key4:
			g.key.ka = false
			break;
		case g.key5:
			g.key.f1 = false
			break;
		case g.key6:
			g.key.f2 = false
			break;
	}
}

ScrGame.prototype.removeAllListener = function(){
	this._gameOver = true;
	clearClips();
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('mouseup', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
	window.removeEventListener("keydown", this.keydown); 
	window.removeEventListener("keyup", this.keyup); 
}
