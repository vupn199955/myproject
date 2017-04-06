app.controller('vnito_ctl', ['$scope', '$http', '$window', '$compile', '$timeout', function ($scope, $http, $window, $compile, $timeout) {
	var refresh = function () {

		$http({
			method: 'GET',
			url: '/menu_VNITO'
		}).then(function successCallback(response) {
			$scope.vnito_list = response.data;
			loadtable();
		}, function errorCallback(response) {

		});
	}

	var loadtable = function () {
		var i = 1;
		angular.forEach($scope.vnito_list, function (obj) {
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
			"deferRender": true,
			"aaData": $scope.vnito_list,
			"rowId": "com_id",
			"aoColumns": [
				{ "data": "No", "sWidth": "5%" },
				{ "data": "com_code", "sClass": "text" },
				{ "data": "com_name", "sClass": "text" },
				{
					"data": null, mRender: function (data, type, row, index) {
						if (data.com_address == "undefined" || data.com_address == null)
							data.com_address = "";
						return data.com_address;
					}, "sClass": "text"
				},
				{
					"data": null, mRender: function (data, type, row, index) {
						if (data.com_contact == "undefined" || data.com_contact == null)
							data.com_contact = "";
						return data.com_contact;
					}, "sClass": "text"
				},
				{
					"data": null, mRender: function (data, type, row) {
						var str = "";
						if (data.com_status == 0) {
							str = "Inactive";
						}
						else {
							str = "Active";
						}
						return str;
					}
				},
				{
					"data": null, mRender: function (data, type, row, index) {
						return "<button class='btn btn-warning btn-xs' data-toggle='modal' data-target='#myModalEdit' ng-click='editt(" + index.row + ")'><span class='glyphicon glyphicon-edit'></span></button>&nbsp;"
							+ "<button class='btn btn-danger btn-xs' id='R" + data.com_id + "' data-toggle='modal'  ng-click='getremove(" + data.com_id + ")' ><span class='glyphicon glyphicon-remove'></span></button>";
					}, "sWidth": "7%"
				}
			],
			"order": [[1, "asc"]]
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

	// enter keudown 
		 jQuery('input').keydown(function(event){ 
		var keyCode = (event.keyCode ? event.keyCode : event.which);   
			if (keyCode == 13) {
				addkhoahoc();
			}
	});


	//them
	$scope.addvnito = function () {
		if ($scope.add.$invalid) {
			if ($scope.add.strongSecret.$error.required) {
				$scope.require1 = true;
				$timeout(function () {
					$scope.require1 = false;
				}, 2000);
			};
			if ($scope.add.strongSecret1.$error.required) {
				$scope.require2 = true;
				$timeout(function () {
					$scope.require2 = false;
				}, 2000);
			}
			return;
		}
		for (var i = 0; i < $scope.vnito_list.length; i++) {
			if (angular.lowercase($scope.vnito_list[i].com_code) == angular.lowercase($scope.vnito.com_code)) {
				$scope.exiss = true;
				$timeout(function () {
					$scope.exiss = false;
				}, 3000);
				return;
			}
		}
		$http.post('/menu_VNITO', $scope.vnito).then(function successCallback(response) {
			$scope.vnito.No = $scope.vnito_list.length + 1;
			$scope.vnito.com_id = response.data.insertId;
			$scope.vnito_list.push($scope.vnito);

			var dt = jQuery('#data_table').dataTable();
			dt.fnAddData($scope.vnito);
			dt.fnDraw();
			$compile(document.getElementById('data_table'))($scope);

			$scope.vnito.com_status = 1;
			$scope.vnito_list.push($scope.vnito);
			$scope.com_code = $scope.vnito.com_code;
			$scope.com_name = $scope.vnito.com_name;
			$scope.visibility = true;
			$timeout(function () {
				$scope.visibility = false;
			}, 3000);
			$scope.vnito = null;
		}, function errorCallback(response) {

		});
	};


	//load form xoa
	$scope.getremove = function (id) {

		$scope.idremove = id;
		jQuery("#myModalConfirm").modal('show');
	}
	//xoa
	$scope.remove = function () {
		jQuery(function () {
			$http.delete('/menu_VNITO/' + $scope.idremove).then(function successCallback(response) {

				$scope.message = "Remove Successful";
				jQuery("#myModalmessage").modal('show');
				var tr = jQuery('#R' + $scope.idremove).closest('tr');
				var dt = jQuery('#data_table').dataTable();
				dt.fnDeleteRow(tr);
				dt.fnDraw();
				$compile(document.getElementById('data_table'))($scope);

				jQuery("#myModalmessage").on('hidden.bs.modal', function () {
					window.location.reload();
				});
				$timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
			}, function errorCallback(response) {
				console.log($scope.a);
			});


		})


	}





	//load form edit
	$scope.editt = function (index) {
		toSelect = $scope.vnito_list[index];
		$scope.editvnito = toSelect;
		jQuery("#myModalEdit").on('hidden.bs.modal', function () {
			$timeout(function () {
				window.location.reload();
			}, 500)
		});
		// alert($scope.editvnito.);
	}


	//sua
	$scope.updatevnito = function () {
		for (var i = 0; i < $scope.vnito_list.length; i++) {
			if ($scope.vnito_list[i].com_id != $scope.editvnito.com_id && angular.lowercase($scope.vnito_list[i].com_code) == angular.lowercase($scope.editvnito.com_code)) {
				$scope.message = 'Update Fail';
				jQuery("#myModalmessage").modal('show');
				refresh();
				$scope.exiss = true;
				$timeout(function () {
					$scope.exiss = false;
				}, 3000);
				$timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
				return;
			}
		}


		if ($scope.edit.$invalid) {
			if ($scope.edit.strongSecret.$error.required) {
				$scope.require1 = true;
				$timeout(function () {
					$scope.require1 = false;
				}, 2000);
			};
			if ($scope.edit.strongSecret1.$error.required) {
				$scope.require2 = true;
				$timeout(function () {
					$scope.require2 = false;
				}, 2000);
			}
			return;
		}



		$http.put('/menu_VNITO/' + $scope.editvnito.com_id, $scope.editvnito).then(function successCallback(response) {
			for (var i = 0; i < $scope.vnito_list.length; i++) {

				if ($scope.vnito_list[i].com_id === $scope.editvnito.com_id) {
					$scope.vnito_list[i] = $scope.editvnito;
				}
			}
			var dt = jQuery('#data_table').dataTable();
			var row = jQuery("tr#" + $scope.editvnito.com_id);
			dt.fnUpdate($scope.editvnito, row); // Row
			dt.fnDraw();
			$compile(document.getElementById('data_table'))($scope);
			$scope.message = 'Update Successful';
			jQuery("#myModalmessage").modal('show');
			jQuery("#myModalEdit").modal('hide');
			$timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
		}, function errorCallback(response) {

		});
	}
}]);





