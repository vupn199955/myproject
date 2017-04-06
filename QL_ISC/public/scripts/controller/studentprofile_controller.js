app.controller('studentprofile_ctl', ['$scope', '$http', '$window', '$compile', '$timeout', function ($scope, $http, $window, $compile, $timeout) {


    var refresh = function () {

        $http({
            method: 'GET',
            url: '/menu_Studentprofile'
        }).then(function successCallback(response) {

            $scope.studentprofile_list = response.data;
         loadtable();
        }, function errorCallback(response) {

        });
	}

    var loadtable = function () {
        var i = 1;
        angular.forEach($scope.studentprofile_list, function (obj) {
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
            "aaData": $scope.studentprofile_list,
            "rowId": "id_profile",
            "aoColumns": [
                { "data": "No","sWidth":"5%" },
                { "data": "id_profile", "sClass": "text","sWidth":"15%" },
                { "data": "code_profile", "sClass": "text","sWidth":"15%" },
                { "data": "name_profile", "sClass": "text" },
                {
                    "data": null, mRender: function (data, type, row) {
                        var str = "";
                        if (data.status_profile == 0) {
                            str = "Inactive";
                        }
                        else {
                            str = "Active";
                        }
                        return str;
                    }, "sWidth": "15%"
                },
                {
                    "data": null, mRender: function (data, type, row, index) {
                        return "<button class='btn btn-warning btn-xs' data-toggle='modal' data-target='#myModalEdit' ng-click='editt(" + index.row + ")'><span class='glyphicon glyphicon-edit'></span></button>&nbsp;"
                            + "<button class='btn btn-danger btn-xs' id=" + data.id_profile + " data-toggle='modal'  ng-click='getremove(" + data.id_profile + ")'><span class='glyphicon glyphicon-remove'></span></button>";
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
	// enter keudown 
		 jQuery('input').keydown(function(event){ 
		var keyCode = (event.keyCode ? event.keyCode : event.which);   
			if (keyCode == 13) {
				addkhoahoc();
			}
	});

    //them
    $scope.addstudentprofile = function () {
        if ($scope.add.$invalid || $scope.add.$pattern ) {
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
		
		
		
		
		
		
		// check id existed
        for (var i = 0; i < $scope.studentprofile_list.length; i++) {
            if (angular.lowercase($scope.studentprofile_list[i].code_profile) == angular.lowercase($scope.studentprofile.code_profile)) {
                $scope.exiss = true;
                $timeout(function () {
                    $scope.exiss = false;
                }, 3000);
                return;
            }
        }
		
		

		
		
        $http.post('/menu_Studentprofile', $scope.studentprofile).then(function successCallback(response) {
            //refresh();
            //$window.location.reload();
             $scope.studentprofile.No = $scope.studentprofile_list.length + 1;
            $scope.studentprofile.id_profile = response.data.insertId;
            $scope.studentprofile.status = 1;
            $scope.studentprofile_list.push($scope.studentprofile);
			var dt = jQuery('#data_table').dataTable();
            dt.fnAddData($scope.studentprofile);
            dt.fnDraw();
            $compile(document.getElementById('data_table'))($scope);
            $scope.code_profile = $scope.studentprofile.code_profile;
            $scope.name_profile = $scope.studentprofile.name_profile;
            $scope.visibility = true;
            $timeout(function () {
                $scope.visibility = false;
            }, 3000);
            $scope.studentprofile = null;
        }, function errorCallback(response) {

        });
    }



    $scope.getremove = function (id) {
        $scope.id = id;
        jQuery("#myModalConfirm").modal('show');
    }


    //xoa
    $scope.remove = function () {
		var stt;
        $http.delete('/menu_Studentprofile/' + $scope.id).then(function successCallback(response) {
			 $scope.message = 'Remove Successful';
			jQuery("#myModalmessage").modal('show');
            var tr = jQuery('#' + $scope.id).closest('tr');
            var dt = jQuery('#data_table').dataTable();
            dt.fnDeleteRow(tr);
			dt.fnDraw();
            $compile(document.getElementById('data_table'))($scope);

           jQuery("#myModalmessage").on('hidden.bs.modal', function(){
					window.location.reload();
			});
			
            $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
        }, function errorCallback(response) {
        });
    }




    //load form edit
    $scope.editt = function (index) {
        toSelect = $scope.studentprofile_list[index];
        $scope.editstudentprofile = toSelect;
        jQuery("#myModalEdit").on('hidden.bs.modal', function () {
			$timeout(function () {
				window.location.reload();
			}, 500)
		});
    }


    //sua
    $scope.updatestudent_profile = function () {
		console.log($scope.editstudentprofile.id_profile);
		if ($scope.edit.$invalid || $scope.edit.$pattern ) {
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



		
        for (var i = 0; i < $scope.studentprofile_list.length; i++) {
            if (angular.lowercase($scope.studentprofile_list[i].code_profile) == angular.lowercase($scope.editstudentprofile.code_profile) && $scope.studentprofile_list[i].id_profile != $scope.editstudentprofile.id_profile) {
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
        $http.put('/menu_Studentprofile/' + $scope.editstudentprofile.id_profile, $scope.editstudentprofile).then(function successCallback(response) {
            $scope.message = 'Update Successful';
            jQuery("#myModalmessage").modal('show');
            jQuery("#myModalEdit").modal('hide');
            $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
        }, function errorCallback(response) {

        });
    }
}]);