var app = angular.module("TOSMS");
app.controller("listController", [
    "$scope",
    "apiService",
    function($scope, apiService) {
        $scope.role = COMMON.userRoles;
        $scope.user = JSON.parse(COMMON.getCookie("user"));
        $scope.listEmployees = [];
        let findObj = {}
        

        $scope.generateFindObj = () => {
            findObj.district = $scope.selectedDistrict ? $scope.selectedDistrict : undefined
            table.ajax.reload()
        }

        let initDatatale = () => {
            let options = {
                processing: true,
                serverSide: true,
                language: {
                    decimal: ".",
                    thousands: ",",
                    url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json",
                },
                order: [[4, "desc"]],
                search: {
                    caseInsensitive: true,
                },
                ajax: {
                    url: "/api/v1/user",
                    dataSrc: (response) => {
                        return response.data.map((employee, i) => {
                            return {
                                // avatar: generateATag(employee, "avatar"),
                                id: ++i,
                                fullname: generateATag(employee, "name"),
                                role: generateATag(employee, "role"),
                                address: generateATag(employee, "address"),
                                // status: generateATag(employee, "status"),
                                createdTime: generateATag(employee, "createdTime"),
                            };
                        });
                    },
                    data: function(data) {
                        data.find = findObj
                        return data
                    }
                },
                columns: [
                    // { data: "avatar" },
                    { data: "id", name: "id", orderable: false },
                    { data: "fullname", name: "fullname" },
                    { data: "role", name: "role" },
                    { data: "address", name: "address" },
                    // { data: "status" },
                    { data: "createdTime", name: "createdTime" },
                ],
            };
            table = $("#employees-table").DataTable(options);
        };

        initDatatale();

        function createUser() {
            let formData = new FormData();
            let file = $("#file")[0].files[0];
            let fullname = $("#fullname").val();
            let email = $("#email").val();
            // let birthdate = $("#birthdate").val();
            let gender = $("#gender").val();
            let role = $("#role").val();
            let address = $("#address").val();
            let username = $("#username").val();
            let password = $("#password").val();
            let birthdate = getTimestampFromDatePicker($("#birthdate"));

            let check = validateUser(
                file,
                fullname,
                username,
                password,
                gender,
                role
            );

            if (check) {
                formData.append("avatar", file);
                formData.append("name", fullname);
                formData.append("email", email);
                formData.append("address", address);
                formData.append("birthday", birthdate);
                // formData.append("district", district);
                formData.append("gender", gender);
                formData.append("role", role);
                formData.append("district", $scope.district)
                formData.append("username", username);
                formData.append("password", password);

                $.ajax({
                    url: "/api/v1/user",
                    method: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        if (response.message) {
                            showNotification(response.message, "success");
                            $("#employees-table").DataTable().destroy();
                            initDatatale();
                            document.getElementById("create-employee").reset();
                            $(".modal-header .close").click();
                        } else {
                            return showNotification(response.errorMessage, "danger");
                        }
                    },
                    error: function(error) {
                        console.log(error);
                        showNotification(error.responseJSON.errorMessage, "danger");
                    },
                });
            }
        }

        $("#createEmployeeBtn").on("click", function() {
            createUser();
        });
        apiService.getListDistrict('HCM').then(function(res) {
            $scope.districts = res.data.districts
        }).catch(function(error) {
            console.log(error)
            showNotification(error.data.errorMessage, 'danger')
        })
    },
]);

function validateUser(file, fullname, username, password, gender, role) {
    let check = true;
    if (!file) {
        check = false;
        return showNotification("Bạn phải chọn ảnh trước khi tạo.", "danger");
    }
    if (!fullname) {
        check = false;
        return showNotification("Tên người dùng không thể bỏ trống.", "danger");
    }
    if (!username) {
        check = false;
        return showNotification("Tên tài khoản không được bỏ trống.", "danger");
    }
    if (gender === "? undefined:undefined ?") {
        check = false;
        return showNotification("Vui lòng chọn giới tính.", "danger");
    }
    if (role === "? undefined:undefined ?") {
        check = false;
        return showNotification("Vui lòng chọn chức vụ.", "danger");
    }
    if (!password) {
        check = false;
        return showNotification("Mật khẩu không được bỏ trống.", "danger");
    }
    return check;
}

function generateATag(employee, property) {
    let data = employee[property];
    if (property === "createdTime") {
        data = parseInt(data);
        data = formatDate(data);
    }
    if (property === "role") {
        data === "worker" ? (data = "Nhân Viên") : (data = "Quản Lý");
    }
    let result =
        '<a class="table-row-link" href="/employee/' +
        employee._id +
        '">' +
        data +
        "</a>";
    return result;
}