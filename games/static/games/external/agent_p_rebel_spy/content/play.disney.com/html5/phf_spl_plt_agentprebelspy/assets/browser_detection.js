function DisneyGamesHTML5() {
    this.info = {};

    this.minBrowser = [
        {
            "browserType": "MSIE",
            "platformType": "Win",
            "minVersion": 9
        },
        {
            "browserType": "Chrome",
            "platformType": "",
            "minVersion": 5
        },
        {
            "browserType": "Firefox",
            "platformType": "",
            "minVersion": 3.5
        },
        {
            "browserType":"Safari",
            "platformType":"Win",
            "minVersion":4
        },
        {
            "browserType":"Safari",
            "platformType":"Mac",
            "minVersion":4
        },
        {
            "browserType":"Safari",
            "platformType":"iPhone",
            "minVersion":4
        },
        {
            "browserType":"Safari",
            "platformType":"iPad",
            "minVersion":4
        },
        {
            "browserType":"Safari",
            "platformType":"iPod",
            "minVersion":4
        }
    ];
}

DisneyGamesHTML5.prototype.detectBrowser = function (navigator) {
    this.info.platformType = navigator.platform;
    this.info.browserName = navigator.appName;
    this.info.browserVersion = parseFloat(navigator.appVersion);
    this.info.iDevice = false;
    this.info.touchDevice = false;

    // detect platform
    if (navigator.platform.indexOf('iPhone') != -1)
    {
        this.info.iDevice = true;
        this.info.touchDevice = true;
        this.info.platformType = 'iPhone';
        if (/OS (\d+\_\d+)/.test(navigator.userAgent)) {
            var ver = RegExp.$1;
            ver = ver.replace('_', '.');
            this.info.platformVersion = parseFloat(ver);
        }
    }
    else if (navigator.platform.indexOf('iPod') != -1)
    {
        this.info.iDevice = true;
        this.info.touchDevice = true;
        this.info.platformType = 'iPod';
        if (/OS (\d+\_\d+)/.test(navigator.userAgent)) {
            var ver = RegExp.$1;
            ver = ver.replace('_', '.');
            this.info.platformVersion = parseFloat(ver);
        }
    }
    else if (navigator.platform.indexOf('iPad') != -1)
    {
        this.info.iDevice = true;
        this.info.touchDevice = true;
        this.info.platformType = 'iPad';
        if (/OS (\d+\_\d+)/.test(navigator.userAgent)) {
            var ver = RegExp.$1;
            ver = ver.replace('_', '.');
            this.info.platformVersion = parseFloat(ver);
        }
    }
    else if (navigator.userAgent.indexOf('Android') != -1)
    {
        this.info.touchDevice = true;
        this.info.platformType = 'Android';
        if (/Android (\d+\.\d+)/.test(navigator.userAgent)) {
            this.info.platformVersion = new Number(RegExp.$1);
        }
    }
    // Kindle Fire
    else if (navigator.userAgent.indexOf('Silk') != -1 || navigator.userAgent.indexOf('Kindle') != -1)
    {
        this.info.touchDevice = true;
        this.info.platformType = 'Android';
        this.info.platformVersion = "2.3.4";
    }
    else if (navigator.userAgent.indexOf('IEMobile') != -1)
    {
        this.info.touchDevice = true;
        this.info.platformType = 'IEMobile';
        if (/IEMobile\/(\d+\.\d+)/.test(navigator.userAgent)) {
            this.info.platformVersion = new Number(RegExp.$1);
        }
    }
    else if (navigator.platform.indexOf('Win') != -1)
    {
        this.info.platformType = 'Win';
        this.info.platformVersion = 0.0; // TODO
    }
    else if (navigator.platform.indexOf('Mac') != -1)
    {
        this.info.platformType = 'Mac';
        if (/OS X (\d+\_\d+)/.test(navigator.userAgent)) {
            var ver = RegExp.$1;
            ver = ver.replace('_', '.');
            this.info.platformVersion = parseFloat(ver);
        }
    }
    else if (navigator.platform.indexOf('Linux') != -1)
    {
        this.info.platformType = 'Linux';
        this.info.platformVersion = 0.0; // TODO
    }

    // detect browser
    if (navigator.userAgent.indexOf('Firefox') != -1)
    {
        this.info.browserName = 'Firefox';
        if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent))
            this.info.browserVersion = new Number(RegExp.$1);
    }
    else if (navigator.userAgent.indexOf('MSIE') != -1)
    {
        this.info.browserName = 'MSIE';
        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
            this.info.browserVersion = new Number(RegExp.$1);
    }
    else if (navigator.userAgent.indexOf('Trident') != -1)
    {
        this.info.browserName = 'MSIE';
        if (/Trident (\d+\.\d+);/.test(navigator.userAgent))
            this.info.browserVersion = new Number(RegExp.$1);
    }

    else if (navigator.userAgent.indexOf('Opera') != -1)
    {
        this.info.browserName = 'Opera';
        if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent))
            this.info.browserVersion = new Number(RegExp.$1);
    }
    else if (navigator.userAgent.indexOf('Chrome') != -1)
    {
        this.info.browserName = 'Chrome';
        if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent))
            this.info.browserVersion = new Number(RegExp.$1);
    }
    else if (navigator.userAgent.indexOf('Safari') != -1)
    {
        this.info.browserName = 'Safari';
        if (/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent))
            this.info.browserVersion = new Number(RegExp.$1);
    }
    else if (navigator.userAgent.indexOf('Netscape') != -1)
    {
        this.info.browserName = 'Netscape';
        if (/Netscape[\/\s](\d+\.\d+)/.test(navigator.userAgent))
            this.info.browserVersion = new Number(RegExp.$1);
    }
    else if (navigator.userAgent.indexOf('Konqueror') != -1)
    {
        this.info.browserName = 'Konqueror';
        if (/KHTML[\/\s](\d+\.\d+)/.test(navigator.userAgent))
            this.info.browserVersion = new Number(RegExp.$1);
    }
    else {
        if (this.info.iDevice)
            this.info.browserName = 'Safari';
    }

    if (navigator.userAgent.indexOf('WebKit') != -1)
        this.info.browserType = 'WebKit';
    else
        this.info.browserType = this.info.browserName;

    // set capability flags
    if (this.info.browserName == 'MSIE' && this.info.browserVersion < 9)
        this.info.legacyIEFilterDOMPipe = true; // doesn't support css trans-forms
    else
        this.info.legacyIEFilterDOMPipe = false;

    // check for 3d transformation support
    var cssMatrix = window.WebKitCSSMatrix || window.MSCSSMatrix || window.MozCSSMatrix || window.OCSSMatrix;
    if (cssMatrix != undefined && (new cssMatrix()['m11']) != undefined)
        this.info.supports3dTransform = true;
    else
        this.info.supports3dTransform = false;
};

DisneyGamesHTML5.prototype.isBrowserSupported = function () {
    var supported = false;

    for (var i = 0; i < this.minBrowser.length; i++) {
        var minBrowser = this.minBrowser[i];
        if ((!minBrowser.browserType || this.info.browserName == minBrowser.browserType) &&
            (!minBrowser.platformType || this.info.platformType == minBrowser.platformType)) {
            if (this.info.browserVersion >= minBrowser.minVersion && minBrowser.minVersion > 0) {
                supported = true;
            }
        }
    }

    return supported;
};

var disneyGamesHTML5 = new DisneyGamesHTML5();
disneyGamesHTML5.detectBrowser(window.navigator);