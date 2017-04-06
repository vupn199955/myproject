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
router.get('/student_status',function(req,res){
    connection.query('SELECT * from student_status', function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows)
		}
	});
});

router.get('/list_university',function(req,res){
    connection.query('SELECT * from university where status = 1', function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows)
		}
	});
});

router.get('/list_intake',function(req,res){
    connection.query('SELECT * from intake where status = 1', function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows)
		}
	});
});

router.get('/student_profiles',function(req,res){
    connection.query('SELECT * from student_profile where status_profile = 1', function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows)
		}
	});
});

router.get('/students_notin',function(req,res){
    connection.query('SELECT u.user_code,u.firstname,u.lastname,u.username from users u, decentralization d where u.status = 1 and u.user_code = d.user_code and d.access_id = 4 and u.user_code not in (select user_code from students)', function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows)
		}
	});
});

router.get('/students_in',function(req,res){
    connection.query('SELECT u.firstname,u.lastname,u.phone,u.email, stu.code_stu,stu.major,sta.name_ss,uni.univer_name from users u, students stu, student_status sta, university uni where u.user_code = stu.user_code and stu.univer_code = uni.univer_code and stu.id_ss = sta.id_ss', function (err, rows, fields) {
		if (err) {
			connection.end();
			throw err;
		}
		else {
			res.json(rows)
		}
	});
});




// //xoa truong hoc
// router.delete('/menu_CThoc/:id', function(req,res){
	
// 	var id = req.params.id; 
// 	var sql = "delete from study_program where pro_id = '" + id + "'";
	
// 	connection.query(sql, function (err, rows, fields) {
// 		if (err) {
// 			connection.end();
// 			throw err;
// 		}
// 		else {
// 			res.json(rows);
// 		}
// 	});
	
// });




//them truong hoc
router.post('/student',function(req,res){
    console.log(req.body);
	//ar sql = 'insert into students(pro_code,pro_name,pro_description,pro_status) values ("'+req.body.pro_code+'","'+req.body.pro_name+'","'+req.body.pro_description+'",1)';
	
	// connection.query(sql, function (err, rows, fields) {
	// 	if (err) {
	// 		connection.end();
	// 		throw err;
	// 	}
	// 	else {
	// 		res.json(rows);
	// 	}
	// });
    
});



// //sua truong hoc
// router.put('/menu_CThoc/:id', function(req, res){
// 	var id = req.params.id;
// 	var sql = "update study_program set pro_code='" + req.body.pro_code	 + "', pro_name='" + req.body.pro_name + "', pro_description='" + req.body.pro_description + "', pro_status='" + req.body.pro_status + "' where pro_id = '" + id + "'";
	
// 	connection.query(sql, function (err, rows, fields) {
// 		if (err) {
// 			connection.end();
// 			throw err;
// 		}
// 		else {
// 			res.json(rows);
// 		}
// 	});
	
// });

module.exports = router;