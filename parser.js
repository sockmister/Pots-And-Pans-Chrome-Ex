//Method parse() will Tokenize, Clean and Link
function parse(data, tokens) {
	// also use tiny segmenter
	var segmenter = new TinySegmenter();
	var segs = segmenter.segment(data.innerText);
	segs = cleaner(segs);
	modSegs = []
	for(var i = 0; i < segs.length; i++){
		modSegs.push({original: segs[i], plain: segs[i]});
	}

	var highlighted = {};
	var highlightedIndexes = [];

	//Tokenize the data
	tokens = filter(tokens.tokens);
	tokens = unionByOriginal(tokens, modSegs);

	//Query Database for matches
	var result;

	// check noun utensil
	searchUtensil(tokens, function(searchResults) {
		result = searchResults;
		highlight(data, result, highlighted, highlightedIndexes);
	});

	for(var i = 0; i < tokens.length; i++){
		getWordDetails(i, tokens[i], function(index, original, search, searchResult) {
			if(typeof searchResult != "undefined") {
				if(lookAround(index, tokens, searchResult.lookAroundTerms)) {
					// search by ids
					// highlight with lookAroundSet
					if(searchResult.toHighlight){
						getAllIDs(original, searchResult.ids, function(results){
							for(var j = 0; j < results.length; j++){
								highlight(data, results, highlighted, highlightedIndexes);
							}
						});
					}
				}
				else {
					// search by ids
					// highlight with normalSet
					//getDetailsByID()
					getAllIDs(original, searchResult.ids, function(results){
						for(var j = 0; j < results.length; j++){
							highlight(data, results, highlighted, highlightedIndexes);
						}
					});
				}
			}
		});
	}

	// check verbs
	// for(var i = 0; i < tokens.length; i++){
	// 	if(isVerb(tokens[i])){
	// 		searchVerb(tokens[i].original, tokens[i].plain, function(original, verb, searchResults){
	// 			if(typeof searchResults != "undefined") {
	// 				// retrieve the possible utensils
	// 				// TODO how to decide what items to use?
	// 				getAllIDs(original, searchResults, function(results){
	// 					for(var i = 0; i < results.length; i++){
	// 						highlight(data, results, highlighted, highlightedIndexes);
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}
	// }
}

function lookAround(index, tokens, lookAroundTerms) {
	var lookAroundDist = 1;
	var length = tokens.length;
	// var foundLookAround = false;
	// convert to a more general algorithm in future

	if(index+lookAroundDist < length){
		if(existIn(tokens[index+lookAroundDist].plain, lookAroundTerms)){
			return true;
		}
	}

	if(index-lookAroundDist >= 0) {
		if(existIn(tokens[index-lookAroundDist].plain, lookAroundTerms)){
			return true;
		}
	}

	return false;
}

function existIn(value, arr) {
	for(var i = 0; i < arr.length; i++){
		if(arr[i] == value){
			return true;
		}
	}

	return false;
}

function unionByOriginal(arr1, arr2){
	result = arr1;

	for(var i = 0; i < arr2.length; i++){
		if(!wordOriginalExists(arr2[i].original, arr1)){
			arr1.push(arr2[i]);
		}
	}

	return result;
}

function wordOriginalExists(word, arr){
	for(var i = 0; i < arr.length; i++){
		if(arr[i].original == word){
			return true;
		}
	}

	return false;
}

function isNoun(token){
	var tag = token.tag;
	return tag == "noun";
}

function isVerb(token){
	var tag = token.tag;
	return tag == "verb";
}

function filter(tokens){
	result = [];
	for(var i = 0; i < tokens.length; i++){
		if(isNoun(tokens[i]) || isVerb(tokens[i])){
			result.push(tokens[i]);
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
		for (var i in keywords) {
			getDetailsByName(keywords[i], function(searchTerm, searchResult){
				if(typeof searchResult != "undefined"){
					callback([searchTerm, searchResult]);
				}
			});
		}
}

function searchUtensil(keywords, callback) {
		var results = [];

		function recur(keywords, callback) {
			if(keywords.length == 0){
				callback(results);
			} else {
				getDetailsByName2(keywords[keywords.length-1].original, function(searchTerm, searchResult){
					word = keywords.pop();
					if(typeof searchResult != "undefined"){
						results.push(word.original);
						results.push(searchResult);
					}
					recur(keywords, callback);
				});
			}
		}

		recur(keywords, callback);
}

function getAllIDs(verb, ids, callback){
	var results = [];

	function recur(ids, callback){
		if(ids.length == 0){
			callback(results);
		} else{
			getDetailsByID(ids[ids.length-1], function(id, result){
				word = ids.pop();
				if(typeof result != "undefined"){
					results.push(verb);
					results.push(result);
				}
				recur(ids, callback);
			});
		}
	}
	recur(ids, callback);
}

//Method to hyperlink the found kitchen Utensils
function highlight(data, result, highlighted, highlightIndexes){
	// var highlighted = {};
	// var highlightIndexes = []

	// console.log(result);
	while(result.length!=0){
		if(typeof result == "undefined"){
			return;
		}
		var details = result.pop();
		var link = details.Link;
		var word = result.pop();

		var start = data.innerText.indexOf(word);
		var end = start + word.length-1;

		if(!highlighted[word] && data.innerText.match(word) == word && !indexIntersects(highlightIndexes, start, end)){
				link = word.bold().fontcolor("#BF0000").link(link);
				outerDiv = document.createElement('div');
				innerDiv = document.createElement('span');
				outerDiv.appendChild(innerDiv);


				var rnd = Math.floor((Math.random() * details.links.length));
				innerDiv.innerHTML = link + getPopupHTMLTemplate(word, details.links[rnd]);
				innerDiv.setAttribute("class", "popup");
				innerDiv.setAttribute("id", "popup" + word);

				data.innerHTML = data.innerHTML.replace(word, outerDiv.innerHTML);
		}
		highlighted[word] = true;
		highlightIndexes.push({start: start, end: end});
	}

	setPopupFuncElem(data);
}

function indexIntersects(highlightIndex, start, end){
	for(var i = 0; i < highlightIndex.length; i++){
		if(highlightIndex[i].start <= end && start <= highlightIndex[i].end){
			return true;
		}
	}

	return false;
}

// ProductName, Link, ImageURL, Price
function getPopupHTMLTemplate(name, details){
	girlSusumeLink = chrome.extension.getURL("girl_susume.jpg");
	return "<div class=\"popup_div\"><p class=\"itemHeader\">" + details.item_name + "</p>\
	<div class=\"picture_content\">\
		<!-- <i class=\"chevron fa fa-chevron-left fa-2x\"></i> -->\
		<a href=\"" + details.url + "\" target=\"_blank\"><img class=\"product_image\" src=\"" + details.med_image_urls[0].imageUrl + "\"></img></a>\
		<!-- <i class=\"chevron fa fa-2x fa-chevron-right\"></i> -->\
		<p class=\"productPrice\">価格"+details.price+"</p>\
		<img class=\"girlSusume\" src=\"" +girlSusumeLink+ "\"></img>\
	</div>\
	</div>";
}
