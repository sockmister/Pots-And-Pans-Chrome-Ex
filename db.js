function initDB(version){
  var openRequest = indexedDB.open("dictionary", version);
  

  // new database or new version
  openRequest.onupgradeneeded = function(e) {
    console.log("openDatabase(): running onupgradeneeded");
    var thisDB = e.target.result;

    if(!thisDB.objectStoreNames.contains("utensils")) {

      objectStore = thisDB.createObjectStore("utensils", {keyPath: "Name"});

      objectStore.createIndex("Name", "Name", {unique: true});
      objectStore.createIndex("Link", "Link", {unique: false});
    }

    return db = thisDB;
  }

  openRequest.onsuccess = function(e) {
    console.log("openDatabase(): Success!");
	console.log(e.target.result);
    db = e.target.result;
	return db;
  }

  openRequest.onerror = function(e) {
    console.log("openDatabase(): Error");
    return e.target.result;
  }
}

function insertEntry(db, name, link){	
	var transaction = db.transaction(["utensils"], "readwrite");
	transaction.oncomplete = function(event) {
		console.log("insertEntry(): complete");
	};
	
	transaction.onerror = function(event) { 
		console.log(event);
		console.log("insertEntry(): error.");
	};
	
	var objectStore = transaction.objectStore("utensils"); 
	var request = objectStore.add({Name: name, Link: link});
	request.onsuccess = function(event) {
		console.log("insertEntry(): request.onsuccess");
	}

}

function getLinkByName(name) {
	var transaction = db.transaction(["utensils"]);
	var objectStore = transaction.objectStore("utensils"); 
	var request = objectStore.get(name);
	request.onerror = function(event) {
		console.log("getLinkByName(): error");
	};
	request.onsuccess = function(event) {
		return request.result.Link;
	}
}