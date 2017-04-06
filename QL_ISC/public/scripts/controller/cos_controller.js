app.controller('cos_controller', ['$scope', '$http', '$window', '$compile', '$timeout', function ($scope, $http, $window, $compile, $timeout) {
    var refresh = function () {

        $http({
            method: 'GET',
            url: '/menu_CThoc_COS'
        }).then(function successCallback(response) {
            $scope.CTH_list = response.data;
            loadtable();
        }, function errorCallback(response) {

        });

        $http({
            method: 'GET',
            url: '/menu_CThoc_COS1'
        }).then(function successCallback(response) {
            $scope.CTH_list1 = response.data;
        }, function errorCallback(response) {

        });

        $http({
            method: 'GET',
            url: '/menu_Monhoc'
        }).then(function successCallback(response) {
            $scope.MH_list = response.data;
        }, function errorCallback(response) {

        });
    }


    var loadtable = function () {
        var i = 1;
        angular.forEach($scope.CTH_list, function (obj) {
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
            "aaData": $scope.CTH_list,
            "rowId": "pro_code",
            "aoColumns": [
                { "data": "No", "sWidth": "5%" },
                { "data": "pro_code", "sClass": "text" },
                { "data": "pro_name", "sClass": "text" },
                { "data": "pro_description", "sClass": "text" },
                {
                    "data": null, mRender: function (data, type, row) {
                        var str = "";
                        if (data.pro_status == 0) {
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
                            + "<button class='btn btn-danger btn-xs' id=" + data.pro_id + " data-toggle='modal'  ng-click='getremove(" + data.pro_id + ")'><span class='glyphicon glyphicon-remove'></span></button>";
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
    // enter keydown 
    jQuery('input').keydown(function (event) {
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode == 13) {
            addkhoahoc();
        }
    });


    refresh();


    var mang_mh = [];
    //kiem tra checkbox roi pust vao mang_mh
    $scope.check = function ($index) {
        var name = $scope.MH_list[$index].dis_code;

        var data = jQuery("#" + name).data("check");
        if (data == "true") {
            jQuery("#" + name).data("check", "false");
            for (var i = 0; i < mang_mh.length; i++) {
                if (mang_mh[i] == name)
                    mang_mh.splice(i, 1);
            }

        }
        else {
            jQuery("#" + name).data("check", "true");
            mang_mh.push(name);
        }
    }

    // //them
    $scope.add = function () {

        if (mang_mh.length == 0) {
            $scope.message = 'Please select Description';
            jQuery("#myModalmessage").modal('show');
            $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
        }
        if ($scope.data_spec == null) {
            $scope.message = 'Please select Specialization';
            jQuery("#myModalmessage").modal('show');
            $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
        }
        else {
            var data_res = {
                "cth": $scope.data_spec,
                "list_mh": mang_mh
            }

            $http.post('/menu_cos', data_res).then(function successCallback(response) {
            }, function errorCallback(response) {
            });
            jQuery("#myModalAdd").modal('hide')
            $scope.message = 'Add Successful';
            jQuery("#myModalmessage").modal('show');
            jQuery("#myModalmessage").on('hidden.bs.modal', function () {
                window.location.reload();
            });
            $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
        }
    }



    $scope.getremove = function (id) {
        $scope.id = id;
        jQuery("#myModalConfirm").modal('show');
    }


    //xoa
    $scope.remove = function () {
        $http.delete('/menu_cos/' + $scope.id).then(function successCallback(response) {
        }, function errorCallback(response) {
        });
        $scope.message = 'Remove Successful';
        jQuery("#myModalmessage").modal('show');
        jQuery("#myModalmessage").on('hidden.bs.modal', function () {
            window.location.reload();
        });
        $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
    }

    //load form edit
    $scope.editt = function (index) {
        mang_mh_update = [];
        toSelect = $scope.CTH_list[index];
        $scope.edit.pro_name = $scope.CTH_list[index].pro_name;
        $scope.edit.pro_code = $scope.CTH_list[index].pro_code;
        var code = $scope.CTH_list[index].pro_code;
        $http({
            method: 'GET',
            url: '/cth/' + code
        }).then(function successCallback(response) {
            $scope.dis_codes = response.data;
            for (var x = 0; x < $scope.MH_list.length; x++) {
                var name = $scope.MH_list[x].dis_code;
                jQuery("#" + name + "1").data("check", "false");
                jQuery("#" + name + "1").prop('checked', false);
            }
            for (var i = 0; i < $scope.dis_codes.length; i++) {
                name = $scope.dis_codes[i].dis_code;
                jQuery("#" + name + "1").data("check", "true");
                jQuery("#" + name + "1").prop('checked', true);
                mang_mh_update.push(name);
            }
        });
        jQuery("#myModalEdit").on('hidden.bs.modal', function () {
            $timeout(function () {
                window.location.reload();
            }, 500)
        });
    }


    //sua
    $scope.update = function () {
        var mang_mh_update = [];
        for (var i = 0; i < $scope.MH_list.length; i++) {
            var name = $scope.MH_list[i].dis_code;
            if (jQuery("#" + name + "1").is(':checked') == true)
                mang_mh_update.push(name);
        }
        var data_res_update = {
            "cth": $scope.edit.pro_code,
            "list_mh": mang_mh_update
        }

        $http.put('/menu_cos/' + $scope.edit.pro_code, data_res_update).then(function successCallback(response) {
        }, function errorCallback(response) {

        });
        jQuery("#myModalEdit").modal('hide');
        $scope.message = 'Update Successful';
        jQuery("#myModalmessage").modal('show');
        $timeout(function () { jQuery("#myModalmessage").modal('hide') }, 2000);
    }
}]);