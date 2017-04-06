app.controller('classroom_ctl', ['$scope', '$http', '$window', '$compile', '$timeout', function ($scope, $http, $window, $compile, $timeout) {
    var refresh = function () {

        $http({
            method: 'GET',
            url: '/menu_Classrom'
        }).then(function successCallback(response) {

            $scope.classroom_list =response.data;
            loadtable();
        }, function errorCallback(response) {
			
        });
    }
	
	
    var loadtable = function () {
        var i = 1;
        angular.forEach($scope.classroom_list, function (obj) {
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
            "aaData": $scope.classroom_list,
            "rowId": "id_room",
            "aoColumns": [
                { "data": "No","sWidth":"5%" },
                { "data": "id_room", "sClass": "text" },
                { "data": "code_room", "sClass": "text" },
                {"data": "type_room", "sClass": "text"},
                {"data": "number_seats","sWidth":"5%"},
				{"data": "description", "sClass": "text"},
                {
                    "data": null, mRender: function (data, type, row) {
                        var str = "";
                        if (data.status_room == 0) {
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
                            + "<button class='btn btn-danger btn-xs' id=" + data.id_room + " data-toggle='modal'  ng-click='getremove(" + data.id_room + ")'><span class='glyphicon glyphicon-remove'></span></button>";
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
    $scope.addclassroom = function () {
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
		
		
		
		
		
		
		//check id existed
        for (var i = 0; i < $scope.classroom_list.length; i++) {
						
            if (angular.lowercase($scope.classroom_list[i].code_room) == angular.lowercase($scope.classroom.code_room)) {
				alert("trung id");
                $scope.exiss = true;
                $timeout(function () {
                    $scope.exiss = false;
                }, 3000);
                return;
            }
        }
		
		
		
		
		
		
        $http.post('/menu_Classrom', $scope.classroom).then(function successCallback(response) {
            //refresh();
            //$window.location.reload();
             $scope.classroom.No = $scope.classroom_list.length + 1;
            $scope.classroom.id_room = response.data.insertId;
            $scope.classroom.status_room = 1;
            $scope.classroom_list.push($scope.classroom);
			var dt = jQuery('#data_table').dataTable();
            dt.fnAddData($scope.classroom);
            dt.fnDraw();
            $compile(document.getElementById('data_table'))($scope);
            $scope.id_room = $scope.classroom.id_room;
            $scope.code_room = $scope.classroom.code_room;
            $scope.visibility = true;
            $timeout(function () {
                $scope.visibility = false;
            }, 3000);
            $scope.classroom = null;
        }, function errorCallback(response) {

        });
    }



    $scope.getremove = function (id) {
        $scope.id = id;
        jQuery("#myModalConfirm").modal('show');
    }


    //xoa
    $scope.remove = function () {
        $http.delete('/menu_Classrom/' + $scope.id).then(function successCallback(response) {
			 $scope.message = 'Remove Successful';
			 	jQuery("#myModalmessage").modal('show');
           jQuery("#myModalmessage").on('hidden.bs.modal', function(){
					window.location.reload();
			});			
            $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
        }, function errorCallback(response) {
        });
    }




    //load form edit
    $scope.editt = function (index) {
        toSelect = $scope.classroom_list[index];
        $scope.editclassroom = toSelect;
        jQuery("#myModalEdit").on('hidden.bs.modal', function () {
			$timeout(function () {
				window.location.reload();
			}, 500)
		});
    }


    //sua
    $scope.updateclassroom = function () {

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
			if ($scope.edit.strongSecret2.$error.required) {
				
				$scope.require3 = true;
				$timeout(function () {
					$scope.require3 = false;
				}, 2000);
			}
            return;
        }

		
		
        for (var i = 0; i < $scope.classroom_list.length; i++) {
            if (angular.lowercase($scope.classroom_list[i].code_room) == angular.lowercase($scope.editclassroom.code_room) && $scope.classroom_list[i].id_room != $scope.editclassroom.id_room) {
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
        $http.put('/menu_Classrom/' + $scope.editclassroom.id_room, $scope.editclassroom).then(function successCallback(response) {
            $scope.message = 'Update Successful';
            jQuery("#myModalmessage").modal('show');
            jQuery("#myModalEdit").modal('hide');
            $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
        }, function errorCallback(response) {

        });
    }
}]);