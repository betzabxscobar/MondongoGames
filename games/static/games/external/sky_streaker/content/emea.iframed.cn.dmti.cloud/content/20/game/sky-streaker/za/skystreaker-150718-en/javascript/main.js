var scG = 2;
var _W = 400*scG;
var _H = 600*scG;

var login_obj = {};
var arClips = [];
var fox = new fox();
var commonclass = new commonclass();
var g = fox.globalvar;
var language;
var startTime;
var renderer, stage, preloader; // pixi;
var soundManager;
var LoadBack = null;
var barLoading = null;
var barMask = null;
var LoadPercent = null;
var LoadRabbit = null;
var LogoGame = null;
var barLoad = null;
var sprites_loaded = false;
var dataAnima = [];
var dataMovie = [];
var dataSound = [];
var cache = {};
var fontMain = "ITC Lubalin Graph W03 D1489630";
var fontArchivo = "Archivo Black";
var fontFranklin = "Franklin Gothic Heavy";
var stats; //для вывода статистики справа

var options_debug = false;
var options_music = true;
var options_sound = true;
var options_mobile = true;
var options_pause = false;
var options_orientation = null;
var options_horizont = true;
var options_quality = "high"; // high, medium, low
var options_txt_offset = 0;
var options_browser = "none";
var options_force_desktop = false;
var djangoRunStartMs = 0;
var djangoPartidaReported = false;

var KEYCODE_LEFT = 37, 
	KEYCODE_RIGHT = 39,
	KEYCODE_UP = 38, 
	KEYCODE_DOWN = 40;
	KEYCODE_A = 65;
	KEYCODE_D = 68;
	KEYCODE_S = 83;
	KEYCODE_SPACE = 32;

var ScreenMenu, ScreenMainMenu, ScreenGame, ScreenIntro1, ScreenIntro2, 
ScreenShop, ScreenEnd, ScreenCN, ScreenPause;
var ScreenLock;
var itemTexture;
var currentScreen, scrContainer;
var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) { return window.setTimeout(callback, 1000 / 60); };
	
var fpsLabel = addText("FONT LOAD", 40, "#FF0000", "#000000", "center", 150, 6);
fpsLabel.x = _W/2;
fpsLabel.y = - 200;

function init(lang) {
	if(lang){}else{lang="en"}

	var ua = navigator.userAgent || "";
	var isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
	var forceDesktop = false;
	try {
		forceDesktop = new URLSearchParams(window.location.search).get("desktop") === "1";
	} catch (e) {}
	options_force_desktop = forceDesktop;

	if(forceDesktop || !isMobileUA){
		options_mobile = false;
	} else if(window.orientation == undefined){
		options_mobile = false;
	} else {
		options_mobile = true;
		options_orientation = window.orientation;
	}
	
    var ua = navigator.userAgent;
    if (ua.search(/Safari/) > -1) {
        options_browser = "safari";
    }
	
	if(typeof console === "undefined"){ console = {}; }
	
    //initialize the stage
    renderer = PIXI.autoDetectRenderer(_W, _H);
    stage = new PIXI.Container();
    document.body.appendChild(renderer.view);
    preloader = new PIXI.loaders.Loader();

    window.addEventListener("resize", onResize, false);

	startTime = getTimer();
    onResize();
    update();
	
	language = new eliteLang();
	language.add_lang_xml('en');
	language.add_lang_xml('fr');
	language.add_lang_xml('es');
	language.add_lang_xml('de');
	language.add_lang_xml('it');
	language.add_lang_xml('pl');
	language.add_lang_xml('ru');
	language.add_lang_xml('tr');
	language.loadSettings();
	language.setLanguage(lang);
	
	if(lang){
		if(lang == "pl" || lang == "tr"){
			fontMain = fontArchivo;
		} else if(lang == "ru"){
			fontMain = fontFranklin;
		}
	}
	
	soundManager = new SoundManager();
	soundManager.currentMusic = "none";
	
	LoadBack = new PIXI.Container();
	stage.addChild(LoadBack);
	scrContainer = new PIXI.Container();
	stage.addChild(scrContainer);
	
	createScreenLoader();
	loadManifest();
}

function createScreenLoader(){
	var bgContainer = new PIXI.Container();
	LoadBack.addChild(bgContainer);
	var barContainer = new PIXI.Container();
	LoadBack.addChild(barContainer);
	var frameContainer = new PIXI.Container();
	LoadBack.addChild(frameContainer);
	
	var preload_image = document.createElement("img");
	preload_image.src = "images/bg/bgLoad.jpg";
	preload_image.onload = function() {
		var LoadBack1 = new PIXI.Sprite.fromImage(preload_image.src);
		LoadBack1.texture.baseTexture.on('loaded', 
				function(){
					LoadBack1.scale.x = 0.5;
					LoadBack1.scale.y = LoadBack1.scale.x;
					LoadBack1.x = _W/2 - LoadBack1.width/2;
					LoadBack1.y = _H/2 - LoadBack1.height/2 - 50;
				});
		bgContainer.addChild(LoadBack1);
	};
	var preload_frame = document.createElement("img");
	preload_frame.src = "images/items/frameLoading.png";
	preload_frame.onload = function() {
		var frameLoading = new PIXI.Sprite.fromImage(preload_frame.src);
		frameLoading.texture.baseTexture.on('loaded', 
				function(){
					frameLoading.x = _W/2 - frameLoading.width/2;
					frameLoading.y = _H/2 + 80 - frameLoading.height/2;
				});
		frameContainer.addChild(frameLoading);
	};
	var preload_bar = document.createElement("img");
	preload_bar.src = "images/items/barLoading.png";
	preload_bar.onload = function() {
		barLoading = new PIXI.Sprite.fromImage(preload_bar.src);
		barLoading.texture.baseTexture.on('loaded', 
				function(){
					barLoading.x = _W/2 - barLoading.width/2;
					barLoading.y = _H/2 + 80 - barLoading.height/2;
					barMask = new PIXI.Graphics();
					barMask.beginFill(0x000000).drawRect(0, 0, 313, 32).endFill();
					barMask.x = barLoading.x;
					barMask.y = barLoading.y;
					LoadBack.addChild(barMask);
					barLoading.mask = barMask;
				});
		barContainer.addChild(barLoading);
	};
}

function loadManifest(){
	soundManager.initSoundModule();
	preloader = new PIXI.loaders.Loader();
	
	preloader.add("bgLoad", "images/bg/bgLoad.jpg");
	preloader.add("bgPause", "images/bg/bgPause.jpg");
	preloader.add("bgMenu", "images/bg/bgMenu.jpg");
	preloader.add("bgMenu2", "images/bg/bgMenu2.jpg");
	preloader.add("bgIntro1", "images/bg/bgIntro1.jpg");
	preloader.add("bgIntro2", "images/bg/bgIntro2.jpg");
	preloader.add("bgShop", "images/bg/bgShop.jpg");
	preloader.add("bgEnd", "images/bg/bgEnd.jpg");
	preloader.add("bgblank", "images/bg/bgblank.png");
	preloader.add("bg1a", "images/bg/bg1a.jpg");
	preloader.add("bg1b", "images/bg/bg1b.jpg");
	preloader.add("bg1c", "images/bg/bg1c.png");
	preloader.add("bg2a", "images/bg/bg2a.jpg");
	preloader.add("bg2b", "images/bg/bg2b.jpg");
	preloader.add("bg2c", "images/bg/bg2c.png");
	preloader.add("bg3a", "images/bg/bg3a.jpg");
	preloader.add("bg3b", "images/bg/bg3b.jpg");
	preloader.add("bg3c", "images/bg/bg3c.png");
	preloader.add("bg4a", "images/bg/bg4a.jpg");
	preloader.add("bg4b", "images/bg/bg4b.jpg");
	preloader.add("bg4c", "images/bg/bg4c.png");
	preloader.add("bg5a", "images/bg/bg5a.jpg");
	preloader.add("bg5b", "images/bg/bg5b.jpg");
	preloader.add("bg5c", "images/bg/bg5c.png");
	preloader.add("bg6a", "images/bg/bg6a.jpg");
	preloader.add("bg6b", "images/bg/bg6b.jpg");
	preloader.add("bg6c", "images/bg/bg6c.png");
	
	preloader.add("images/texture/Anima1Texture.json");
	preloader.add("images/texture/Anima2Texture.json");
	preloader.add("images/texture/Anima3Texture.json");
	preloader.add("images/texture/Anima4Texture.json");
	preloader.add("images/texture/Anima5Texture.json");
	preloader.add("images/texture/Anima6Texture.json");
	preloader.add("images/texture/Anima7Texture.json");
	preloader.add("images/texture/Anima8Texture.json");
	preloader.add("images/texture/ItemsTexture.json");
	
	//сохраняем счетчик кол-ва файлов для загрузки
	preloader.on("progress", handleProgress);
	preloader.load(handleComplete);
}

function checkProgress() {
	var progress = (preloader.progress/100 + soundManager.loadedAudioFiles/soundManager.totalAudioFiles)/2;
    progress < 0 ? progress = 0 : 0;
	percent = Math.floor(progress*100);
	
    if (progress<1){
        setTimeout(checkProgress, 100);
    }else{
        handleComplete();
    }
}

function spritesLoad() {
	if(sprites_loaded){
		return true;
	}
	sprites_loaded = true;
	
	var img, data;
}

function textureLoad() {
	iniSet("images/texture/Anima1Texture.json");
	iniSet("images/texture/Anima2Texture.json");
	iniSet("images/texture/Anima3Texture.json");
	iniSet("images/texture/Anima4Texture.json");
	iniSet("images/texture/Anima5Texture.json");
	iniSet("images/texture/Anima6Texture.json");
	iniSet("images/texture/Anima7Texture.json");
	iniSet("images/texture/Anima8Texture.json");
	iniSetArt("images/texture/ItemsTexture.json");
}

function iniSet(set_name) {
	var json = preloader.resources[set_name]
	if(json){}else{
		console.log("ERROR: " + set_name + " is undefined");
		return;
	}
	json = json.data;
	
	var jFrames = json.frames;
	var data = preloader.resources[set_name].textures; 
	var dataTexture = [];
	var animOld = "";
	// console.log("set_name:", set_name);
	
	if(data && jFrames){
		for (var namePng in jFrames) {
			var index = namePng.indexOf(".png");
			var nameFrame = namePng;
			if (index > 1) {
				nameFrame = namePng.slice(0, index);
			}
			// console.log("nameFrame:", nameFrame, index2);
			
			var index2 = nameFrame.indexOf("/");
			if (index2 > 1) {
				var type = nameFrame.slice(0, index2); // тип анимации
				var anim = type; // имя сета
				if(anim != animOld){
					animOld = anim;
					dataTexture[anim] = [];
				}
				dataTexture[anim].push(PIXI.Texture.fromFrame(namePng));
				// console.log(nameFrame + ": ", anim, namePng);
			}
		}
		
		for (var name in dataTexture) {
			var arrayFrames = dataTexture[name]; // какие кадры используются в сети
			dataMovie[name] = arrayFrames;
			// console.log(name + ": ", arrayFrames);
			// console.log(name);
		}
	}
}

function iniSetArt(set_name) {	
	var json = preloader.resources[set_name]
	if(json){}else{
		console.log("ERROR: " + set_name + " is undefined");
		return;
	}
	json = json.data;
	
	var frames = json.frames;
	var data = preloader.resources[set_name].textures; 
	// console.log("set_name:", set_name);
	
	if(data && frames){
		for (var namePng in frames) {
			var index = namePng.indexOf(".png");
			var nameFrame = namePng;
			if (index > 1) {
				nameFrame = namePng.slice(0, index);
			}
			dataAnima[nameFrame] = data[namePng];
			// console.log("nameFrame:", nameFrame);
		}
	}
}

function handleProgress(){
	percent = ((preloader.progress/100 + soundManager.loadedAudioFiles/soundManager.totalAudioFiles)/2)*100;
	percent = Math.floor(percent);
    percent < 0 ? percent = 0 : 0;
	
	if(LoadPercent){
		LoadPercent.setText(percent + "%");
	}
	if(barMask){
		barMask.x = barLoading.x - barLoading.width + barLoading.width*(percent/100)
	}
}

function handleComplete(){
	loadData();
	spritesLoad();
	textureLoad();
    onResize();
	
	ScreenPause = new ScrPause();
	ScreenPause.visible = false;
	stage.addChild(ScreenPause);
	
	ScreenLock = new ScrLock();
	ScreenLock.visible = false;
	stage.addChild(ScreenLock);
	
	start();
}

function getTimer(){
	var d = new Date();
	var n = d.getTime();
	return n;
}

function refreshTime(){
	startTime = getTimer();
}

function reportPartidaToDjango(scoreValue){
	if (djangoPartidaReported) {
		return;
	}
	var score = Number(scoreValue || 0);
	if (score < 0) {
		score = 0;
	}
	var startedAt = djangoRunStartMs || getTimer();
	var elapsedSec = Math.max(0, Math.floor((getTimer() - startedAt) / 1000));
	var payload = { score: score, tiempo_juego: elapsedSec };
	try {
		if (window.parent && typeof window.parent.registrarPartida === "function") {
			window.parent.registrarPartida(payload);
			djangoPartidaReported = true;
			return;
		}
		if (typeof window.registrarPartida === "function") {
			window.registrarPartida(payload);
			djangoPartidaReported = true;
		}
	} catch (e) {}
}

function sendstat(id, value){
	// _achievementSystem.sendStat(id, value)
}

function saveData() {
	if(isLocalStorageAvailable()){
		var login_str = JSON.stringify(login_obj);
		localStorage.setItem('j2d_skystreaker', login_str);
		localStorage.setItem('options_music', options_music);
		localStorage.setItem('options_sound', options_sound);
		login_obj["score"] = g.highscore;
		login_obj["coins"] = g.totalcoins;
		login_obj["item1"] = g.itempaid1;
		// console.log("Saving: ok!");
	}
}

function loadData() {
	initData();
	if(isLocalStorageAvailable()){
		if (localStorage.getItem('j2d_skystreaker')){
			var login_str = localStorage.getItem('j2d_skystreaker')
			login_obj = JSON.parse(login_str);
			options_music = localStorage.getItem('options_music')=='true';
			options_sound = localStorage.getItem('options_sound')=='true';
			// load previous highscore
			g.highscore = login_obj["score"] || 0;
			g.totalcoins = login_obj["coins"] || 0;
			g.itempaid1 = login_obj["item1"] || [0, 0, 0, 0, 0];
			// console.log("Loading: ok!");
		} else {
			// console.log("Loading: fail!");
		}
	}
}

function initData() {
	//=====================
	g.skipmenu = 0;
	g.skipCNintro = 0;
	g.notsavingcookie = 0;
	g.usecheats = 0;
	//=====================
	g.mute = g.udamusik = 0;
	allsfx = ["zloop", "zloop1", "zslot", "zshield", "ztink", "zcount", "zwoosh", "zhit", "znoo", 
			"zaah", "zoww", "zuuh", "zaah", "zlaugh1", "zlaugh2", "zlaugh3", "zbonus", "zbuy", 
			"zpop", "zmultiplier", "zmiss"];
	g.screenwid = 400*scG;
	g.screenhei = 600*scG;
	g.hscreenwid = g.screenwid / 2;
	g.hscreenhei = g.screenhei / 2;
	g.playingzloop = 0;
	g.udainit = 0;
	// sfx
	g.sfxpulled = ["zaah", "znoo", "zoww"];
	g.sfxlaughs = ["zlaugh1", "zlaugh2", "zlaugh3"];
	// backgrounds
	g.randombackgrounds = [1, 2, 3];
	// shop items
	g.icontype1 = ["icon11", "icon119", "icon16", "icon12", "icon17"];
	g.itemtype1 = ["item11", "item119", "item16", "item12", "item17"];
	g.itemname1 = ["headphones", "red_glasses", "foil_hat", "funny_glasses", "blonde_wig"];
	g.itemdescription1 = ["headphones_desc", 
						"red_glasses_desc", 
						"foil_hat_desc", 
						"funny_glasses_desc", 
						"blonde_wig_desc"];
	g.accessories0 = ["wear1a", "wear1b"];
	g.accessories1 = ["wear19a", "wear19b", "wear19c"];
	g.accessories2 = ["wear6a"];
	g.accessories3 = ["wear2a"];;
	g.accessories4 = ["wear7a"];
	g.allaccessories = g.accessories0.concat(g.accessories1, g.accessories2, g.accessories3, g.accessories4);
	g.compatibility0 = [1, 1, 1, 1, 0];
	g.compatibility1 = [1, 1, 1, 0, 1];
	g.compatibility2 = [1, 1, 1, 1, 0];
	g.compatibility3 = [1, 0, 1, 1, 1];
	g.compatibility4 = [0, 1, 0, 1, 1];
	// item cost
	g.itemcost11 = [50, 99999999];
	g.itemcost12 = [200, 99999999];
	g.itemcost13 = [1000, 99999999];
	g.itemcost14 = [3000, 99999999];
	g.itemcost15 = [8000, 99999999];
	//
	g.itemcategory = 1;
	g.itemequip = [0, 0, 0, 0, 0];
	g.startitemequip = [0, 0, 0, 0, 0];
	g.udashophint = 0;
	g.backgroundpriority = 1;
	// load previous highscore
	g.highscore = login_obj["score"] || 0;
	g.totalcoins = login_obj["coins"] || 0;
	g.itempaid1 = login_obj["item1"] || [0, 0, 0, 0, 0];
	g.newbuy1 = -1;
}

function resetData() {
	login_obj = {};
	var g = fox.globalvar;
	g.totalcoins = g.score = 0;
	g.itempaid1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	g.itemequip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	g.startitemequip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	saveData();
}

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
		console.log("localStorage_failed:",e);
        return false;
    }
}

function start() {
    if (LoadBack) {
        stage.removeChild(LoadBack);
    }
    addScreen("menu");
}

function update() {
	raf(update);
	renderer.render(stage);
	if(options_pause){
		return;
	}
	var diffTime = getTimer() - startTime;
	if(diffTime > 29){
		if (ScreenMenu) {
			ScreenMenu.update(diffTime);
		}
		if (ScreenIntro1) {
			ScreenIntro1.update(diffTime);
		}
		if (ScreenIntro2) {
			ScreenIntro2.update(diffTime);
		}
		if (ScreenShop) {
			ScreenShop.update(diffTime);
		}
		if (ScreenMainMenu) {
			ScreenMainMenu.update(diffTime);
		}
		if (ScreenGame) {
			ScreenGame.update(diffTime);
		}
		if (ScreenEnd) {
			ScreenEnd.update(diffTime);
		}
	
		for (var i = 0; i < arClips.length; i++) {
			var clip = arClips[i];
			if(clip){
				clip.enter_frame();
			}
		}
		
		startTime = getTimer();
	}
}

function clearClips() {
	for (var i = 0; i < arClips.length; i++) {
		var clip = arClips[i];
		if(clip){
			clip.removed_from_stage();
			clip.die();
		}
	}
	
	arClips = [];
}

function musicStop() {
	soundManager.stopMusic();
}
function musicPlay(val) {
	if(options_music){
		// soundManager.stopMusic();
		soundManager.playMusic(val);
	}
}
function soundPlay(val) {
	if(options_sound){
		soundManager.playSound(val);
	}
}

function getText(txt) {
	return language.get_txt(txt);
}

function removeAllScreens() {
	ScreenPause.visible = false;
	if(ScreenMenu){
		scrContainer.removeChild(ScreenMenu);
		ScreenMenu = null;
	}
	if(ScreenMainMenu){
		scrContainer.removeChild(ScreenMainMenu);
		ScreenMainMenu = null;
	}
	if(ScreenGame){
		scrContainer.removeChild(ScreenGame);
		ScreenGame = null;
	}
	if(ScreenIntro1){
		scrContainer.removeChild(ScreenIntro1);
		ScreenIntro1 = null;
	}
	if(ScreenIntro2){
		scrContainer.removeChild(ScreenIntro2);
		ScreenIntro2 = null;
	}
	if(ScreenShop){
		scrContainer.removeChild(ScreenShop);
		ScreenShop = null;
	}
	if(ScreenEnd){
		scrContainer.removeChild(ScreenEnd);
		ScreenEnd = null;
	}
	if(ScreenCN){
		scrContainer.removeChild(ScreenCN);
		ScreenCN = null;
	}
	if(currentScreen){
		scrContainer.removeChild(currentScreen);
		currentScreen = null;
	}
}

function addScreen(name) {
	removeAllScreens();
	
	if(name == "menu"){
		commonclass.playmusicloop(99);
		ScreenMenu = new ScrMenu();
		ScreenMenu.name = "menu";
		currentScreen = ScreenMenu;
	}else if(name == "mainmenu"){
		ScreenMainMenu = new ScrMainMenu ();
		ScreenMainMenu.name = "mainmenu";
		currentScreen = ScreenMainMenu;
	}else if(name == "intro1"){
		ScreenIntro1 = new ScrIntro1();
		ScreenIntro1.name = "intro1";
		currentScreen = ScreenIntro1;
	}else if(name == "intro2"){
		ScreenIntro2 = new ScrIntro2();
		ScreenIntro2.name = "intro2";
		currentScreen = ScreenIntro2;
	}else if(name == "shop"){
		ScreenShop = new ScrShop();
		ScreenShop.name = "shop";
		currentScreen = ScreenShop;
	} else if(name == "game"){
		ScreenGame = new ScrGame();
		ScreenGame.name = "game";
		currentScreen = ScreenGame;
	} else if(name == "end"){
		ScreenEnd = new ScrEnd();
		ScreenEnd.name = "end";
		currentScreen = ScreenEnd;
	} else if(name == "cn"){
		ScreenCN = new ScrCN();
		ScreenCN.name = "cn";
		currentScreen = ScreenCN;
	}
	scrContainer.addChild(currentScreen);
}

function show_fade_gfx(callback) {
    var fade_in = new PIXI.Graphics();
    fade_in.beginFill(0xffffff).drawRect(0, 0, _W, _H).endFill();
    fade_in.alpha = 0;
    stage.addChild(fade_in);

    createjs.Tween.get(fade_in).to({alpha: 1}, 300).call(
        function () {
            callback();
            createjs.Tween.get(fade_in).to({alpha: 0}, 300).call(
                function () {
                    stage.removeChild(fade_in);
                });
        }
    );
}

function showMenu() {
	show_fade_gfx(function(){
		addScreen("menu");
	});
}

function showMainMenu() {
	show_fade_gfx(function(){
		addScreen("mainmenu");
	});
}

function showInto1() {
	show_fade_gfx(function(){
		addScreen("intro1");
	});
}

function showInto2() {
	show_fade_gfx(function(){
		addScreen("intro2");
	});
}
function showShop() {
	show_fade_gfx(function(){
		addScreen("shop");
	});
}

function showGame() {
	djangoRunStartMs = getTimer();
	djangoPartidaReported = false;
	show_fade_gfx(function(){
		addScreen("game");
	});
}

function showEnd() {
	show_fade_gfx(function(){
		addScreen("end");
	});
}

function addButton(name, _x, _y, _scGr) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	var obj = new PIXI.Container();
	_x *= scG;
	_y *= scG;
	_scGr *= scG;
	
	var objImg = null;
	obj.setImg = function(name){
		objImg = addObj(name, 4, 3, _scGr);
		obj.addChild(objImg);
		obj.over = addObj(name + "Over", 4, 3, _scGr);
		if(obj.over){
			obj.over.visible = false;
			obj.addChild(obj.over);
		} else {
			obj.over = null;
		}
		obj.lock = addObj(name + "Lock", 4, 3, _scGr);
		if(obj.lock){
			obj.lock.visible = false;
			obj.addChild(obj.lock);
		} else {
			obj.lock = null;
		}
		
		obj.vX = 1;
		obj.vY = 1;
		obj.x = _x;
		obj.y = _y;
		obj.w = objImg.w;
		obj.h = objImg.h;
		obj.r = obj.w/2;
		obj.rr = obj.r*obj.r;
		obj.name = name;
		obj._selected = false;
		if(obj.w < 50){
			obj.w = 50;
		}
		if(obj.h < 50){
			obj.h = 50;
		}
	}
	
	obj.setImg(name);
	
	return obj;
}

function addButton2(name, _x, _y, _scGr, _scaleX, _scaleY) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	var obj = new PIXI.Container();
	_x *= scG;
	_y *= scG;
	_scGr *= scG;
	
	var data = preloader.resources[name];
	var objImg = null;
	if(data){
		objImg = new PIXI.Sprite(data.texture);
		objImg.anchor.x = 0.5;
		objImg.anchor.y = 0.5;
		obj.addChild(objImg);
	} else {
		return null;
	}
	
	data = preloader.resources[name + "Over"];
	if(data){
		obj.over = new PIXI.Sprite(data.texture);
		obj.over.anchor.x = 0.5;
		obj.over.anchor.y = 0.5;
		obj.over.visible = false;
		obj.addChild(obj.over);
	} else {
		obj.over = null;
	}
	
	data = preloader.resources[name + "Lock"];
	if(data){
		obj.lock = new PIXI.Sprite(data.texture);
		obj.lock.anchor.x = 0.5;
		obj.lock.anchor.y = 0.5;
		obj.lock.visible = false;
		obj.addChild(obj.lock);
	} else {
		obj.lock = null;
	}
	obj.scale.x = _scGr*_scaleX;
	obj.scale.y = _scGr*_scaleY;
	obj.vX = _scaleX;
	obj.vY = _scaleY;
	obj.x = _x;
	obj.y = _y;
	obj.w = objImg.width*_scGr;
	obj.h = objImg.height*_scGr;
	obj.r = obj.w/2;
	obj.rr = obj.r*obj.r;
	obj.name = name;
	obj._selected = false;
	if(obj.w < 50){
		obj.w = 50;
	}
	if(obj.h < 50){
		obj.h = 50;
	}
	
	return obj;
}

function addObj(name, _x, _y, _scGr, _scaleX, _scaleY, _anchor) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	if(_anchor){}else{_anchor = 0.5};
	var obj = new PIXI.Container();
	obj.scale.x = _scGr*_scaleX;
	obj.scale.y = _scGr*_scaleY;
	
	var objImg = null;
	if(dataAnima[name]){
		objImg = new PIXI.Sprite(dataAnima[name]);
	} else if(dataMovie[name]){
		objImg = new PIXI.extras.MovieClip(dataMovie[name]);
		objImg.stop();
	}else{
		var data = preloader.resources[name];
		if(data){
			objImg = new PIXI.Sprite(data.texture);
		} else {
			return null;
		}
	}
	objImg.anchor.x = _anchor;
	objImg.anchor.y = _anchor;
	obj.w = objImg.width*obj.scale.x;
	obj.h = objImg.height*obj.scale.y;
	obj.addChild(objImg);
	obj.x = _x;
	obj.y = _y;
	obj.name = name;
	obj.img = objImg;
	obj.r = obj.w/2;
	obj.rr = obj.r*obj.r;
    //установим точку регистрации в 0 0
    obj.setReg0 = function () {
        objImg.anchor.x = 0;
        objImg.anchor.y = 0;
    }
    obj.setRegX = function (procx) {
        objImg.anchor.x = procx;
    }
    obj.setRegY = function (procy) {
        objImg.anchor.y = procy;
    }
	
	return obj;
}

function addText(text, size, color, glow, _align, width, px, font, shadow, colorShadow){
	if(size){}else{size = 24};
	if(color){}else{color = "#FFFFFF"};
	if(glow){}else{glow = undefined};
	if(_align){}else{_align = "center"};
	if(width){}else{width = _W};
	if(px){}else{px = 2};
	if(font){}else{font = fontMain};
	if(shadow){}else{shadow = false};
	if(colorShadow){}else{colorShadow = "#000000"};
	size *= scG;
	width *= scG;
	px *= scG;
	
	var style = {
		font : size + "px " + font,
		fill : color,
		align : _align,
		stroke : glow,
		strokeThickness : px,
		wordWrap : true,
		wordWrapWidth : width,
		dropShadow : shadow,
		dropShadowBlur: 0,
		dropShadowColor : colorShadow,
		dropShadowAngle : Math.PI / 4,
		dropShadowDistance : 2
	};
	
	var obj = new PIXI.Container();
	
	var tfMain = new PIXI.Text(text, style);
	tfMain.y = options_txt_offset;
	obj.addChild(tfMain);
	if(_align == "left"){
		tfMain.x = 0;
	} else if(_align == "right"){
		tfMain.x = -tfMain.width;
	} else {
		tfMain.x = - tfMain.width/2;
	}
	
	obj.width = Math.ceil(tfMain.width);
	obj.height = Math.ceil(tfMain.height);
	
	obj.setText = function(value){
		tfMain.text = String(value);
		if(_align == "left"){
			tfMain.x = 0;
		} else if(_align == "right"){
			tfMain.x = -tfMain.width;
		} else {
			tfMain.x = - tfMain.width/2;
		}
	}
	
	obj.getText = function(){
		return tfMain.text;
	}
	
	return obj;
}

function getrandom(array){
	var index = Math.floor(Math.random()*array.length)
	return array[index]
}
function get_dd(p1, p2) {
	var dx=p2.x-p1.x;
	var dy=p2.y-p1.y;
	return dx*dx+dy*dy;
}
function getDD(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	return dx*dx+dy*dy;
}
function hit_test(mc,rr,tx,ty) {
	var dx = mc.x - tx;
	var dy = mc.y - ty;
	var dd = dx*dx+dy*dy;
	if(dd<rr){
		return true
	}
	return false
}
function hit_test_rec(mc, w, h, tx, ty) {
	if(tx>mc.x-w/2 && tx<mc.x+w/2){
		if(ty>mc.y-h/2 && ty<mc.y+h/2){
			return true;
		}
	}
	return false;
}
function hitTestObject(mc1, mc2) {
	if (mc1.x < mc2.x + mc2.width &&
	   mc1.x + mc1.width > mc2.x &&
	   mc1.y < mc2.y + mc2.height &&
	   mc1.height + mc1.y > mc2.y) {
		return true;
	}
	return false;
}

function hitTestZone(mc1, mc2) {
	if (mc1.x < mc2.x + mc2.zone.width &&
	   mc1.x + mc1.zone.width > mc2.x &&
	   mc1.y < mc2.y + mc2.zone.height &&
	   mc1.zone.height + mc1.y > mc2.y) {
		return true;
	}
	return false;
}


function getXMLDocument(url){  
    var xml;  
    if(window.XMLHttpRequest){   
        xml=new XMLHttpRequest();  
        xml.open("GET", url, false);  
        xml.send(null);  
        return xml.responseXML;  
    } else {
        if(window.ActiveXObject){
            xml=new ActiveXObject("Microsoft.XMLDOM");  
            xml.async=false;  
            xml.load(url);  
            return xml;  
        } else {  
            console.log("Загрузка XML не поддерживается браузером");  
            return null;  
        } 
	}
}

// window.addEventListener('orientationchange', handleOrientation, false);

function handleOrientation() {
	// if(options_orientation != window.orientation){
		// options_orientation = window.orientation;
		// onResize();
	// }
	
	onResize();
	stage.addChild(fpsLabel);
	stage.update();
}

function visGame() {
	//play
	if(ScreenPause && currentScreen){
		if(currentScreen.name == "game"){
			ScreenPause.visible = true;
			ScreenPause.refreshButtons();
		}
	}
	if(ScreenPause){
		if(ScreenPause.visible == false){
			options_pause = false;
			refreshTime();
			update();
		}
	}
	soundManager.currentMusic = "none";
	if(currentScreen){
		if(currentScreen.name == "game"){
			musicPlay("zloop1", 1, 0, 999999);
		} else {
			musicPlay("zloop");
		}
	} else {
		musicPlay("zloop");
	}
	// musicPlay("zloop2");
}

function hideGame() {
	//pause
	options_pause = true;
	musicStop();
	refreshTime();
}

visibly.onVisible(visGame)
visibly.onHidden(hideGame)
