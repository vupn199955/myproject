var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'iscdb'
});

connection.connect();
router.use(bodyParser.json());


//lay danh sach khoa hoc
router.get('/menu_Classrom',function(req,res){
    connection.query('select * from classroom  ', function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows)
		}
	});
});




//xoa truong hoc
router.delete('/menu_Classrom/:id', function(req,res){
	
	var id = req.params.id; 
	var sql = "delete from classroom where id_room = '" + id + "'";
	
	connection.query(sql, function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows);
		}
	});
	
});




//them khoa  hoc
router.post('/menu_Classrom',function(req,res){
	var sql = 'insert into classroom(code_room,type_room,number_seats,description,status_room) values ("'+req.body.code_room+'","'+req.body.type_room+'","'+req.body.number_seats+'","'+req.body.description+'",1)';
	
	connection.query(sql, function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows);
		}
	});
    
});



//sua khoa hoc
router.put('/menu_Classrom/:id', function(req, res){
	var id = req.params.id;
	var sql = "update classroom set code_room='" + req.body.code_room + "', type_room='" + req.body.type_room + "', number_seats='" + req.body.number_seats + "', description='" + req.body.description + "', status_room='" + req.body.status_room + "' where id_room = '" + id + "'";
	
	connection.query(sql, function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows);
		}
	});
	
});

module.exports = router;