function fox() {
	PIXI.Container.call( this );
	this.init();
}

fox.prototype = Object.create(PIXI.Container.prototype);
fox.prototype.constructor = fox;

fox.prototype.init = function() {
	this.globalvar = [];
	
	this.globalvar.key = {at: false, ba: false, ki: false, ka: false, f1: false, f2: false}
	this.globalvar.keypressed = ''
	// key control (testing is 2QWE, or WASD) + Jump = Space-Bar + Attack = C
	this.globalvar.key1 = 38, 
	this.globalvar.key2 = 40, 
	this.globalvar.key3 = 37, 
	this.globalvar.key4 = 39,
	this.globalvar.key5 = 32, 
	this.globalvar.key6 = 67 // arrow keys control
	// other keys
	this.globalvar.letterkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	this.globalvar.numberkeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
	this.globalvar.numpadkeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '+', 'Enter', '-', '.', '/']
	this.globalvar.functionkeys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']
	this.globalvar.otherkeys = ['Space', 'Page Up', 'Page Down', 'End', 'Home', 'Left', 'Up', 'Right', 'Down']
}

fox.prototype.make = function(nama, xx, yy, place){
	var it = addObj(nama, xx, yy, 1);
	if(it == undefined){
		console.log("make:", nama);
	}
	if(place == undefined){
		console.log("place:", place);
	}
	place.addChild(it);
	return it;
}

fox.prototype.make2 = function(nama, xx, yy, place){
	var it = addObj(nama, xx, yy);
	it.y -= it.h/2;
	it.img.play();
	it.img.animationSpeed = 0.5;
	place.addChild(it);
	return it;
}

fox.prototype.pophint = function(xx, yy, no, timer, delay, place){
	if(timer){}else{timer = 80};
	if(delay){}else{delay = 0};
	
	var pl = place || this.globalvar.stat
	var it = new hint(xx, yy, no, timer, delay)
	pl.addChild(it)
}

// pop display object (example: fox.popdisplayobject("test", g.m1, 100, 100, 30, 20, 0.1, 0.1)) 
// fade out speed & fade in speed range is between 0-1
fox.prototype.popdisplayobject = function(name, place, xx, yy, time, jiggletime, fadeinspeed, fadeoutspeed){
	if(xx){}else{xx = 0};
	if(yy){}else{yy = 0};
	if(time){}else{time = 10};
	if(jiggletime){}else{jiggletime = 0};
	if(fadeinspeed){}else{fadeinspeed = 0};
	if(fadeoutspeed){}else{fadeoutspeed = 0};
	var it = new foxpopdisplayobject(name, xx, yy, time, jiggletime, fadeinspeed, fadeoutspeed);
	it.added();
	place.addChild(it);
	return it;
}

// pop moving background
fox.prototype.popmovingbackground = function(name, place, xx, yy, xs, ys, wid, hei){
	if(xx){}else{xx = 0};
	if(yy){}else{yy = 0};
	if(xs){}else{xs = 0};
	if(ys){}else{ys = 0};
	if(wid){}else{wid = 10*scG};
	if(hei){}else{hei = 0};
	
	var it = new foxmovieclip();
	it.x = xx;
	it.y = yy;
	place.addChild(it);
	it.bgname = name;
	it.xs = xs;
	it.ys = ys;
	it.bwid = wid;
	it.bhei = hei;
	arClips.push(it);
	
	var mc1 = addObj(name,0,0,scG);
	it.addChild(mc1);
	var mc2 = addObj(name, 530*scG,0,scG);
	it.addChild(mc2);
	mc1.setReg0();
	mc2.setReg0();
	
	return it;
}

fox.prototype.sortCompareDep = function(a, b){
    return a.dep<b.dep;
}

fox.prototype.sortCompareY = function(a, b){
    return a.y<b.y;
}

// sort depth of all item in Array based on Str variable (ie. "dep" or "y")
fox.prototype.sortdepth = function(arr, str){
	if(str == "dep"){
		arr.sort(sortCompareDep)
	} else {
		arr.sort(sortCompareY)
	}
	for (var i = 0; i < arr.length; i++){
		arr[i].parent.addChild(arr[i])
	}
}

// Init y floating vars
fox.prototype.inityfloat = function(t, range, speed){
	t.frange = range || 1.5
	t.fspeed = speed || 0.15
	t.fstarty = t.y
	t.fys = t.frange
	// random starting position
	var ran = 1 + this.random(30)
	for (var i = 0; i < ran; i++){
		this.yfloating(t)
	}
}

// Floating y
fox.prototype.yfloating = function(t){
	t.y += t.fys
	t.y > t.fstarty ? (t.fys = Math.max(t.fys - t.fspeed, -t.frange)) : (t.fys = Math.min(t.fys + t.fspeed, t.frange))
}

// Init x floating vars
fox.prototype.initxfloat = function(t, range, speed){
	t.frange = range || 1.5
	t.fspeed = speed || 0.15
	t.fstartx = t.x
	t.fxs = t.frange
	// random starting position
	var ran = 1 + this.random(30)
	for (var i = 0; i < ran; i++) {
		this.xfloating(t)
	}
}

// Floating x
fox.prototype.xfloating = function(t){
	t.x += t.fxs
	t.x > t.fstartx ? (t.fxs = Math.max(t.fxs - t.fspeed, -t.frange)) : (t.fxs = Math.min(t.fxs + t.fspeed, t.frange))
}

// shake screen
fox.prototype.shakescreen = function(xrange, delay){
	if(xrange){}else{xrange = 8};
	if(delay){}else{delay = 10};
	
	// TODO
}

// check if a class exists
fox.prototype.cekclass = function(className){
	return (new this[className])
}

// remove all children
fox.prototype.removechildren = function(mc){
	for (var i = mc.children.length - 1; i >= 0; i--) {	
		mc.removeChild(mc.children[i]);
	}
}

// Format number
fox.prototype.formatnumber = function(amount){
	if (!amount){
		return ("0")
	}
	// round the amount to the nearest 100th
	amount = Math.round(amount * 100) / 100;
	// convert the number to a string
	var amount_str = amount;
	// split the string by the decimal point, separating the
	// whole dollar value from the cents. Dollars are in
	// amount_array[0], cents in amount_array[1]
	var amount_array = amount_str.split(".");
	// add the dollars portion of the amount to an
	// array in sections of 3 to separate with commas
	var dollar_array = [];
	var st;
	var end = amount_array[0].length;
	while (end > 0){
		st = Math.max(end - 3, 0);
		dollar_array.unshift(amount_array[0].slice(st, end));
		end = st;
	}
	// assign dollar value back in amount_array with
	// the a comma delimited value from dollar_array
	amount_array[0] = dollar_array.join(",");
	// finally construct the return string joining
	// dollars with cents in amount_array
	return (amount_array.join("."));
}

//  pop score (x, y, skor) - just for this cricket game
fox.prototype.popskor = function(xx, yy, skor){
	var it = new popscore(xx, yy, skor)
	this.globalvar.stat.addChild(it)
}

// sort depth based on an array of MovieClips. Usage: sortdepth(enemy). 
//Just put all MC that needs to be arranged in an array. NOTE: each MC must have 'dep' as the depth variable
fox.prototype.sortdep = function(arr){
	arr.sort(sortCompareDep)
	var pr = arr[0].parent
	var i = arr.length;
	while (i--){
		pr.getChildIndex(arr[i]) != i ? (pr.setChildIndex(arr[i], i)) : (undefined)
	}
}

//  get class by name
fox.prototype.getclass = function(className){
	return this[className];
}

// Local position of MC. Usage : var localPoint:Point = localToLocal(fromMc,toMc);
fox.prototype.localpos = function(fr, to){
	var point = {x:0, y:0}
	return to.toLocal(fr.toGlobal(point));
}

// Take a screen snapshot (target, x1, y1, wid, hei, ska, xblur, yblur).
// Example: 	var snap = new MovieClip; 	
// fox.snapshot(this, snap, 300, 300, 200, 200, 2, 8, 8) ; 	addChild(snap); 
// Don't forget to remove Child to dispose of Bitmapdata!
fox.prototype.snapshot = function(sourc, dest, x1, y1, wid, hei, ska, xblur, yblur, transp, bgcolor){
	if(x1){}else{x1 = 0};
	if(y1){}else{y1 = 0};
	if(wid){}else{wid = 100};
	if(hei){}else{hei = 100};
	if(ska){}else{ska = 1};
	if(xblur){}else{xblur = 0};
	if(yblur){}else{yblur = 0};
	if(transp){}else{transp = true};
	if(bgcolor){}else{bgcolor = 0xffffff};
	
	//TODO
}

// fadescreen
fox.prototype.fadescreen = function(speed){
	if(speed){}else{speed = 0.08};
	
	//TODO
}

// framescreen
fox.prototype.framescreen = function(transparent){
	if(transparent){}else{transparent = 0};
	
	//TODO
}

// jiggle tween
fox.prototype.jiggletween = function(t, startvalue, finishvalue, time){
	if(startvalue){}else{startvalue = 2};
	if(finishvalue){}else{finishvalue = 1};
	if(time){}else{time = 1};
	
	var r = globalvar;
	var param1 = r.easeparam1 || 1;
	var param2 = r.easeparam2 || 0.25;
	t.scale.x = t.scale.y = startvalue;
	// TweenLite.to(t, time, {scaleX: finishvalue, scaleY: finishvalue, ease: Elastic.easeOut.config(param1, param2)});
}

// Init jiggle
fox.prototype.initjiggle = function(t, startvalue, finishvalue, div, step){
	if(startvalue){}else{startvalue = 2};
	if(finishvalue){}else{finishvalue = 1};
	if(div){}else{div =  0.7};
	if(step){}else{step =  0.5};
	
	t.scale.x = startvalue
	t.scale.y = t.scale.x
	t.jska = finishvalue
	t.jdx = 0
	t.jdv = div
	t.jdvstep = step
}

// Jiggling
fox.prototype.jiggle = function(t){
	t.jdx = t.jdx * t.jdvstep + (t.jska - t.scale.x) * t.jdv
	t.scale.x = Math.max(0.1, t.scale.x + t.jdx)
	t.scale.y = t.scale.x
}

// tint MC
fox.prototype.tint = function(mc, colr, streng){
	//TODO
}

// reset color
fox.prototype.resetcolor = function(mc){
	//TODO
}

// blink - Note: mc Class must be dynamic
fox.prototype.blink = function(mc, delay){
	if(delay){}else{delay = 20};
	
	//TODO
}

// tint flash MC (delay, color - default is RED) - Note: mc Class must be dynamic
fox.prototype.tintflash = function(mc, delay, colr, thickness, strength){
	if(delay){}else{delay = 10};
	if(colr){}else{colr = 0xFF0000};
	if(thickness){}else{thickness = 7};
	if(strength){}else{strength = 1};
	
	//TODO
}

// remove all children
fox.prototype.removeallchildren = function(target){
	for (var i = target.children.length - 1; i >= 0; i--) {	
		target.removeChild(target.children[i]);
	}
}

// stop all movieclips
fox.prototype.massStop = function(target, _frame){
	if(_frame){}else{_frame = 1};
	
	//TODO
}

// play all movieclips
fox.prototype.massPlay = function(target){
	//TODO
}

// duplicateDisplayObject from Senocular. creates a duplicate of the DisplayObject passed.
// similar to duplicateMovieClip in AVM1. If using Flash 9, make sure you export for ActionScript the symbol you are duplicating
// @param target the display object to duplicate
// @param autoAdd if true, adds the duplicate to the display list in which target was located
// @return a duplicate instance of target
fox.prototype.duplicateDisplayObject = function(targe, autoAddt){
	if(autoAdd){}else{autoAdd = false};
	
	//TODO
}

// get random value from array, no repeat. Usage : getrandom("animals")
// WARNING: Array must be globalvar array!!
fox.prototype.getrandom = function(arr){
	// is the array already registered? if not yet, register it so we can use resetrandom function
	var r = this.globalvar
	!r.randomlisting ? (r.randomlisting = []) : (undefined);
	// not yet in listing? add this array
	!this.contain(r.randomlisting, arr) ? (r.randomlisting.push(arr)) : (undefined);
	// make random array if necessary
	!r[arr + "getrandom"] ? (r[arr + "getrandom"] = []) : (undefined);
	if (!r[arr + "getrandom"].length){
		r[arr + "getrandom"] = []
		r[arr + "getrandom"] = this.clone(r[arr])
		this.randomize(r[arr + "getrandom"]);
		// check if same with next, remove it
		r[arr + "getrandom"].length > 1 && r[arr + "lastpop"] == r[arr + "getrandom"][r[arr + "getrandom"].length - 1] ? (r[arr + "getrandom"].pop()) : (undefined);
	}
	// pop a random res
	r[arr + "lastpop"] = r[arr + "getrandom"].pop()
	return r[arr + "lastpop"]
}

// reset all array getrandom vars
fox.prototype.resetrandom = function(){
	var r = this.globalvar;
	if (r.randomlisting){
		for (i = 0; i < r.randomlisting.length; i++){
			r[r.randomlisting[i] + "getrandom"] = undefined;
			r[r.randomlisting[i] + "lastpop"] = undefined;
		}
	}
}

// cek if array contains value
fox.prototype.contain = function(arr, value){
	return arr.indexOf(value) >= 0
}

// analyze the content of an object
fox.prototype.analyze = function(_obj, lastItem){
	if(lastItem){}else{lastItem = ''};
	var item;
	//TODO
}

fox.prototype.currency = function(num, decimalPlace, currency){
	if(decimalPlace){}else{decimalPlace = 2};
	if(currency){}else{currency = "$"};
	
	//assigns true boolean value to neg in number less than 0
	var neg = (num < 0);
	//make the number positive for easy conversion
	num = this.abs(num)
	var roundedAmount = num.toFixed(decimalPlace);
	//split string into array for dollars and cents
	var amountArray = roundedAmount.split(".");
	var dollars = amountArray[0]
	var cents = amountArray[1]
	//create dollar amount
	var dollarFinal = ""
	var i = 0
	for (i; i < dollars.length; i++){
		i > 0 && (i % 3 == 0) ? (dollarFinal = "," + dollarFinal) : (undefined);
		dollarFinal = dollars.substr(-i - 1, 1) + dollarFinal;
	}
	//create Cents amount and zeros if necessary
	var centsFinal = cents;
	var missingZeros = decimalPlace - centsFinal.length;
	if (centsFinal.length < decimalPlace){
		for (var j = 0; j < missingZeros; j++){
			centsFinal += "0";
		}
	}
	var finalString = ""
	neg ? (finalString = "-" + currency + dollarFinal) : (finalString = currency + dollarFinal);
	decimalPlace > 0 ? (finalString += "." + centsFinal) : (undefined);
	return finalString;
}

// get random number between min & max
fox.prototype.random = function(maxNum){
	return (Math.floor(Math.random() * (maxNum + 1)));
}

// randomize an array
fox.prototype.randomize = function(arr){
	arr.sort(this.randomSort);
}

fox.prototype.randomSort = function(objA, objB){
	return Math.round(Math.random() * 2) - 1
}

// limit a value
fox.prototype.limit = function(value, floor, ceil){
	return Math.min(ceil, Math.max(floor, value));
}

// absolute value
fox.prototype.abs = function(x){
	return (x ^ (x >> 31)) - (x >> 31)
}

// find out is value is even
fox.prototype.isEven = function(i){
	return ((i & 1) == 0)
}

// cek if value is multiple of
fox.prototype.isMultipleOf = function(value, BaseNum){
	return !(value % BaseNum);
}

// cek if value is between lo & hi
fox.prototype.between = function(value, lo, hi){
	return (value > lo && value < hi);
}

// make a copy/clone of an object
fox.prototype.clone = function(source){
	var copier = [];
	if(source){
		copier = JSON.parse(JSON.stringify(source))
	}
	return copier;
	// var ar = []
	// for (var i = 0; i <source.length; i++) {
		// ar.push(source[i])
	// }
	// return ar;
	
	// https://lodash.com/docs#cloneDeep
}

// cek bound hit
fox.prototype.cekhit = function(target1, target2, commonParent){
	var result = false
	//TODO
	return result;
}

// remove value from array
fox.prototype.removevalue = function(value, arr){
	for (var i = 0; i < arr.length; i++){
		arr[i] == value ? (arr = arr.splice(i, 1)) : (undefined);
	}
}

fox.prototype.rad = function(qdeg){
	return qdeg * (Math.PI / 180);
}

fox.prototype.deg = function(qrad){
	return qrad * (180 / Math.PI);
}

// Limit angle to 360 degrees
fox.prototype.limit360 = function(ang){
	return (((ang % 360) + 360) % 360);
}

// Save cookie data to local computer
fox.prototype.savecookie = function(vari, value, cookiename){
	saveData();
}

// Load cookie data from local computer
fox.prototype.loadcookie = function(vari, cookiename){
	loadData();
}
