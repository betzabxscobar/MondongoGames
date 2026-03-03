var commonclass = function() {
   
};

// equip
commonclass.prototype.equip = function(num){
	var g = fox.globalvar;
	if (g.itemequip[num] == 0) {
		g.itemequip[num] = 1;
	} else {
		g.itemequip[num] = 0;
	}
	// check compatibility with other items
	if (num == 0)
		this.cekcompatibility(g.compatibility0);
	if (num == 1)
		this.cekcompatibility(g.compatibility1);
	if (num == 2)
		this.cekcompatibility(g.compatibility2);
	if (num == 3)
		this.cekcompatibility(g.compatibility3);
	if (num == 4)
		this.cekcompatibility(g.compatibility4);
	if (num == 5)
		this.cekcompatibility(g.compatibility5);
	if (num == 6)
		this.cekcompatibility(g.compatibility6);
	if (num == 7)
		this.cekcompatibility(g.compatibility7);
	if (num == 8)
		this.cekcompatibility(g.compatibility8);
	if (num == 9)
		this.cekcompatibility(g.compatibility9);
	g.startitemequip = fox.clone(g.itemequip);
}

// cek compatibility
commonclass.prototype.cekcompatibility = function(arr){
	var g = fox.globalvar;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == 0) {
			g.itemequip[i] = 0;
		}
	}
}

// show coin multiplier
commonclass.prototype.showcoinmultiplier = function(){
	var g = fox.globalvar;
	var it = new coinsmultiplier();
	it.x = g.screenwid - 60*scG;
	it.y = g.screenhei - 60*scG;
	g.stats.addChild(it)
	soundPlay("zmultiplier");
}

// show score multiplier
commonclass.prototype.showscoremultiplier = function(){
	var g = fox.globalvar;
	var it = new scoremultiplier();
	it.x = 60*scG;
	it.y = g.screenhei - 60*scG;
	g.stats.addChild(it)
	soundPlay("zmultiplier");
}

// make moving background
commonclass.prototype.makemovingbg = function(pic, dv){
	var g = fox.globalvar;
	var it = new movingbg();
	it.x = it.y = 0;
	it.pic = pic;
	it.dv = dv;
	it.cekaddbg(-1);
	g.bg.addChild(it);
	return it;
}

// play music loop
commonclass.prototype.playmusicloop = function(num){
	var g = fox.globalvar;
	if (g.playingzloop != num) {
		if (g.playingzloop > 0) {
			// stop old loop
			if (g.playingzloop == 99) {
				musicStop();
			} else {
				musicStop();
			}
		}
		// play new loop
		if (num == 99) {
			musicPlay("zloop", 1, 0, 999999);
		} else {
			musicPlay("zloop" + num, 1, 0, 999999);
		}
		g.playingzloop = num;
	}
}

// say VO
commonclass.prototype.say = function(vo){
	var g = fox.globalvar;
	if (!g.notalking) {
		soundPlay("zvo1" + vo);
		g.notalking = 10;
	}
}

// reset game
commonclass.prototype.resetgame = function(){
	var g = fox.globalvar;
	g.totalcoins = g.score = 0;
	g.itempaid1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	g.itemequip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	g.startitemequip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	fox.savecookie("score", 0, "CNGumballClimber");
	fox.savecookie("coins", 0, "CNGumballClimber");
	fox.savecookie("item1", g.itempaid1, "CNGumballClimber");
}

// get item cost
commonclass.prototype.itempaidstatus = function(category, idx){
	var g = fox.globalvar;
	var res = 0;
	if (category == 1)
		res = g.itempaid1[idx - 1];
	return res;
}

// get item cost
commonclass.prototype.getitemcost = function(category, idx){
	var g = fox.globalvar;
	var res = 0;
	if (category == 1) {
		if (idx == 1)
			res = g.itemcost11[g.itempaid1[0]];
		if (idx == 2)
			res = g.itemcost12[g.itempaid1[1]];
		if (idx == 3)
			res = g.itemcost13[g.itempaid1[2]];
		if (idx == 4)
			res = g.itemcost14[g.itempaid1[3]];
		if (idx == 5)
			res = g.itemcost15[g.itempaid1[4]];
		if (idx == 6)
			res = g.itemcost16[g.itempaid1[5]];
		if (idx == 7)
			res = g.itemcost17[g.itempaid1[6]];
		if (idx == 8)
			res = g.itemcost18[g.itempaid1[7]];
		if (idx == 9)
			res = g.itemcost19[g.itempaid1[8]];
		if (idx == 10)
			res = g.itemcost110[g.itempaid1[9]];
	}
	return res;
}

// pop message
commonclass.prototype.popmsg = function(place, xx, yy, say){
	var g = fox.globalvar;
	var it = new popmessage(xx, yy, say);
	place.addChild(it);
}
// pop bonus name
commonclass.prototype.popbonusnm = function(xx, yy, st){
	var g = fox.globalvar
	var it = new popbonusname(xx, yy, st)
	g.stat.addChild(it)
}
