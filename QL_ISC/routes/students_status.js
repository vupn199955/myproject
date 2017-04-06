var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'iscdb'
});

connection.connect();
router.use(bodyParser.json());


//lay danh sach truong hoc
router.get('/menu_Studentstatus',function(req,res){
    connection.query('select * from student_status', function (err, rows, fields) {
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
router.delete('/menu_Studentstatus/:id', function(req,res){
	
	var id = req.params.id; 
	var sql = "delete from student_status where id_ss = '" + id + "'";
	
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




//them truong hoc
router.post('/menu_Studentstatus',function(req,res){
	var sql = 'insert into student_status(code_ss,name_ss) values ("'+req.body.code_ss+'","'+req.body.name_ss+'")';
	
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



//sua truong hoc
router.put('/menu_Studentstatus/:id', function(req, res){
	var id = req.params.id;
	var sql = "update student_status set code_ss='" + req.body.code_ss + "', name_ss='" + req.body.name_ss + "' where id_ss = '" + id + "'";
	
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