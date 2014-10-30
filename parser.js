
//Method parse() will Tokenize the data using the TinySegmenter function
//
function parse(data) {

//Tokenize the data
var segmenter = new TinySegmenter();                 // インスタンス生成
var segs = segmenter.segment(data.innerText);  // 単語の配列が返る
var found = false;
var cleaned = [];

cleaned = cleaner(segs);
console.log(cleaned);
result = searchDB(cleaned);
console.log(result);
// return highlight(data, result);

getLinkByName("test", function(result) {
	console.log(result);
});

// alert(cleaned.length);
// alert(cleaned.join(" | "));  // 表示

// console.log(cleaned.length);
// console.log(cleaned.join(" | "));


}
// Method to clean the data of unnecessary
// words and particles ")","(","、" etc...
// returns the cleaned version of data
function cleaner(data){

var delim = ["（", "）", "。","を","、","!","★","です","に","が","の"];
var cleaned = [];
do{
	if(data.length == 0){
		return "";
	}
	word = (data.pop()).replace(/\s+/g, '');
	found = false
	for(j = 0; j<delim.length; j++){
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
			console.log(keywords[i]);
			getLinkByName(keywords[i], function(result){
				if(typeof result != "undefined"){
					result.push({word: keywords[i], link: result})
				}
			});
		}
		callback(result);
	});
}

//Method to hyperlink the found kitchen Utensils
function highlight(data, result){
	if (typeof data.innerText == "undefined"){
		return "";
	}
	if( data.innerText.match(result[0]) == result[0]){

			index = data.innerText.indexOf(result[0]);
			link = result[0].bold().fontcolor("blue").link(result[1]);
			result = data.innerText.replace(result[0], link);
			return result;
	}

}
