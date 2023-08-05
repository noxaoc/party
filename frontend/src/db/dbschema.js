const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const createParty =
`create table party(
pkParty int primary key,
name text)`

export function doTestSQL(){
db.serialize(() => {
    db.run(createParty);

    const stmt = db.prepare("INSERT INTO party VALUES (1, little cup )");
    stmt.run()
    stmt.finalize();

    db.each("SELECT rowid AS id, names FROM party", (err, row) => {
        console.log(row.id + ": " + row.name);
    }); 
});

db.close();
}
