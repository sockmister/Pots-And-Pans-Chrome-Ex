var db = initDB(1);
setTimeout(function () {
	console.log(db);
	insertEntry(db, "sdf", "https://www.google.com");		
	console.log(getLinkByName("sdf"));
	console.log(getLinkByName("test"));
}, 1000);

howToStepImg = document.getElementsByClassName("howtoStep")[0];
rows = howToStepImg.children[0];
numberOfRows = rows.childElementCount;

for (i=0; i < numberOfRows; i++){

  numberOfSteps = rows.children[i].childElementCount;
  currRow = rows.children[i];

  for (j=0; j < numberOfSteps; j++){
    currStep = currRow.children[j];

    // look for the first <p> tag
    for(k=0; k < currStep.childElementCount; k++){
      if(currStep.children[k].tagName == "P"){
        comments = currStep.children[k];
		console.log(comments);
      }
    }

  }
}
