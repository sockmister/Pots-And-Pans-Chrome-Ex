
//Method parse() will Tokenize, Clean and Link 
function parse(data) {

//Tokenize the data
var segmenter = new TinySegmenter();                 // インスタンス生成
var segs = segmenter.segment(data.innerText);  // 単語の配列が返る
var cleaned = [];
//Clean the data
cleaned = cleaner(segs);
//Query Database for matches
result = searchDB(cleaned);
//Highlight and hyperlink the result
highlight(data, result);

console.log(cleaned.length);
console.log(cleaned.join(" | "));

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

do{
	link = result.pop();
	word = result.pop();

	if(data.innerText.match(word) == word){
			
			link = word.bold().fontcolor("blue").link(link);
			data.innerHTML = data.innerText.replace(word, link);
	}

}while(result.length!=0)
}
