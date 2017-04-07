app.controller('students_ctl', ['$scope', '$http', '$window', '$compile', '$timeout', function ($scope, $http, $window, $compile, $timeout) {
	$scope.student = {
		student: '',
		intake: '',
		status_code: '',
		univer_code: '',
		birthday: '',
		major: ''
	};
	var refresh = function () {
		$http({
			method: 'GET',
			url: '/student_status'
		}).then(function successCallback(response) {
			$scope.student_status = response.data;
		}, function errorCallback(response) {
		});

		$http({
			method: 'GET',
			url: '/list_university'
		}).then(function successCallback(response) {
			$scope.list_university = response.data;
		}, function errorCallback(response) {
		});

		$http({
			method: 'GET',
			url: '/list_intake'
		}).then(function successCallback(response) {
			$scope.list_intake = response.data;
		}, function errorCallback(response) {
		});

		$http({
			method: 'GET',
			url: '/student_profiles'
		}).then(function successCallback(response) {
			$scope.student_profiles = response.data;
		}, function errorCallback(response) {
		});

		$http({
			method: 'GET',
			url: '/students_notin'
		}).then(function successCallback(response) {
			$scope.students = response.data;
		}, function errorCallback(response) {
		});

		$http({
			method: 'GET',
			url: '/students_in'
		}).then(function successCallback(response) {
			$scope.list_students = response.data;
			loadtable();
		}, function errorCallback(response) {
		});
	}

	var loadtable = function () {
		var i = 1;
		angular.forEach($scope.list_students, function (obj) {
			obj.No = i;
			i++;
		});
		var t = jQuery("#data_table").DataTable({
			"aLengthMenu": [
				[10, 25, 50, 100, -1],
				[10, 25, 50, 100, "All"]
			],
			"iDisplayLength": 10,
			"retrieve": true,
			//"processing": true,
			"deferRender": true,
			"aaData": $scope.list_students,
			"rowId": "code_stu",
			"aoColumns": [
				{ "data": "No", "sWidth": "5%" },
				{ "data": "code_stu", "sClass": "text", "sWidth": "12%" },
				{ "data": "lastname", "sClass": "text", "sWidth": "5%" },
				{ "data": "firstname", "sClass": "text", "sWidth": "10%" },
				{
					"data": null, mRender: function (data, type, row) {
						if (data.email == "undefined" || data.email == null) {
							data.email = "";
						}
						return data.email;
					}, "sClass": "text"
				},
				{
					"data": null, mRender: function (data, type, row) {
						if (data.phone == "" || data.phone == null) {
							data.phone = "";
						}
						return data.phone;
					}, "sClass": "text"
				},
				{ "data": "univer_name", "sClass": "text" },
				{ "data": "major", "sClass": "text" },
				{ "data": "name_ss", "sClass": "text" },
				{
					"data": null, mRender: function (data, type, row, index) {
						return "<button class='btn btn-warning btn-xs' data-toggle='modal' data-target='#myModalEdit' ng-click='editt(" + index.row + ")'><span class='glyphicon glyphicon-edit'></span></button>&nbsp;"
							+ "<button class='btn btn-danger btn-xs' id=" + data.code_stu + " data-toggle='modal'  ng-click='getremove(" + data.code_stu + ")'><span class='glyphicon glyphicon-remove'></span></button>";
					}, "sWidth": "7%"
				}
			],
			"order": [[0, "asc"]]
		});

		t.on('order.dt search.dt draw.dt page.dt destroy.dt', function () {
			$compile(document.getElementById('data_table'))($scope);
		}).draw();

		jQuery('#data_table tbody').on('click', 'tr', function () {
			t.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
		});
	}
	refresh();

	var mang_profile = [];
	//kiem tra checkbox roi pust vao mang_mh
	$scope.check = function ($index) {
		var name = $scope.student_profiles[$index].id_profile;

		var data = jQuery("#" + name).data("check");
		if (data == "true") {
			jQuery("#" + name).data("check", "false");
			for (var i = 0; i < mang_profile.length; i++) {
				if (mang_profile[i] == name)
					mang_profile.splice(i, 1);
			}

		}
		else {
			jQuery("#" + name).data("check", "true");
			mang_profile.push(name);
		}
	}

	// enter keudown 
	jQuery('input').keydown(function (event) {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			addkhoahoc();
		}
	});

	$scope.getremove = function (id) {
		jQuery("#myModalConfirm").modal('show');
		$scope.id = id;

	}

	//xoa
	$scope.remove = function () {
		var stt;
		$http.delete('/menu_Users/' + $scope.id).then(function successCallback(response) {
			for (var i = 0; i < $scope.thanhvien_list.length; i++) {
				if ($scope.thanhvien_list[i].user_id == $scope.id) {
					stt = $scope.thanhvien_list[i].No;
					$scope.thanhvien_list.splice(stt - 1, 1);
				}
			}

			var tr = jQuery('#' + $scope.id).closest('tr');
			var dt = jQuery('#data_table').dataTable();
			dt.fnDeleteRow(tr);
			for (var i = 0; i < $scope.thanhvien_list.length; i++) {
				if ($scope.thanhvien_list[i].No > stt) {
					$scope.thanhvien_list[i].No = $scope.thanhvien_list[i].No - 1;
					var row = jQuery("tr#" + $scope.thanhvien_list[i].user_id);
					dt.fnUpdate($scope.thanhvien_list[i], row); // Row
					//dt.fnDraw();
				}
			}
			dt.fnDraw();
			$compile(document.getElementById('data_table'))($scope);
			$scope.message = 'Removed successfully';
			jQuery("#myModalmessage").modal('show');
			$timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
		}, function errorCallback(response) {

		});
	}




	//them
	$scope.addstudents = function () {
		if ($scope.add.$invalid || $scope.add.$pattern) {
			if ($scope.student.student == '') {
				$scope.student1 = true;
				$timeout(function () {
					$scope.student1 = false;
				}, 2000)
			}
			if ($scope.student.intake == '') {
				$scope.student2 = true;
				$timeout(function () {
					$scope.student2 = false;
				}, 2000)
			}
			if ($scope.student.status_code == '') {
				$scope.student3 = true;
				$timeout(function () {
					$scope.student3 = false;
				}, 2000)
			}
			return;
		}
		var gender;
		for (var i = 0; i < $scope.students.length; i++) {
			if ($scope.student.student == $scope.students[i].user_code) {
				gender = $scope.students[i].gender;
			}
		}
		var data = {
			student: $scope.student,
			profiles: mang_profile,
			gender: gender
		};
		$http.post('/student', data).then(function successCallback(response) {

		}, function errorCallback(response) {

		});
		refresh();
	}

	//load form edit
	$scope.editt = function (index) {
		var code_edit = $scope.list_students[index].code_stu;

		$http({
			method: 'GET',
			url: '/getstudent/' + code_edit
		}).then(function successCallback(response) {

			var student_rl = response.data.student;
			$scope.profile_student = response.data.profile;

			$scope.student_edit = {
				user_code: student_rl[0].user_code,
				birthday: '',
				code_stu: student_rl[0].code_stu,
				email: student_rl[0].email,
				firstname: student_rl[0].firstname,
				gender: '',
				id_ss: student_rl[0].id_ss,
				image: student_rl[0].image,
				int_code: student_rl[0].int_code,
				lastname: student_rl[0].lastname,
				major: student_rl[0].major,
				phone: student_rl[0].phone,
				univer_code: student_rl[0].univer_code,
				useraddress: student_rl[0].useraddress,
				username: student_rl[0].username
			};

			$scope.student_edit.gender = student_rl[0].gender == 1 ? 'Nam' : 'Nữ';

			var birthday = new Date(student_rl[0].birthday);
			var date = birthday.getDate();
			var month = birthday.getMonth() + 1;
			var str = (month >= 10 ? month : "0" + month) + "/" + (date >= 10 ? date : "0" + date) + "/" + birthday.getFullYear();
			$scope.student_edit.birthday = str;

			for (var x = 0; x < $scope.student_profiles.length; x++) {
				var name = $scope.student_profiles[x].id_profile;
				jQuery("#" + name + "1").data("check", "false");
				jQuery("#" + name + "1").prop('checked', false);
			}
			for (var i = 0; i < $scope.profile_student.length; i++) {
				name = $scope.profile_student[i].id_profile;
				jQuery("#" + name + "1").data("check", "true");
				jQuery("#" + name + "1").prop('checked', true);
			}

			$('#select_ss').val(student_rl[0].id_ss);

		}, function errorCallback(response) {
		});

		jQuery("#myModalEdit").on('hidden.bs.modal', function () {
			$timeout(function () {
				window.location.reload();
			}, 500)
		});

	}

	//sua
	$scope.updatestudents = function () {
		var update_stu = {
			user_code: $scope.student_edit.user_code,
			birthday: $scope.student_edit.birthday,
			major: $scope.student_edit.major,
			image: $scope.student_edit.image,
			univer_code: $scope.student_edit.univer_code,
			id_ss: $scope.student_edit.id_ss,
			int_code: $scope.student_edit.int_code,
		};
		var array_profile = [];
		for (var i = 0; i < $scope.student_profiles.length; i++) {
			var name = $scope.student_profiles[i].id_profile;
			if (jQuery("#" + name + "1").is(':checked') == true)
				array_profile.push(name);
		}
		var data_update = {
			student: update_stu,
			profile: array_profile
		};

		$http.put('/student/' + $scope.student_edit.code_stu, data_update).then(function successCallback(response) {
		}, function errorCallback(response) {
		});
		jQuery("#myModalmessage").on('hidden.bs.modal', function () {
			window.location.reload();
		});
		jQuery("#myModalEdit").modal('hide');
		$scope.message = 'Update Successful';
		jQuery("#myModalmessage").modal('show');
		$timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
	}
}]);

