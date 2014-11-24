function initDB(version, callback){
  var openRequest = indexedDB.open("dictionary", version);
  var upgrade = false;

  // new database or new version
  openRequest.onupgradeneeded = function(e) {
    upgrade = true;
    console.log("openDatabase(): running onupgradeneeded");
    var thisDB = e.target.result;

    if(!thisDB.objectStoreNames.contains("utensilsStore")) {
      // Utensil: Japanese to ID
      objectStore = thisDB.createObjectStore("utensilsStore", {keyPath: "serial"});
      objectStore.createIndex("Name", "Name", {unique: false});
    }
    if(!thisDB.objectStoreNames.contains("links")) {
      // Details: ID to link details
      objectStore = thisDB.createObjectStore("links", {keyPath: "ID"});
      objectStore.createIndex("ID", "ID", {unique: true});
    }
    if(!thisDB.objectStoreNames.contains("verbsDictionary")) {
      // Verbs: verb to array of ids
      objectStore = thisDB.createObjectStore("verbsDictionary", {keyPath: "verb"});
      objectStore.createIndex("verb", "verb", {unique: true});
    }

    // callback(thisDB, true);
  }

  openRequest.onsuccess = function(e) {
    console.log("openDatabase(): Success!");
    callback(e.target.result, upgrade);
  }

  openRequest.onerror = function(e) {
    console.log("openDatabase(): Error");
    callback(e.target.result, upgrade);
  }
}

function seedData(dbHandler, callback) {

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data){
    if(xhr.readyState==4 && xhr.status==200){
      insertMultipleEntries(dbHandler, JSON.parse(xhr.response), callback);
    }
  }; // Implemented elsewhere.
  xhr.open("GET", chrome.extension.getURL("/json_files/seed.json"), true);
  xhr.send();
}

function seedNewData(dbHandler, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data){
    if(xhr.readyState==4 && xhr.status==200){
      insertEntries(dbHandler, "links", JSON.parse(xhr.response), callback);
    }
  }; // Implemented elsewhere.
  xhr.open("GET", chrome.extension.getURL("/json_files/links.json"), true);
  xhr.send();

  var xhrDict = new XMLHttpRequest();
  xhrDict.onreadystatechange = function(data) {
    if(xhrDict.readyState==4 && xhrDict.status==200){
      insertEntries(dbHandler, "utensilsStore", JSON.parse(xhrDict.response), callback);
    }
  };
  xhrDict.open("GET", chrome.extension.getURL("/json_files/utensils-complete.json"), true);
  xhrDict.send();

  var xhrVerbs = new XMLHttpRequest();
  xhrVerbs.onreadystatechange = function(data) {
    if(xhrVerbs.readyState==4 && xhrVerbs.status==200){
      insertEntries(dbHandler, "verbsDictionary", JSON.parse(xhrVerbs.response), callback);
    }
  };
  xhrVerbs.open("GET", chrome.extension.getURL("/json_files/verbs.json"), true);
  xhrVerbs.send();
}

function insertLinkDetails(db, array, callback) {
  var transaction = db.transaction(["utensilsDetails"], "readwrite");
  transaction.oncomplete = function(event) {
    console.log("insertLinkDetails() success.");
    callback();
  };
  transaction.onerror = function(event) {
    callback();
  };

  var objectStore = transaction.objectStore("utensilsDetails");
  for (var i in array){
    var request = objectStore.add(array[i]);
  }

  request.onsuccess = function(event) {
    // console.log("insertMultipleEntries(): request.onsuccess");
  }
}

function insertMultipleEntries(db, array, callback){
  var transaction = db.transaction(["utensils"], "readwrite");
  transaction.oncomplete = function(event) {
    callback();
  };
  transaction.onerror = function(event) {
    // console.log("insertMultipleEntries(): error.");
    // console.log(event);
    callback();
  };

  var objectStore = transaction.objectStore("utensils");
  // var request = objectStore.add(array);
  for (var i in array){
    var request = objectStore.add(array[i]);
  }

  request.onsuccess = function(event) {
    // console.log("insertMultipleEntries(): request.onsuccess");
  }
}

function insertEntries(db, storeName, array, callback){
  var transaction = db.transaction([storeName], "readwrite");
  transaction.oncomplete = function(event) {
    console.log("insertEntries() success.");
    callback();
  };
  transaction.onerror = function(event) {
    callback();
  };

  var objectStore = transaction.objectStore(storeName);
  for (var i in array){
    console.log(array[i]);
    var request = objectStore.add(array[i]);
  }

  request.onsuccess = function(event) {
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
      callback(name, request.result.Details.Link);
    }
	}
}

// getLinkByName
// name: string. Name of utensil.
// callback: function(result). Callback function.
function getDetailsByName(name, callback) {
  var transaction = db.transaction(["utensils"], "readonly");
  var objectStore = transaction.objectStore("utensils");
  var request = objectStore.get(name);
  request.onerror = function(event) {
  };

  request.onsuccess = function(event) {
    if(typeof request.result == "undefined"){
      callback(name, request.result);
    } else {
      callback(name, request.result.Details);
    }
  }
}

function getDetailsByName2(name, callback){

  //
  // // TODO debug
  // var request = objectStore.get("あみじゃくし106172");
  // request.onerror = function(event) {
  // };
  //
  // request.onsuccess = function(event) {
  //   console.log(request.result);
  //   if(typeof request.result == "undefined"){
  //     callback(name, request.result);
  //   } else {
  //     // find details
  //     getDetailsByID(request.result.id, callback);
  //   }
  // }
  var transaction = db.transaction(["utensilsStore"], "readonly");
  var objectStore = transaction.objectStore("utensilsStore");

  var index = objectStore.index("Name");
  index.get(name).onsuccess = function(event) {
    if(typeof(event.target.result) == "undefined"){
      callback(event.target.result);
    }
    else {
      getDetailsByID(event.target.result.id, callback);
    }
  };
  index.openCursor().onsuccess = function(event) {
    // var cursor = event.target.result;
    // if (cursor) {
    //   console.log("name: " + cursor.key + ", : " + cursor.value.id + ", name: " + cursor.value.Name);
    //   // cursor.continue();
    // }
  };
}

function searchVerb(verb, callback){
  var transaction = db.transaction(["verbsDictionary"], "readonly");
  var objectStore = transaction.objectStore("verbsDictionary");
  var request = objectStore.get(verb);
  request.onerror = function(event) {
  };

  request.onsuccess = function(event) {
    if(typeof request.result == "undefined"){
      callback(verb, request.result);
    } else {
      callback(verb, request.result.ids);
    }
  }
}

function wordExist(word, callback){

}

function getDetailsByID(id, callback) {
  var transaction = db.transaction(["links"], "readonly");
  var objectStore = transaction.objectStore("links");
  var request = objectStore.get(id.toString());
  request.onerror = function(event) {
  };

  request.onsuccess = function(event) {
    if(typeof request.result == "undefined"){
      callback(id, request.result);
    } else {
      callback(id, request.result.Details);
    }
  }
}
