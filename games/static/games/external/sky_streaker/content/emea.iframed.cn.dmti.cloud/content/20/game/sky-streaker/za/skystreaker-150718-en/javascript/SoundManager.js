var SoundManager = function() {
    this.allSounds = {};
    this.allMusics = {};
    this.channels  = {};

    this.currentMusic = "none";
};

SoundManager.prototype.playSound = function(value){
	if (this.allSounds[value]){
		this.allSounds[value].play();
	}
};

SoundManager.prototype.playMusic = function(value){
	// if(this.currentMusic != value){
		if (this.allMusics[this.currentMusic]){
			this.allMusics[this.currentMusic].stop();
		}
		this.currentMusic = value;
		if (this.allMusics[value]){
			this.allMusics[value].play();
		}
	// }
};

SoundManager.prototype.stopMusic = function(){
	if (this.allMusics[this.currentMusic]){
		this.allMusics[this.currentMusic].stop();
	}
};

SoundManager.prototype.initSoundModule = function() {

    var _self = this;
    function itemLoaded(){
        _self.loadedAudioFiles++;
        // console.log("this.loadedAudioFiles="+_self.loadedAudioFiles);
    };

    this.allMusics.zloop = new Howl({
        urls: ['sounds/zloop.ogg', 'sounds/zloop.m4a'],
        loop:true,
        volume:1,
        onload:itemLoaded
    });
    this.allMusics.zloop1 = new Howl({
        urls: ['sounds/zloop1.ogg', 'sounds/zloop1.m4a'],
        loop:true,
        volume:1,
        onload:itemLoaded
    });
	
    this.allSounds.zaah = new Howl({
        urls: ['sounds/zaah.ogg', 'sounds/zaah.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zbonus = new Howl({
        urls: ['sounds/zbonus.ogg', 'sounds/zbonus.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zbuy = new Howl({
        urls: ['sounds/zbuy.ogg', 'sounds/zbuy.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zcount = new Howl({
        urls: ['sounds/zcount.ogg', 'sounds/zcount.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zhit = new Howl({
        urls: ['sounds/zhit.ogg', 'sounds/zhit.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zlaugh1 = new Howl({
        urls: ['sounds/zlaugh1.ogg', 'sounds/zlaugh1.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zlaugh2 = new Howl({
        urls: ['sounds/zlaugh2.ogg', 'sounds/zlaugh2.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zlaugh3 = new Howl({
        urls: ['sounds/zlaugh3.ogg', 'sounds/zlaugh3.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zmiss = new Howl({
        urls: ['sounds/zmiss.ogg', 'sounds/zmiss.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zmultiplier = new Howl({
        urls: ['sounds/zmultiplier.ogg', 'sounds/zmultiplier.m4a'],
        onload:itemLoaded
    });
    this.allSounds.znoo = new Howl({
        urls: ['sounds/znoo.ogg', 'sounds/znoo.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zoww = new Howl({
        urls: ['sounds/zoww.ogg', 'sounds/zoww.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zpop = new Howl({
        urls: ['sounds/zpop.ogg', 'sounds/zpop.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zshield = new Howl({
        urls: ['sounds/zshield.ogg', 'sounds/zshield.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zslot = new Howl({
        urls: ['sounds/zslot.ogg', 'sounds/zslot.m4a'],
        onload:itemLoaded
    });
    this.allSounds.ztink = new Howl({
        urls: ['sounds/ztink.ogg', 'sounds/ztink.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zuuh = new Howl({
        urls: ['sounds/zuuh.ogg', 'sounds/zuuh.m4a'],
        onload:itemLoaded
    });
    this.allSounds.zwoosh = new Howl({
        urls: ['sounds/zwoosh.ogg', 'sounds/zwoosh.m4a'],
        onload:itemLoaded
    });
    
    
    this.totalAudioFiles  = Object.keys(this.allSounds).length + Object.keys(this.allMusics).length;
    // console.log("totalAudioFiles="+this.totalAudioFiles);

    this.loadedAudioFiles = 0;
};
