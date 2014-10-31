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
			link = word.bold().fontcolor("#BF0000").link(link);
			outerDiv = document.createElement('div');
			innerDiv = document.createElement('span');
			outerDiv.appendChild(innerDiv);

			innerDiv.innerHTML = link + getPopupHTML();
			innerDiv.setAttribute("class", "popup");
			innerDiv.setAttribute("id", "popup" + word);

			data.innerHTML = data.innerText.replace(word, outerDiv.innerHTML);
			setPopupFunction();
	}

}while(result.length!=0)
}

function getPopupHTML(){
	return "<div class=\"popup_div\"><p class=\"itemHeader\">【SALE!定価\1800→69%OFF】ロールケーキ　正角　天板　30cm</p>\
	<div class=\"picture_content\">\
		<!-- <i class=\"chevron fa fa-chevron-left fa-2x\"></i> -->\
		<img class=\"product_image\" src=\"http://thumbnail.image.rakuten.co.jp/@0_mall/majimaya/cabinet/ikou_20090622/img10011537175.jpg?_ex=380x380&s=2&r=1\"></img>\
		<!-- <i class=\"chevron fa fa-2x fa-chevron-right\"></i> -->\
	</div>\
	<p>もっとみたい！</p>\
</div>";
}

function getPopupHTMLTemplate(name, link, imageURL, price){
	return "<div class=\"popup_div\"><p class=\"itemHeader\">【SALE!定価\1800→69%OFF】ロールケーキ　正角　天板　30cm</p>\
	<div class=\"picture_content\">\
		<!-- <i class=\"chevron fa fa-chevron-left fa-2x\"></i> -->\
		<img class=\"product_image\" src=\"http://thumbnail.image.rakuten.co.jp/@0_mall/majimaya/cabinet/ikou_20090622/img10011537175.jpg?_ex=380x380&s=2&r=1\"></img>\
		<!-- <i class=\"chevron fa fa-2x fa-chevron-right\"></i> -->\
	</div>\
	<p>もっとみたい！</p>\
	</div>";
}
