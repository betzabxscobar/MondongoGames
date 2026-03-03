function movingbg() {
	PIXI.Container.call( this );
	this.init();
}

movingbg.prototype = new foxmovieclip();


movingbg.prototype.init = function() {
	this.pic;
	this.bgarray = [];
	this.bgarray2 = [];
	this.bgarrayidx = [];
	this.bgarraypos = [];
	this.savedbgidx = [];
	this.savedbgpos = [];
	this.idx = 0;
	this.dis = 0;
	this.dv = 0;
	this.oldpos = g.m.y;
	// make initial bg
	this.edge = -g.screenhei;
	
	this.a = new PIXI.Container()
	this.addChild(this.a);
}

movingbg.prototype.update = function() {
	this.dis = g.m.y - this.oldpos;
	if (this.dis != 0){
		this.y = this.dv * g.m.y;
		if (this.dis > 0){
			// cek add top
			if (this.y > this.edge){
				this.cekaddbg(-1);
			}
			if (!g.noremovebg){
				this.cekremovebg(-1);
			}
		} else if (dis < 0){
			// cek add bottom
			if (this.savedbgpos[this.savedbgpos.length - 1] < -this.y + g.screenhei){
				this.cekaddbg(1);
			}
			this.cekremovebg(1);
		}
		this.oldpos = g.m.y;
	}
}

// add bg
movingbg.prototype.cekaddbg = function(dir) {
	if (dir > 0){
		// add bottom
		var num = this.savedbgidx.pop();
		var pos = this.savedbgpos.pop();
		var it = addObj(this.pic[num], 0, pos,scG);
		this.a.addChild(it);
		this.bgarray2.push(it);
	} else {
		// add top
		if (this.idx > this.pic.length - 1){
			// if index is longer than bg pic array, repeat/insert last value in array again
			this.pic.push(this.pic[this.pic.length - 1]);
		}
		
		var it2 = addObj(this.pic[this.idx], 0, -this.edge, scG);
		this.a.addChild(it2);
		it2.setReg0();
		it2.y -= it2.height;
		this.edge += it2.height;
		this.bgarray.push(it2);
		this.bgarrayidx.push(this.idx);
		this.bgarraypos.push(it2.y);
		this.idx++;
	}
}

// remove bg
movingbg.prototype.cekremovebg = function(dir) {
	if (dir > 0){
		// remove top
		if (this.bgarray.length > 0){
			if (this.bgarray[this.bgarray.length - 1].y + this.bgarray[this.bgarray.length - 1].height < -this.y){
				this.a.removeChild(this.bgarray.pop());
			}
		}
		if (this.bgarray2.length > 0){
			if (this.bgarray2[0].y + this.bgarray2[0].height < -this.y){
				this.a.removeChild(this.bgarray2.shift());
			}
		}
	} else {
		// remove bottom
		if (this.y + this.bgarray[0].y > g.screenhei){
			this.a.removeChild(this.bgarray.shift());
			this.savedbgidx.push(this.bgarrayidx.shift());
			this.savedbgpos.push(this.bgarraypos.shift());
		}
	}
}