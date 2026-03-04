screenScale=1;
window.devicePixelRatio = window.devicePixelRatio || Math.round(screen.deviceXDPI*10 / screen.logicalXDPI)/10;

// --------------------------------------------------------------------

// return browser configuration datas
function getDatas () {
    return window.devicePixelRatio+"#"+screenScale+"#"+navigator.userAgent+"#"+screen.width+"#"+screen.height;
}

// check if the context support WebGL
function getWebGL() {
	try {
		return !!window['WebGLRenderingContext'] && !!document.createElement('canvas').getContext('experimental-webgl');
	} catch (e) {
		return false;
	}
}


// return fixed orientation
function getPatchOrientation () {
	if (window.innerWidth > window.innerHeight) return 90;
	else return 0;
}

// display fullscreen button
function displayFullScreenButton () {
	if (!navigator.userAgent.match(/(iPad|iPhone|iPod)/g) && !navigator.userAgent.match(/MSIE/i) && !(window.location.hash = !!window.MSInputMethodContext)) 
		document.write ('<div id="fullscreen"><image src="fullscreen.png" id="clickFS" width="'+getFullscreenIconSize()+'" height="'+getFullscreenIconSize()+'" onclick="enterFullscreen()" style="cursor:pointer;"/></div>');
}

// enter fullscreen mode
function enterFullscreen() {

	var docElm = document.documentElement;
	if (docElm.requestFullscreen) docElm.requestFullscreen();
	else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen();
	else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen();
	//else if (docElm.msRequestFullscreen) docElm.msRequestFullscreen();
}

// exit fullscreen mode
function exitFullscreen() {
	if (document.exitFullscreen) document.exitFullscreen();
	else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
	else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
	//else if (document.msExitFullscreen) document.msExitFullscreen();
}

// fullscreen event callback
function onChangeFullScreen (pEvent) {
	var lFullScreen = document.fullScreen==true || document.mozFullScreen==true || document.webkitIsFullScreen==true; /*|| document.msFullscreenElement==true*/
	
	if (lFullScreen) {
		document.getElementById('fullscreen').style.display = 'none';
		document.getElementById("content").className = "fullscreen";
	} else {
		document.getElementById('fullscreen').style.display = 'block';
		document.getElementById("content").className = "window";
	}
	pEvent.preventDefault();
}

document.onfullscreenchange = onChangeFullScreen;
document.onwebkitfullscreenchange = onChangeFullScreen;
document.onmozfullscreenchange = onChangeFullScreen;
//document.onmsfullscreenchange = onChangeFullScreen;
//document.addEventListener("MSFullscreenChange", onChangeFullScreen );

// return fullscreen ideal size
function getFullscreenIconSize () {
	var lSize=Math.floor(Math.min(screen.width,screen.height)*0.075/screenScale);
	if (
		!(	navigator.userAgent.match(/Android/i) || 
			navigator.userAgent.match(/iPhone|iPad|iPod/i) || 
			navigator.userAgent.match(/BlackBerry/i) || 
			navigator.userAgent.match(/PlayBook/i) ||
			navigator.userAgent.match(/IEMobile/i)
			)
		) lSize/=3;

	return lSize;
}

function launch(){
	var disneyGamesHTML5 = new DisneyGamesHTML5();
	disneyGamesHTML5.detectBrowser(window.navigator);
	if(disneyGamesHTML5.isBrowserSupported()){
		flambe.embed(["targets/main-html.js"], "content");
	}
	else {
		var img = document.createElement("IMG");
		img.src = "unsupported.jpg";
		document.getElementById("content").appendChild(img);
	}
}

// --------------------------------------------------------------------

// Safe Zone and viewPort
if (window.devicePixelRatio>1) {

	var lScreenWidth = Math.max(screen.width, screen.height) * window.devicePixelRatio;
	var lScreenHeight = Math.min(screen.width, screen.height) * window.devicePixelRatio;
	
	var SAFE_ZONE_WIDTH = 2048;
	var SAFE_ZONE_HEIGHT = 1365;
	
	if (!getWebGL()) {
		SAFE_ZONE_WIDTH/=2;
		SAFE_ZONE_HEIGHT/=2;
	}
	
	var lRatio = Math.max(1,Math.ceil(Math.min(lScreenWidth / SAFE_ZONE_WIDTH, lScreenHeight / SAFE_ZONE_HEIGHT)));
	
	screenScale = Math.round(100*lRatio / window.devicePixelRatio) / 100;
	
}

document.write('<meta name="viewport" content="initial-scale=' + screenScale + ', user-scalable=no, minimal-ui">');

