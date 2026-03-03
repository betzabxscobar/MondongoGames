function player() {
	PIXI.Container.call( this );
	this.init();
}

player.prototype = new foxmovieclip();


player.prototype.init = function() {
	this.a = new PIXI.Container();
	this.addChild(this.a);
	this.wear = new PIXI.Container();
	this.addChild(this.wear);
	
	this.darwin2 = addObj("darwinslide", -26*scG, -1+20*scG);
	this.addChild(this.darwin2);
	this.gumball2 = addObj("gumballslide", 26*scG, -2+20*scG);
	this.addChild(this.gumball2);
	this.darwin2.visible = this.gumball2.visible = false;
	
	this.it1;
	this.it2;
	this.scaleX = 1;
	this.arWears = [];
	this.arNameWears = [];
}

player.prototype.added = function() {
	this.ny = this.y;
	this.ys = -20*scG;
	this.yb = -10*scG;
	this.yp = 3*scG;
	this.grav = this.gravnormal = 2*scG;
	this.state = 1;
	this.tipe = 0;
	this.brange = g.balloonrange;
	this.act = "stand1";
	this.showact();
	this.d = 10;
	this.pressleft = this.pressright = this.uda = 0;
}

player.prototype.showact = function() {
	if(this.act != this.actnow){
		this.actnow = this.act;
		
		if(this.a){
			this.removeChild(this.a);
		}
		var x = 0;
		var y = 0;
		var name = this.act;
		this.wear.x = 0;
		this.wear.y = 0;
		switch (this.act){
			case "climb":
				x = 37;
				y = -10;
				this.wear.x = -37;
				this.wear.y = 10;
				break;
			case "stand1":
				x = 28;
				y = -9;
				this.wear.x = -28;
				this.wear.y = 9;
				break;
			case "stand2":
				name = "shop";
				x = 26;
				y = -3;
				this.wear.x = -26;
				this.wear.y = 3;
				break;
			case "pulled":
				x = 22;
				y = 6;
				this.wear.x = -22;
				this.wear.y = -6;
				break;
			case "balloon":
				break;
		}
		
		if(this.act == "climb"){
			if(g.key.ka){
				this.scaleX = -1;
			} else if(g.key.ki){
				this.scaleX = 1;
			}
		}
		
		this.a = addObj("richard"+name, x*scG*this.scaleX, y*scG, 1, this.scaleX);
		if(this.act == "dancing"){
		} else if(this.act == "balloon"){
			var alan2 = addObj("alan2", -19*scG, -184*scG, scG);
			alan2.img.play();
			alan2.img.animationSpeed = 0.5;
			this.a.addChild(alan2);
		} else {
			this.a.setRegX(1);
		}
		this.a.img.play();
		this.a.img.animationSpeed = 0.5;
		this.addChild(this.a);
		this.a.addChild(this.wear);
		this.addChild(this.darwin2);
		this.addChild(this.gumball2);
		
		this.refreshEquip();
	}
}

player.prototype.setPos = function(obj) {
	if(obj.name == "stand1_wear1a"){
		obj.x = -110;
		obj.y = -40;
	}else if(obj.name == "stand1_wear2a"){
		obj.x = -78;
		obj.y = -48;
	}else if(obj.name == "stand1_wear6a"){
		obj.x = -100;
		obj.y = -72;
	}else if(obj.name == "stand1_wear7a"){
		obj.x = -98;
		obj.y = -51;
	}else if(obj.name == "stand1_wear19a"){
		obj.x = -90;
		obj.y = -42;
	}else if(obj.name == "stand2_wear1a"){
		obj.x = -110;
		obj.y = -35;
	}else if(obj.name == "stand2_wear2a"){
		obj.x = -80;
		obj.y = -50;
	}else if(obj.name == "stand2_wear6a"){
		obj.x = -110;
		obj.y = -69;
	}else if(obj.name == "stand2_wear7a"){
		obj.x = -100;
		obj.y = -53;
	}else if(obj.name == "stand2_wear19a"){
		obj.x = -95;
		obj.y = -42;
	}else if(obj.name == "climb_wear1a"){
		obj.x = -93;
		obj.y = -42;
	}else if(obj.name == "climb_wear2a"){
		obj.x = -58;
		obj.y = -48;
	}else if(obj.name == "climb_wear6a"){
		obj.x = -81;
		obj.y = -72;
	}else if(obj.name == "climb_wear7a"){
		obj.x = -75;
		obj.y = -53;
	}else if(obj.name == "climb_wear19b"){
		obj.x = -79;
		obj.y = -43;
	}else if(obj.name == "pulled_wear1a"){
		obj.x = -80;
		obj.y = -52;
	}else if(obj.name == "pulled_wear2a"){
		obj.x = -44;
		obj.y = -57;
	}else if(obj.name == "pulled_wear6a"){
		obj.x = -64;
		obj.y = -81;
	}else if(obj.name == "pulled_wear7a"){
		obj.x = -63;
		obj.y = -64;
	}else if(obj.name == "pulled_wear19b"){
		obj.x = -62;
		obj.y = -57;
	}else if(obj.name == "balloon_wear1b"){
		obj.x = 34;
		obj.y = -23;
	}else if(obj.name == "balloon_wear2a"){
		obj.x = 3;
		obj.y = -35;
	}else if(obj.name == "balloon_wear6a"){
		obj.x = 21;
		obj.y = -59;
	}else if(obj.name == "balloon_wear7a"){
		obj.x = 13;
		obj.y = -42;
	}else if(obj.name == "balloon_wear19c"){
		obj.x = 14;
		obj.y = -33;
	}else if(obj.name == "dancing_wear1a"){
		obj.x = 15;
		obj.y = -50;
	}else if(obj.name == "dancing_wear2a"){
		obj.x = -21;
		obj.y = -46;
	}else if(obj.name == "dancing_wear6a"){
		obj.x = -17;
		obj.y = -82;
	}else if(obj.name == "dancing_wear7a"){
		obj.x = -10;
		obj.y = -58;
	}else if(obj.name == "dancing_wear19c"){
		obj.x = -6;
		obj.y = -45;
	}
	obj.x *=scG;
	obj.y *=scG;
}

player.prototype.clearaccessories = function() {
	for (var i = 0; i < this.arWears.length; i++) {
		this.arWears[i].visible = false;
	}
}

player.prototype.refreshEquip = function() {
	this.clearaccessories();
	this.a.img.gotoAndPlay(1);
	
	if (g.itemequip[1])
		this.cekequip(g.accessories1);
	if (g.itemequip[0])
		this.cekequip(g.accessories0);
	if (g.itemequip[2])
		this.cekequip(g.accessories2);
	if (g.itemequip[3])
		this.cekequip(g.accessories3);
	if (g.itemequip[4])
		this.cekequip(g.accessories4);
	if (g.itemequip[5])
		this.cekequip(g.accessories5);
	if (g.itemequip[6])
		this.cekequip(g.accessories6);
	if (g.itemequip[7])
		this.cekequip(g.accessories7);
	if (g.itemequip[8])
		this.cekequip(g.accessories8);
	if (g.itemequip[9])
		this.cekequip(g.accessories9);
}

player.prototype.cekequip = function(arr) {
	if(arr){
		for (var i = 0; i < arr.length; i++) {
			var name = this.act+"_"+arr[i];
			var index = this.arNameWears.indexOf(name);
			if(index > -1){
				var obj = this.arWears[index];
				obj.visible = true;
				obj.img.gotoAndPlay(1);
			} else {
				var obj = addObj(name);
				if(obj){
					if(this.act != "balloon"){
						obj.img.play();
						obj.img.animationSpeed = 0.5;
					}
					this.setPos(obj);
					this.wear.addChild(obj);
					this.arWears.push(obj);
					this.arNameWears.push(name);
				}
			}
		}
	}
}

player.prototype.loop = function() {
	this.cekpull();
	this.cekspecial();
	this.cekstate();
	
	if(g.pull1){
		this.darwin2.visible = true;
	}
	if(g.pull2){
		this.gumball2.visible = true;
	}
}

// cek special
player.prototype.cekspecial = function() {
	if (g.special && this.state < 5) {
		// balloon
		this.state = 8;
		this.act = "balloon";
		this.showact();
		fox.initxfloat(this.a, 2, 0.1);
		this.bfinish = this.ny - this.brange * g.yspacing;
		
		g.baloontotal++;
		if (g.baloontotal >= 3) {
			sendstat(101, 1); // player flew with Alan 3x in a run
		}
	}
}

// cek pull
player.prototype.cekpull = function() {
	if (g.pull1 == 1 || g.pull2 == 1) {
		if (this.state != 9) {
			this.state = 9;
			this.act = "pulled";
			this.showact();
			var nama = fox.getrandom("sfxpulled");
			if (g.itemequip[5] == 1) {
				nama = "zaah";
			}
			soundPlay(nama);
		}
	}
}

// cekstate
player.prototype.cekstate = function() {
	this.d = Math.max(0, this.d - 1);
	if (this.state == 1) {
		// stand1
		if (!this.d) {
			this.state = 2;
			this.act = "stand2";
			this.showact();
		}
	} else if (this.state == 2) {
		// stand2
		this.cekcontrol();
	} else if (this.state == 3) {
		// climbing
		this.y = this.y + (this.ny - this.y) / 3;
		if (this.d == 3 && this.uda) {
			this.uda = 0;
		}
		if (this.d <= 1) {
			if (!this.d) {
				this.state = 1;
			}
			this.cekcontrol();
			if (this.state == 3) {
				// keep climbing
				this.arrived();
			} else if (!this.d && this.state == 1) {
				this.arrived();
				this.act = "stand1";
				this.showact();
			}
		}
	} else if (this.state == 8) {
		// balloon
		this.y += this.yb;
		fox.xfloating(this.a);
		if (this.y < this.bfinish) {
			this.y = this.ny = this.bfinish;
			g.special = 0;
			this.a.x = 0;
			var obt1;
			for (var i = 0; i < this.brange; i++) {
				g.ob1.shift();
				g.ob2.shift();
				obt1 = g.obtype1.shift();
				g.obtype2.shift();
			}
			this.d = 0;
			this.state = 3;
			this.arrived();
			this.act = "stand1";
			this.showact();
			if (obt1 == 2) {
				this.scaleX = 1;
				g.hd = 1;
			} else {
				this.scaleX = -1;
				g.hd = 2;
			}
		}
	} else if (this.state == 9) {
		// pulled
		this.y += this.yp;
		if (g.pull1 + g.pull2 > 1) {
			this.yp += this.grav;
		}
		// wearing towel
		if (g.itemequip[6] == 1) {
			this.grav = 0;
			if ((g.pull1 == 1) && (g.pull2 == 1)) {
				g.pull1 = g.pull2 = 2;
				fox.make("kidsfailed", this.x, this.y, g.m4);
				g.itemequip[6] = 0;
				this.act = "climb";
				this.showact();
				this.state = 3;
				this.d = 4;
				g.nopress = 4;
				this.grav = this.gravnormal;
			}
		} else {
			if (this.y > g.gymax + 100*scG) {
				g.endgame = 1;
				this.die();
			}
		}
	}
}

// arrived
player.prototype.arrived = function() {
	if (!this.uda) {
		this.uda = 1;
		this.y = this.ny;
		
		if (this.tipe == 1) {
			// obstacle
			if (g.hd == 1) {
				this.it1.energy = 0;
			} else {
				this.it2.energy = 0;
			}
			
			if (g.itemequip[7] == 1) {
				// wearing cape as shield
				g.itemequip[7] = 0;
				fox.fadescreen(0.2);
				soundPlay("zshield");
				// clear all obstacle
				for (let mc of g.obstacles) { // forEach
					mc.energy = 0;
				}
				for (var i = 0; i < g.obtype1.length; i++) {
					if (g.obtype1[i] == 1) {
						g.obtype1[i] = 0;
					}
					if (g.obtype2[i] == 1) {
						g.obtype2[i] = 0;
					}
				}
				g.noobstacle = 40;
				g.nopress = 1;
			} else {
				// game over
				var xx = g.hd == 1 ? -80*scG : 80*scG;
				var obj = new playerupset();
				obj.x = xx;
				obj.y = this.y;
				g.m4.addChild(obj);
				g.hit = 1;
				soundPlay("zhit");
				this.die();
			}
		} else if (this.tipe == 2) {
			// coin
			g.score += g.scoremulti * g.pts;
			this.cekscoremulti();
			g.playztink = 1;
			if (g.hd == 1) {
				this.it1.got = 1;
			} else {
				this.it2.got = 1;
			}
		}
		// clear tipe
		this.tipe = 0;
	}
}

// cek score multi
player.prototype.cekscoremulti = function() {
	if (g.usescoremulti && (g.scoremulti < g.scoremultimax)) {
		g.scorecombo++;
		if (g.scorecombo >= g.scoremultistep) {
			g.scorecombo = 0;
			g.scoremultistep += 10;
			g.scoremulti++;
			commonclass.showscoremultiplier();
		}
	}
}

// auto climb for testing purposes
player.prototype.autoclimb = function() {
	this.pressleft = this.pressright = 0;
	var tipe1 = g.obtype1[0];
	if (tipe1 != 1) {
		g.key.ki = 1;
		g.key.ka = 0;
	} else {
		g.key.ki = 0;
		g.key.ka = 1;
	}
}

// cek control
player.prototype.cekcontrol = function() {
	// automatic control xxx
	if (g.automatic) {
		// stop when score is 400
		if (g.score > 400) {
			g.automatic = 0;
		}
		this.autoclimb();
	}
	// key control
	if (!g.nopress && ((g.key.ki && !this.pressleft) || (g.key.ka && !this.pressright))) {
		this.state = 3;
		this.act = "climb";
		this.showact();
		this.ny -= g.yspacing;
		this.y -= 40*scG;
		this.d = 4;
		this.scaleX = g.key.ki ? 1 : -1;
		this.a.scale.x = this.scaleX;
		g.hd = g.key.ki ? 1 : 2;
		if (g.key.ki) {
			this.pressleft = 1;
		} else if (g.key.ka) {
			this.pressright = 1;
		}
		// if next step is obstacle, stop control
		this.it1 = g.ob1.shift();
		this.it2 = g.ob2.shift();
		if (g.hd == 1) {
			this.tipe = g.obtype1.shift();
			g.obtype2.shift();
		} else {
			this.tipe = g.obtype2.shift();
			g.obtype1.shift();
		}
		if (this.tipe == 1) {
			g.nopress = 999;
		} else {
			g.nopress = 1;
		}
	}
	if (!g.key.ki) {
		this.pressleft = 0;
	}
	if (!g.key.ka) {
		this.pressright = 0;
	}
}

// climbing
player.prototype.climbing = function() {
	this.y += this.ys;
}