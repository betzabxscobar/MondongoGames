function ScrLock() {
	PIXI.Container.call( this );
	this.init();
}

ScrLock.prototype = Object.create(PIXI.Container.prototype);
ScrLock.prototype.constructor = ScrLock;

ScrLock.prototype.init = function() {
	var bgDescript = new PIXI.Graphics();
	bgDescript.beginFill(0x000000).drawRect(0, 0, _W, _H).endFill();
	this.addChild(bgDescript);
	
	var rotate = addObj("rotate_device", _W/2, _H/2);
	this.addChild(rotate);
}