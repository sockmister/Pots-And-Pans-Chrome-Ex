//Method parse() will Tokenize, Clean and Link
function parse(rma, data) {
	//Tokenize the data
	// TODO split by commas

	tokens = rma.tokenize(data.innerText);
	tokens = filter(tokens);

	//Query Database for matches
	var result;
	// TODO parse: check noun utensil, check related verbs, check related nouns
	searchDBRecursive(tokens, function(searchResults) {
		result = searchResults;
		highlight(data, result);
	});
}

function isNoun(token){
	var char = token[1][0];
	return char == "N";
}

function isVerb(token){
	var char = token[1][0];
	return char == "V";
}

function filter(tokens){
	result = [];
	for(var i = 0; i < tokens.length; i++){
		if(isNoun(tokens[i]) || isVerb(tokens[i])){
			result.push(tokens[i][0]);
		}
	}

	return result;
}

// Method to clean the data of unnecessary
// words and particles ")","(","、" etc...
// returns the cleaned version of data
function cleaner(data){
	var delim = ["（", "）", "。","を","、","!","★","です","に","が","の","か"];
	var cleaned = [];
	do{
		word = (data.pop()).replace(/\s+/g, '');
		found = false
		for(var j = 0; j<delim.length; j++){
			if(word == delim[j]){
				found = true;
				break;
			}
		}
		if(found == false){
			cleaned.push(word);
		}
	}while(data.length!=0)
	clean = cleaned.reverse();

	return clean;
}

// example return:
// [{"天板", "http://item.rakuten.co.jp/asai-tool/yk-0652/"}, {"粉ふるい器", "http://item.rakuten.co.jp/interior-palette/4904940008934/"}]
function searchDB(keywords, callback){
	// var db;
	// initDB(DB_VERSION, function(dbHandler) {
	// 	db = dbHandler;
	// 	// getLinkByName(keywords)
		// var result = [];
		for (var i in keywords) {
			getDetailsByName(keywords[i], function(searchTerm, searchResult){
				if(typeof searchResult != "undefined"){
					callback([searchTerm, searchResult]);
				}
			});
		}


	// });
}

function searchDBRecursive(keywords, callback) {
		var results = [];

		function recur(keywords, callback) {
			if(keywords.length == 0){
				callback(results);
			} else {
				getDetailsByName(keywords[keywords.length-1], function(searchTerm, searchResult){
					keywords.pop();
					if(typeof searchResult != "undefined"){
						results.push(searchTerm);
						results.push(searchResult);
					}
					recur(keywords, callback);
				});
			}
		}

		recur(keywords, callback);
}

//Method to hyperlink the found kitchen Utensils
function highlight(data, result){
	while(result.length!=0){
		if(typeof result == "undefined"){
			return;
		}
		details = result.pop();
		link = details.Link;
		word = result.pop();

		console.log(result);
		console.log(word);
		console.log(details);

		// matches only the first instance, and ignores later instances
		if(data.innerText.match(word) == word){
				link = word.bold().fontcolor("#BF0000").link(link);
				outerDiv = document.createElement('div');
				innerDiv = document.createElement('span');
				outerDiv.appendChild(innerDiv);

				innerDiv.innerHTML = link + getPopupHTMLTemplate(word, details);
				innerDiv.setAttribute("class", "popup");
				innerDiv.setAttribute("id", "popup" + word);

				data.innerHTML = data.innerText.replace(word, outerDiv.innerHTML);
		}

		console.log(data.innerHTML);
	}

	setPopupFuncElem(data);
}

// ProductName, Link, ImageURL, Price
function getPopupHTMLTemplate(name, details){
	girlSusumeLink = chrome.extension.getURL("girl_susume.jpg");

	return "<div class=\"popup_div\"><p class=\"itemHeader\">" + details.ProductName + "</p>\
	<div class=\"picture_content\">\
		<!-- <i class=\"chevron fa fa-chevron-left fa-2x\"></i> -->\
		<a href=\"" + details.Link + "\" target=\"_blank\"><img class=\"product_image\" src=\"" + details.ImageURL + "\"></img></a>\
		<!-- <i class=\"chevron fa fa-2x fa-chevron-right\"></i> -->\
		<p class=\"productPrice\">価格"+details.Price+"</p>\
		<img class=\"girlSusume\" src=\"" +girlSusumeLink+ "\"></img>\
	</div>\
	</div>";
}
