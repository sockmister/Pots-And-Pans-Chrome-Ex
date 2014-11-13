// constants
DB_VERSION = 44;

var db;
var upgraded = false;

$.getJSON(chrome.extension.getURL('/rakutenma-master/model_ja.min.json'), function(model) {
	var rma = new RakutenMA(model);
	rma.featset = RakutenMA.default_featset_ja;
	rma.hash_func = RakutenMA.create_hash_func(15);

	initDB(DB_VERSION, function(dbHandler, upgraded) {
		db = dbHandler
		if(upgraded){
			seedData(db, function(){
				seedNewData(db, function(){
					startParsing(rma);
				});
			});
		} else{
			startParsing(rma);
		}
	});
});

function startParsing(rma){
	howToStepImg = document.getElementsByClassName("howtoStep")[0];
	rows = howToStepImg.children[0];
	numberOfRows = rows.childElementCount;

	for (var i=0; i < numberOfRows; i++){
		numberOfSteps = rows.children[i].childElementCount;

		currRow = rows.children[i];
		currRow.style.cssText = "overflow: visible !important";
		for (var j=0; j < numberOfSteps; j++){
			currStep = currRow.children[j];

			// look for the first <p> tag
			for(var k=0; k < currStep.childElementCount; k++){
				if(currStep.children[k].tagName == "P"){
					comments = currStep.children[k];
					parse(rma, comments);
				}
			}
		}
	}
}
