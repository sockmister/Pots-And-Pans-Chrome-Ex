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


// console.log(cleaned.length);
// console.log(cleaned.join(" | "));
//Highlight and hyperlink the result



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
	var db;
	initDB(DB_VERSION, function(dbHandler) {
		db = dbHandler;
		// getLinkByName(keywords)
		var result = [];
		for (var i in keywords) {
			getLinkByName(keywords[i], function(searchTerm, searchResult){

				if(typeof searchResult != "undefined"){
					result.push(searchTerm);
					result.push(searchResult);
					callback(result);
				}
			});

		}

	});
}

//Method to hyperlink the found kitchen Utensils
function highlight(data, result){

do{
	if(typeof result == "undefined"){
		return;
	}
	link = result.pop();
	word = result.pop();

	if(data.innerText.match(word) == word){
			link = word.bold().fontcolor("blue").link(link);
			div = document.createElement('div');
			div.innerHTML = link + getPopupHTML();
			div.firstChild.setAttribute("class", "popup");
			div.firstChild.setAttribute("id", "popup" + word);

			data.innerHTML = data.innerText.replace(word, div.innerHTML);
	}

}while(result.length!=0)
}

function getPopupHTML(){
	return "<div>insert HTML here</div>";
}
