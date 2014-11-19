// constants
DB_VERSION = 47;

var db;
var upgraded = false;

var dict = new rcxDict(true);
dict.deinflect("");

initDB(DB_VERSION, function(dbHandler, upgraded) {
	db = dbHandler
	if(upgraded){
		seedData(db, function(){
			seedNewData(db, function(){
				startParsing();
			});
		});
	} else{
		startParsing();
	}
});

function startParsing(){
	sentences = []
	htmlSentences = []

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
					htmlSentences.push(comments);
					sentences.push(comments.innerText);
				}
			}
		}
	}
	webTokenize(sentences, function(result){
		for(var i = 0; i < result.length; i++){
			parse(htmlSentences[i], result[i]);
		}
	});
}

function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}

// takes in an array of sentences
// outputs array of array of tokens
function webTokenize(sentences, callback){
	url = "http://138.91.5.12/";

	inputString = "[";
	for(var i = 0; i < sentences.length; i++){
		inputString += "\"" + myTrim(sentences[i]) + "\"";
		if(i < sentences.length-1){
			inputString += ", ";
		}
	}
	inputString += "]";

	$.post(url, {input: inputString}).done(function(data) {
		callback(data);
	});
}
