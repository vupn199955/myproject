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

router.get('/menu_CThoc_COS', function (req, res) {
    connection.query('SELECT * from study_program pro where pro.pro_status = "1" and pro.pro_code in (select pro_code from discipline_of_study_program GROUP by pro_code)', function (err, rows, fields) {
        if (err) {
            connection.end();
            throw err;
        }
        else {
            res.json(rows)
        }
    });
});

router.get('/cth/:id', function (req, res) {
    connection.query('SELECT dis_code from discipline_of_study_program where pro_code="' + req.params.id + '"', function (err, rows, fields) {
        if (err) {
            connection.end();
            throw err;
        }
        else {
            res.json(rows)
        }
    });
});

router.get('/menu_CThoc_COS1', function (req, res) {
    connection.query('SELECT * from study_program pro where pro.pro_status = "1" and pro.pro_code not in (select pro_code from discipline_of_study_program GROUP by pro_code)', function (err, rows, fields) {
        if (err) {
            connection.end();
            throw err;
        }
        else {
            res.json(rows)
        }
    });
});

//lay danh sach khoa hoc
router.get('/menu_cos', function (req, res) {
    connection.query('select * from discipline_of_study_program dos, study_program pro, discipline dis where dos.pro_code = pro.pro_code and dos.dis_code = dis.dis_code', function (err, rows, fields) {
        if (err) {
            connection.end();
            throw err;
        }
        else {
            res.json(rows)
        }
    });
});

router.get('/menu_cos', function (req, res) {
    connection.query('select * from discipline_of_study_program dos, study_program pro, discipline dis where dos.pro_code = pro.pro_code and dos.dis_code = dis.dis_code', function (err, rows, fields) {
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
router.delete('/menu_cos/:id', function (req, res) {
    var id = req.params.id;
    var sql = "delete from discipline_of_study_program where pro_code in (select pro_code from study_program where pro_id = '" + id + "')";
    connection.query(sql);
});




//them khoa  hoc
router.post('/menu_cos', function (req, res) {
    for (var i = 0; i < req.body.list_mh.length; i++) {
        var sql = 'insert into discipline_of_study_program(pro_code,dis_code,status_dosp) values ("' + req.body.cth + '","' + req.body.list_mh[i] + '",1)';

        connection.query(sql);
    }

});



//sua khoa hoc
router.put('/menu_cos/:id', function (req, res) {
    var id = req.params.id;
    var sql = "delete from discipline_of_study_program where pro_code = '" + id + "'";
    connection.query(sql);
    for (var i = 0; i < req.body.list_mh.length; i++) {
        sql = "insert into discipline_of_study_program(pro_code,dis_code) values('" + id + "','" + req.body.list_mh[i] + "')";
        connection.query(sql);
    }
});

module.exports = router;