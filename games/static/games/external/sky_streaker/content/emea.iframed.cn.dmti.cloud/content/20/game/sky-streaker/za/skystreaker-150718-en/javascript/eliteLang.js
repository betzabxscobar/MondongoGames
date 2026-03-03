function eliteLang(value) {
	PIXI.Container.call( this );
	this.init();
}

eliteLang.prototype = Object.create(PIXI.Container.prototype);
eliteLang.prototype.constructor = eliteLang;
	
var eliteLang = function() {
	this.init();
}

eliteLang.prototype.init = function() {
	this.eliteLangObj = null;
	this.current_id = null;
	
	this.langs_list = [];
	this.langs_obj = [];
	
	this.eliteLang_names = {};
	this.eliteLang_names.en="English";
	this.eliteLang_names.fr="France";
	this.eliteLang_names.es="Espanol";
	this.eliteLang_names.ru="Russian";
	this.eliteLang_names.jp="Japanese";
	this.eliteLang_names.it="Italian";
	this.eliteLang_names.pl="Polish";
	this.eliteLang_names.ar="Arabic";
	this.eliteLang_names.tr="Turkish";
	
	this.en_xml = getXMLDocument("data/lang_en.xml");
	this.fr_xml = getXMLDocument("data/lang_fr.xml");
	this.es_xml = getXMLDocument("data/lang_es.xml");
	this.de_xml = getXMLDocument("data/lang_de.xml");
	this.it_xml = getXMLDocument("data/lang_it.xml");
	this.pl_xml = getXMLDocument("data/lang_pl.xml");
	this.ru_xml = getXMLDocument("data/lang_ru.xml");
	this.tr_xml = getXMLDocument("data/lang_tr.xml");
	this.eliteLangObjEn = this.en_xml.childNodes[0];
}

eliteLang.prototype.saveSettings = function(){
	var settings = {};
	settings.current_id = this.current_id;
}

eliteLang.prototype.loadSettings = function(){
	this.setLanguage('en');
	return;
}

eliteLang.prototype.add_lang_xml = function(id, fontName){
	var lang_obj = {};
	lang_obj.id = id;
	lang_obj.font=fontName;
	this.langs_list.push(lang_obj);
	this.langs_obj[id] = lang_obj;
}

eliteLang.prototype.getList = function (){
	return this.langs_list;
}

eliteLang.prototype.setLanguage = function (id){
	var obj=this.langs_obj[id];
	if(obj.font){
		if(setMainFont){
			setMainFont(obj.font);
		}
	}
	var xml = getXMLDocument("data/lang_"+id+".xml");
	this.eliteLangObj = xml.childNodes[0];
	this.current_id = id;
	
	this.saveSettings();
}

eliteLang.prototype.get_txt = function (txt){
	if(this.eliteLangObj.getAttribute(txt) == null){
		if(this.eliteLangObjEn.getAttribute(txt) == null){
			return txt;
		} else {
			return this.eliteLangObjEn.getAttribute(txt);
		}
	} else {
		return this.eliteLangObj.getAttribute(txt);
	}
}

eliteLang.prototype.get_bol = function (txt){
	return (this.eliteLangObj.getAttribute(txt) != null)
}