
//Method parse() will Tokenize the data using the TinySegmenter function
//
function parse(data) {

//Tokenize the data
var segmenter = new TinySegmenter();                 // インスタンス生成
var segs = segmenter.segment(data.innerText);  // 単語の配列が返る
var found = false;
var cleaned = [];

cleaned = cleaner(segs);
<<<<<<< HEAD
//alert(cleaned.join(" | "));  // 表示
result = searchDB(cleaned);
return highlight(data, result);
=======

// alert(cleaned.length);
// alert(cleaned.join(" | "));  // 表示

console.log(cleaned.length);
console.log(cleaned.join(" | "));
>>>>>>> origin/master


}
// Method to clean the data of unnecessary
// words and particles ")","(","、" etc...
// returns the cleaned version of data
function cleaner(data){

var delim = ["（", "）", "。","を","、","!","★","です","に","が","の"];
var cleaned = [];
do{
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

function searchDB(keywords){

	return ["マッシャー","http://item.rakuten.co.jp/hotch-potch/00004128_omegavispen/"];

}
//Method to hyperlink the found kitchen Utensils
function highlight(data, result){
	if( data.innerText.match(result[0]) == result[0]){
	
			index = data.innerText.indexOf(result[0]);
			link = result[0].bold().fontcolor("blue").link(result[1]);
			result = data.innerText.replace(result[0], link);
			return result;
	}

}
