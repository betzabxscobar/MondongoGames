	var cto=new CTO();
	if (document.referrer.indexOf('games.disney.com') != -1) {
		cto.account='disneygames2';
		cto.category='dcom';
		cto.site='dgames';
	}
	else if (document.referrer.indexOf('disney.com') != -1) {
		cto.account='disneycom';
		cto.category='dcom';
		cto.site='dgames';
	}
	else if (document.referrer.indexOf('disneyjunior.com') != -1) {
		cto.account='disneyjunior';
		cto.category='dcom';
		cto.site='djr';
	}
	else {
		cto.account='disneycom';
		cto.category='ddit';
		cto.site='dgames';
	}

	cto.pageName= gamenametitle+'-HTML5';       //Replace with appropriate value >>>> then append HTML5 to the end.
	cto.siteSection='play:nocontainer';
	cto.seriesCode= ctoGameSeriesCode;          //Replace with appropriate value
	cto.buCode= ctoGameBuCode;                  //Replace with appropriate value
	cto.templateType='play';
	cto.html5gpl= 'load'; 						//set cto.html5gpl to false if games have built-in hooks to call tracking directly.

	// TECHNO-1855 embed templateType when in iframe
	if (window.self !== window.top) {
		cto.templateType = 'embed';
	}

	//old CTO code

	var ctoGameSessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : r & 0x3 | 0x8;
			return v.toString(16);
		});
	cto.gameParams = {
		'assetTypeCode': ctoAssetTypeCode,
		'gameEvent': ctoGameEvent,
		'gameBuCode': ctoGameBuCode,
		'gameSeriesCode': ctoGameSeriesCode,
		'gameOwnerName': ctoGameOwnerName,
		'gameTypeCode': ctoGameTypeCode,
		'gameGenreCode': ctoGameGenreCode,
		'gameName': ctoGameName,
		'assetId': ctoAssetId,
		'assetName':
			ctoAssetTypeCode+'|'+
			ctoGameBuCode+'|'+
			ctoGameSeriesCode+'|'+
			ctoGameOwnerName+'|'+
			ctoGameTypeCode+'|'+
			ctoGameGenreCode+'|'+
			ctoAssetId+'|'+
			ctoGameName,
		'gameTime': new Date().getTime(),
		'gameSessionId': ctoGameSessionId
	};
