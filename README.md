Pots-And-Pans-Chrome-Ex
=======================
To run the extension:

1. Go to Chrome Settings -> Extensions -> Check "Developer mode"
2. Click "Load unpacked extension...". Select project folder.
3. Done.

db.js
----
Handles the database component. Uses IndexedDB.
### Methods:

Method | Description
--- | ---
`initDB(version, callback)` | Create or upgrade the database if necessary, and provides the database handler.
`insertEntry(db, name, link)` | Inserts a utensil entry.
`getLinkByName(name, callback)` | Gets corresponding link for a utensil.

#### Usage Example:
    // constants
    DB_VERSION = 1;

    var db;
    initDB(DB_VERSION, function(dbHandler) {
      db = dbHandler;
      insertEntry(db, "anotherone", "https://www.facebook.com");
      getLinkByName("https://www.facebook.com", function(result){
        console.log(result);
      });
    });
