	var gamenametitle = 'phf_spl_plt_agentprebelspy';
	document.title = "Agent P: Rebel Spy";
	
	var gn = gamenametitle.split("_");

	var ctoAssetTypeCode='gam';
	var ctoGameEvent='load';			//'load' for now
	var ctoGameBuCode = 'dc';           //Replace** twds | dc | xd | djr
	var ctoGameSeriesCode= gn[0];    	//BU code
	var ctoGameOwnerName='dol';         //dol
	var ctoGameTypeCode=gn[1];          //spl or mp
	var ctoGameGenreCode=gn[2];         //Game Genre
	var ctoGameName=gn[3];      		//Game Name
	var ctoAssetId = '4faf0fcac25e930127985123';           //Replace ** ID from CMS

	function gameStart() {
		// *@* Insert Game Start code to run the game if sitelocking does not fail
		launch();
	}	