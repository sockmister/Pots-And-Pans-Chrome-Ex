// constants
DB_VERSION = 67;

var globalData = {};
var globalIndex = {};

var db;
var upgraded = false;

initDB(DB_VERSION, function(dbHandler, upgraded) {
	db = dbHandler;
	if(upgraded){
		seedNewData(db, function(){
			startParsing();
		});
	} else{
		startParsing();
	}
});

// add font awesome to header
$('head').append("<link href=\"//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css\" rel=\"stylesheet\">");

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
  x = x.replace(/^\s+|\s+$/gm,'');
	x = x.replace(/\n/g, " ");
	return x
}

// takes in an array of sentences
// outputs array of array of tokens
function webTokenize(sentences, callback){
	url = "http://138.91.5.12/";
	// url = "http://localhost:4567/";
	//
	// inputString = "[";
	// for(var i = 0; i < sentences.length; i++){
	// 	inputString += "\"" + myTrim(sentences[i]) + "\"";
	// 	if(i < sentences.length-1){
	// 		inputString += ", ";
	// 	}
	// }
	// inputString += "]";
	//
	// console.log(inputString);

	for(var i = 0; i < sentences.length; i++){
		sentences[i] = myTrim(sentences[i]);
	}

	inputString = JSON.stringify(sentences);

	$.post(url, {input: inputString}).done(function(data) {
		callback(data);
	});
}
