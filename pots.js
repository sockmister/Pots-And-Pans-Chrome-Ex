// constants
DB_VERSION = 47;

var db;
var upgraded = false;

var dict = new rcxDict(true);
dict.deinflect("");

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
	sentences = []

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
					// parse(rma, comments);
					sentences.push(comments.innerText);
				}
			}
		}
	}

	webTokenize(sentences);
}

function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}

// takes in an array of sentences
// outputs array of array of tokens
function webTokenize(sentences){
	url = "http://138.91.5.12/";
	// url = "http://localhost";
	inputString = "[";
	for(var i = 0; i < sentences.length; i++){
		inputString += "\"" + myTrim(sentences[i]) + "\"";
		if(i < sentences.length-1){
			inputString += ", ";
		}
	}
	inputString += "]";

	console.log(inputString);

	$.post(url, {input: inputString}).done(function(data) {
		console.log(data);
	});
}
