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


//lay danh sach vnito
router.get('/menu_Studentprofile',function(req,res){
    connection.query('select * from student_profile', function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			
			res.json(rows);
		}
	});
});

////xoa truong hoc
router.delete('/menu_Studentprofile/:id', function(req,res){
	var id = req.params.id; 
	var sql = "delete from student_profile where id_profile = '" + id + "'";
	
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




//them vnito
router.post('/menu_Studentprofile',function(req,res){
	var sql = 'insert into student_profile(code_profile,name_profile,status_profile) values ("'+req.body.code_profile+'","'+req.body.name_profile+'",1)';
	
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


router.put('/menu_Studentprofile/:id', function(req, res){

	 var id = req.params.id;
	var sql = "update student_profile set name_profile='" + req.body.name_profile + "',code_profile='" + req.body.code_profile + "', status_profile='" + req.body.status_profile + "' where id_profile = '"  + id + "'";

	
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