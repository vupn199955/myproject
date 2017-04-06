app.controller('class_ctl', ['$scope', '$http', '$window', '$compile', '$timeout', function ($scope, $http, $window, $compile, $timeout) {
	var data = [
		{
		"class_code": "ABCD",
		"class_name": "html",
		"class_hours": "20",
		"class_startdate": "10/10/2017",
		"class_enddate": "11/11/2017",
		"class_status": "1",
		},
		{
		"class_code": "ABCDE",
		"class_name": "angularjs",
		"class_hours": "25",
		"class_startdate": "5/5/2017",
		"class_enddate": "6/6/2017",
		"class_status": "1",
		},
		{
		"class_code": "ABCDF",
		"class_name": "nodejs",
		"class_hours": "30",
		"class_startdate": "7/7/2017",
		"class_enddate": "8/8/2017",
		"class_status": "1",
		},
		{
		"class_code": "ABCDG",
		"class_name": "database",
		"class_hours": "35",
		"class_startdate": "9/9/2017",
		"class_enddate": "10/10/2017",
		"class_status": "1",
		}
]
    var refresh = function () {

        // $http({
            // method: 'GET',
            // url: ''
        // }).then(function successCallback(response) {

            // $scope.class_list =response.data;
			// console.log(response.data.data_class);
            // loadtable();
        // }, function errorCallback(response) {
			
        // });
		 $scope.class_list = data;
		 loadtable();
    }
    var loadtable = function () {
        var i = 1;
        angular.forEach($scope.class_list, function (obj) {
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
            "aaData": $scope.class_list,
            "rowId": "int_id",
            "aoColumns": [
                { "data": "No","sWidth":"5%" },
                { "data": "class_code", "sClass": "text" },
                { "data": "class_name", "sClass": "text" },
                {
                    "data": "class_hours", "sClass": "text"
                },
                {
					"data": null, mRender: function (data, type, row) {
								var str = "";
								var date_star = new Date(data.class_startdate);
								var date = date_star.getDate();
								var month = date_star.getMonth() + 1;
								str = (month >= 10 ? month : "0" + month) + "/" + (date >= 10 ? date : "0" + date) + "/" + date_star.getFullYear();
								return str;
					}		
				},
                {
					"data": null, mRender: function (data, type, row) {
						var str = "";
						var date_end = new Date(data.class_enddate);
						var date = date_end.getDate();
						var month = date_end.getMonth() + 1;
						str = (month >= 10 ? month : "0" + month) + "/" + (date >= 10 ? date : "0" + date) + "/" + date_end.getFullYear();
						return str;
					}
				},
                {
                    "data": null, mRender: function (data, type, row) {
                        var str = "";
                        if (data.status == 0) {
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
                            + "<button class='btn btn-danger btn-xs' id=" + data.class_code + " data-toggle='modal'  ng-click='getremove(" + data.class_code + ")'><span class='glyphicon glyphicon-remove'></span></button>";
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


    //them
    $scope.addclass = function () {
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
			if ($scope.add.strongSecret2.$error.required ||$scope.add.strongSecret2.$error.pattern ) {
			
				$scope.date1 = true;
				$timeout(function () {
					$scope.date1 = false;
				}, 2000);
			};
			if ($scope.add.strongSecret3.$error.required ||$scope.add.strongSecret3.$error.pattern ) {
			
				
				$scope.date2 = true;
				$timeout(function () {
					$scope.date2 = false;
				}, 2000);
			}
            return;
        }
		
		
		
		
		
		
		// check id existed
        for (var i = 0; i < $scope.class_list.length; i++) {
            if (angular.lowercase($scope.class_list[i].int_code) == angular.lowercase($scope.class.class_code)) {
                $scope.exiss = true;
                $timeout(function () {
                    $scope.exiss = false;
                }, 3000);
                return;
            }
        }
		
		
		// comparedate
		
				var timeStart = new Date($scope.class.class_startdate);
				var timeEnd = new Date($scope.class.class_enddate);
				if(timeStart.getFullYear() >= timeEnd.getFullYear()){
					if(timeStart.getMonth() + 1 >= timeEnd.getMonth() + 1){
							if(timeStart.getDate() >= timeEnd.getDate()){
								$scope.comparedate = true;
								$timeout(function () {
								$scope.comparedate = false;
								}, 3000);
								return;
							}
					}					
				} 
					
				
					

		
		
		
		
		
        $http.post('', $scope.class).then(function successCallback(response) {
            //refresh();
            //$window.location.reload();
             $scope.class.No = $scope.class_list.length + 1;
            $scope.class.class_code = response.data.insertId;
            $scope.class.class_status = 1;
            $scope.class_list.push($scope.khoahoc);
			var dt = jQuery('#data_table').dataTable();
            dt.fnAddData($scope.khoahoc);
            dt.fnDraw();
            $compile(document.getElementById('data_table'))($scope);
            $scope.class_code = $scope.class.class_code;
            $scope.class_name = $scope.class.class_name;
            $scope.visibility = true;
            $timeout(function () {
                $scope.visibility = false;
            }, 3000);
            $scope.class = null;
        }, function errorCallback(response) {

        });
    }



    $scope.getremove = function (id) {
        $scope.id = id;
        jQuery("#myModalConfirm").modal('show');
    }


    //xoa
    $scope.remove = function () {
        $http.delete('' + $scope.id).then(function successCallback(response) {
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
        toSelect = $scope.class_list[index];
        $scope.editclass = toSelect;
        var date_end = new Date(toSelect.class_enddate);
		var date =  date_end.getDate();
        var month = date_end.getMonth() + 1;
        var str1 = (month >= 10 ? month : "0" + month) + "/" + (date >= 10 ? date : "0" + date) + "/" + date_end.getFullYear();
        $scope.editclass.class_enddate = str1;

        var date_star = new Date(toSelect.class_startdate);
		var date = date_star.getDate();
        var month = date_star.getMonth() + 1;
        var str2 = (month >= 10 ? month : "0" + month) + "/" + (date >= 10 ? date : "0" + date) + "/" + date_star.getFullYear();
        $scope.editclass.class_startdate = str2;
        jQuery("#myModalEdit").on('hidden.bs.modal', function () {
			$timeout(function () {
				window.location.reload();
			}, 500)
		});
    }


    //sua
    $scope.updatekhoahoc = function () {

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
			if ($scope.edit.strongSecret2.$error.required ||$scope.edit.strongSecret2.$error.pattern ) {
			
				$scope.date1 = true;
				$timeout(function () {
					$scope.date1 = false;
				}, 3000);
			};
			if ($scope.edit.strongSecret3.$error.required ||$scope.edit.strongSecret3.$error.pattern ) {
			
				
				$scope.date2 = true;
				$timeout(function () {
					$scope.date2 = false;
				}, 3000);
			}
            return;
        }

		
		
		
		// comparedate
		
				var timeStart = new Date($scope.editclass.class_startdate);
				var timeEnd = new Date($scope.editclass.class_enddate);
				if(timeStart.getFullYear() >= timeEnd.getFullYear()){
					if(timeStart.getMonth() + 1 >= timeEnd.getMonth() + 1){
							if(timeStart.getDate() >= timeEnd.getDate()){
								$scope.comparedate = true;
								$timeout(function () {
								$scope.comparedate = false;
								}, 3000);
								return;
							}
					}					
				} 
		
        for (var i = 0; i < $scope.class_list.length; i++) {
            if (angular.lowercase($scope.class_list[i].class_code) == angular.lowercase($scope.editclass.class_code) && $scope.class_list[i].class_code != $scope.editclass.class_code) {
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
        $http.put('' + $scope.editclass.class_code, $scope.editclass).then(function successCallback(response) {
            for (var i = 0; i < $scope.class_list.length; i++) {
                if ($scope.class_list[i].class_code == $scope.editclass.class_code) {
                    $scope.class_list[i] = $scope.editclass;
                }
            }
            var dt = jQuery('#data_table').dataTable();
            var row = jQuery("tr#" + $scope.editclass.class_code);
            dt.fnUpdate($scope.editclass, row); // Row
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