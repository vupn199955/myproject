app.controller('students_ctl', ['$scope', '$http', '$window', '$compile', '$timeout', function ($scope, $http, $window, $compile, $timeout) {
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
				{ "data": "code_stu", "sClass": "text" },
				{ "data": "lastname", "sClass": "text" },
				{ "data": "firstname", "sClass": "text" },
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
		console.log(mang_profile);
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
		var data = {
			student: $scope.student,
			profiles: mang_profile
		};
		console.log(data);
		$http.post('/student', data).then(function successCallback(response) {

		}, function errorCallback(response) {

		});
		refresh();
	}


	//load form edit
	$scope.editt = function (index) {
		var toSelect = $scope.students_list[index];
		$scope.editstudents = toSelect;
		jQuery("#myModalEdit").on('hidden.bs.modal', function () {
			$timeout(function () {
				window.location.reload();
			}, 500)
		});

	}

	//sua
	$scope.updatestudents = function () {
		if ($scope.edit.$invalid || $scope.edit.$pattern) {
			if ($scope.edit.strongSecret.$error.required) {

				$scope.require = true;
				$timeout(function () {
					$scope.require = false;
				}, 2000);
			};
			if ($scope.edit.strongSecret1.$error.required) {

				$scope.required1 = true;
				$timeout(function () {
					$scope.required1 = false;
				}, 2000);
			}
			if ($scope.edit.strongSecret2.$error.required) {

				$scope.required2 = true;
				$timeout(function () {
					$scope.required2 = false;
				}, 2000);
			}
			if ($scope.edit.strongSecret3.$error.required) {

				$scope.required3 = true;
				$timeout(function () {
					$scope.required3 = false;
				}, 2000);
			}
			if ($scope.edit.strongSecret4.$error.required) {

				$scope.required4 = true;
				$timeout(function () {
					$scope.required4 = false;
				}, 2000);
			}
			if ($scope.edit.strongSecret5.$error.required) {

				$scope.required5 = true;
				$timeout(function () {
					$scope.required5 = false;
				}, 2000);
			}
			return;
		}


		for (var i = 0; i < $scope.thanhvien_list.length; i++) {
			if ($scope.thanhvien_list[i].user_id != $scope.editthanhvien.user_id && angular.lowercase($scope.thanhvien_list[i].user_code) == angular.lowercase($scope.editthanhvien.user_code)) {
				$scope.exiss = true;
				refresh();
				$timeout(function () {
					$scope.exiss = false;
				}, 3000);
				return;
			}
		}
		//var indata = { 'thanhvien': $scope.editthanhvien, 'roles': role_current };

		$http.put('/menu_Users/' + $scope.editthanhvien.user_id, $scope.editthanhvien).then(function successCallback(response) {
			for (var i = 0; i < $scope.thanhvien_list.length; i++) {
				if ($scope.thanhvien_list[i].user_id == $scope.editthanhvien.user_id) {
					$scope.thanhvien_list[i] = $scope.editthanhvien;
				}
			}
			var dt = jQuery('#data_table').dataTable();
			var row = jQuery("tr#" + $scope.editthanhvien.user_id);
			dt.fnUpdate($scope.editthanhvien, row); // Row
			dt.fnDraw();
			$compile(document.getElementById('data_table'))($scope);
			jQuery("#myModalmessage").on('hidden.bs.modal', function () {
				window.location.reload();
			});
			jQuery("#myModalEdit").modal('hide');
		}, function errorCallback(response) {

		});

		$http.put('/rolesUser/' + $scope.editthanhvien.user_code, role_current).then(function successCallback(response) {
			var tr = jQuery('#' + index).closest('tr');
			var dt = jQuery('#data_table').dataTable();
			dt.fnDeleteRow(tr);
			dt.fnDraw();
		}, function errorCallback(response) {

		});
		$scope.message = 'Update Successful';
		jQuery("#myModalmessage").modal('show');
		$timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
	}
}]);

