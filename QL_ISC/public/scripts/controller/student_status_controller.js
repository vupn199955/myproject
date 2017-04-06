app.controller('student_status_ctl', ['$scope', '$http', '$window', '$compile', '$timeout', function ($scope, $http, $window, $compile, $timeout) {


    var refresh = function () {

        $http({
            method: 'GET',
            url: '/menu_Studentstatus'
        }).then(function successCallback(response) {

            $scope.student_status_list = response.data;
            loadtable();
        }, function errorCallback(response) {

        });
		
    }

    var loadtable = function () {
        var i = 1;
        angular.forEach($scope.student_status_list, function (obj) {
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
            "aaData": $scope.student_status_list,
            "rowId": "id_ss",
            "aoColumns": [
                { "data": "No","sWidth":"1%" },
                { "data": "id_ss", "sClass": "text","sWidth":"7%" },
                { "data": "code_ss", "sClass": "text","sWidth":"15%" },
                { "data": "name_ss", "sClass": "text" },
				{
                    "data": null, mRender: function (data, type, row, index) {
                        return "<button class='btn btn-warning btn-xs' data-toggle='modal' data-target='#myModalEdit' ng-click='editt(" + index.row + ")'><span class='glyphicon glyphicon-edit'></span></button>&nbsp;"
                            + "<button class='btn btn-danger btn-xs' id=" + data.id_ss + " data-toggle='modal'  ng-click='getremove(" + data.id_ss + ")'><span class='glyphicon glyphicon-remove'></span></button>";
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
    $scope.addstudent_status = function () {
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
        for (var i = 0; i < $scope.student_status_list.length; i++) {
            if (angular.lowercase($scope.student_status_list[i].code_ss) == angular.lowercase($scope.student_status.code_ss)) {
                $scope.exiss = true;
                $timeout(function () {
                    $scope.exiss = false;
                }, 3000);
                return;
            }
        }
		
					

		
		
		
		
		
        $http.post('/menu_Studentstatus', $scope.student_status).then(function successCallback(response) {
            //refresh();
            //$window.location.reload();
             $scope.student_status.No = $scope.student_status_list.length + 1;
            $scope.student_status.id_ss = response.data.insertId;
            $scope.student_status_list.push($scope.student_status);
			var dt = jQuery('#data_table').dataTable();
            dt.fnAddData($scope.student_status);
            dt.fnDraw();
            $compile(document.getElementById('data_table'))($scope);
            $scope.code_ss = $scope.student_status.code_ss;
            $scope.name_ss = $scope.student_status.name_ss;
            $scope.visibility = true;
            $timeout(function () {
                $scope.visibility = false;
            }, 3000);
            $scope.student_status = null;
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
        $http.delete('/menu_Studentstatus/' + $scope.id).then(function successCallback(response) {
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
        toSelect = $scope.student_status_list[index];
        $scope.editstudent_status = toSelect;
        jQuery("#myModalEdit").on('hidden.bs.modal', function () {
			$timeout(function () {
				window.location.reload();
			}, 500)
		});
    }


    //sua
    $scope.updatestudent_status = function () {

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
          
    

		
		
		//kiem tra trung id
			const editID=$scope.editstudent_status.code_ss
        for (var i = 0; i < $scope.student_status_list.length; i++) {
            if (angular.lowercase($scope.student_status_list[i].code_ss) == angular.lowercase($scope.editstudent_status.code_ss) && $scope.student_status_list[i].id_ss != $scope.editstudent_status.id_ss) {
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
		//update data
        $http.put('/menu_Studentstatus/' + $scope.editstudent_status.id_ss, $scope.editstudent_status).then(function successCallback(response) {
            $scope.message = 'Update Successful';
            jQuery("#myModalmessage").modal('show');
            jQuery("#myModalEdit").modal('hide');
            $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
        }, function errorCallback(response) {

        });
    }
}]);