//Method parse() will Tokenize, Clean and Link
function parse(data) {
	//Tokenize the data
	var segmenter = new TinySegmenter();                 // インスタンス生成
	var segs = segmenter.segment(data.innerText);  // 単語の配列が返る
	var cleaned = [];
	//Clean the data
	cleaned = cleaner(segs);
	//Query Database for matches
	var result;
	searchDB(cleaned, function(searchResults) {
		result = searchResults;
		highlight(data, result);
	});
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

//Method to hyperlink the found kitchen Utensils
function highlight(data, result){
	do{
		if(typeof result == "undefined"){
			return;
		}
		details = result.pop();
		link = details.Link;
		word = result.pop();

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
				setPopupFunction();
		}

	}while(result.length!=0)
}

// ProductName, Link, ImageURL, Price
function getPopupHTMLTemplate(name, details){
	return "<div class=\"popup_div\"><p class=\"itemHeader\">" + details.ProductName + "</p>\
	<div class=\"picture_content\">\
		<!-- <i class=\"chevron fa fa-chevron-left fa-2x\"></i> -->\
		<a href=\"" + details.Link + "\" target=\"_blank\"><img class=\"product_image\" src=\"" + details.ImageURL + "\"></img></a>\
		<!-- <i class=\"chevron fa fa-2x fa-chevron-right\"></i> -->\
		<p class=\"productPrice\">価格"+details.Price+"</p>\
	</div>\
	</div>";
}
