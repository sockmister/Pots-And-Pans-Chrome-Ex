// constants
DB_VERSION = 9;

var db;
initDB(DB_VERSION, function(dbHandler) {
	db = dbHandler;
	seedData(db);
});

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
				parse(comments);
			}
		}
	}
}
