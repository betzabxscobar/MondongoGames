function statistics() {
	PIXI.Container.call( this );
	this.init();
}

statistics.prototype = new foxmovieclip();

statistics.prototype.init = function() {
	this.coinnow = -999;
	this.scorenow = -999;
	var coinpic = addObj("coinpic");
	coinpic.x = 200*scG; 
	coinpic.y = 20*scG;
	this.addChild(coinpic);
	var tfScore = addText(String(g.score), 26, "#FFFFFF", "#FF6801", "left", 150, 5);
	tfScore.x = 7*scG;
	tfScore.y = 10*scG;
	this.addChild(tfScore);
	this.tfScore = tfScore;
	var tfCoin = addText(String(g.coingot), 26, "#FFFFFF", "#FF6801", "left", 150, 5);
	tfCoin.x = 219*scG;
	tfCoin.y = 10*scG;
	this.addChild(tfCoin);
	this.tfCoin = tfCoin;
	
	arClips.push(this);
}

statistics.prototype.loop = function() {
	this.updatestatcoinbox()
	this.updatestatscorebox()
}

// update stat coin
statistics.prototype.updatestatcoinbox = function() {
	this.coinnow != g.coingot ? (this.coinnow = g.coingot, this.tfCoin.setText(g.coingot)) : (undefined)
}

// update stat score
statistics.prototype.updatestatscorebox = function() {
	if (this.scorenow != g.score){
		this.scorenow = g.score;
		this.tfScore.setText(g.score);
	}
}
