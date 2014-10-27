function parse(data) {

//Tokenize the data
var segmenter = new TinySegmenter();                 // インスタンス生成
var segs = segmenter.segment(data);  // 単語の配列が返る
var found = false;
var cleaned = [];

cleaned = cleaner(segs);

alert(cleaned.length);
alert(cleaned.join(" | "));  // 表示



}
// Method to clean the data of unnecessary 
// words and particles ")","(","、" etc...
function cleaner(data){

var delim = ["(", ")", "。","を","、","!","★"];
var length = data.length;
var cleaned = [];
for(i = 0; i < length; i++){
	word = data.pop().replace(/\s+/g, '');
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
}
clean = cleaned.reverse();

return clean;
}
