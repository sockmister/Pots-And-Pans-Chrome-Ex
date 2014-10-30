function initDB(version, callback){
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

    seedData(e.target.result);

    callback(thisDB);
  }

  openRequest.onsuccess = function(e) {
    console.log("openDatabase(): Success!");
    callback(e.target.result);
  }

  openRequest.onerror = function(e) {
    console.log("openDatabase(): Error");
    callback(e.target.result);
  }
}

function seedData(dbHandler) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data){
    if(xhr.readyState==4 && xhr.status==200){
      insertMultipleEntries(dbHandler, JSON.parse(xhr.response));
    }
  }; // Implemented elsewhere.
  xhr.open("GET", chrome.extension.getURL("/seed.json"), true);
  xhr.send();
}

function insertMultipleEntries(db, array){
  var transaction = db.transaction(["utensils"], "readwrite");
  transaction.oncomplete = function(event) {
    console.log("insertMultipleEntries(): complete");
  };
  transaction.onerror = function(event) {
    console.log(event);
    console.log("insertMultipleEntries(): error.");
  };

  var objectStore = transaction.objectStore("utensils");
  // var request = objectStore.add(array);
  for (var i in array){
    console.log(array[i]);
    var request = objectStore.add(array[i]);
  }

  request.onsuccess = function(event) {
    console.log("insertMultipleEntries(): request.onsuccess");
  }
}

// insertEntry(db, name, link)
// db: The DB handler returned after init.
// name: string. Name of utensil.
// link: string. Corresponding link.
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

// getLinkByName
// name: string. Name of utensil.
// callback: function(result). Callback function.
function getLinkByName(name, callback) {
	var transaction = db.transaction(["utensils"], "readonly");
	var objectStore = transaction.objectStore("utensils");
	var request = objectStore.get(name);
	request.onerror = function(event) {
	};

	request.onsuccess = function(event) {

    if(typeof request.result == "undefined"){
      callback(name, request.result);
    } else {
      callback(name, request.result.Link);
    }
	}
}
