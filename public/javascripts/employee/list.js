var app = angular.module("TOSMS");
app.controller("listController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.role = COMMON.userRoles;
    $scope.user = JSON.parse(COMMON.getCookie("user"));
    $scope.listEmployees = [];
    // $scope.listEmployees = await apiService.getListEmployee();
    let initDatatale = () => {
      let options = {
        processing: true,
        serverSide: true,
        language: {
          decimal: ".",
          thousands: ",",
          url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json",
        },
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
        },
        columns: [
          // { data: "avatar" },
          { data: "id" },
          { data: "fullname" },
          { data: "role" },
          { data: "address" },
          // { data: "status" },
          { data: "createdTime" },
        ],
      };
      $("#employees-table").DataTable(options);
    };

    initDatatale();
    function createUser() {
      let formData = new FormData();
      let file = $("#file")[0].files[0];
      let fullname = $("#fullname").val();
      let email = $("#email").val();
      let birthdate = $("#birthdate").val();
      let gender = $("#gender").val();
      let role = $("#role").val();
      let address = $("#address").val();
      let username = $("#username").val();
      let password = $("#password").val();

      let check = validateUser(file, fullname, username, password, checkExist);

      if (check) {
        formData.append("avatar", file);
        formData.append("name", fullname);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("birthdate", birthdate);
        // formData.append("district", district);
        formData.append("gender", gender);
        formData.append("role", role);
        formData.append("username", username);
        formData.append("password", password);

        $.ajax({
          url: "/api/v1/user",
          method: "POST",
          data: formData,
          contentType: false,
          processData: false,
          success: function (response) {
            if (response.message) {
              showNotification(response.message, "success");
              $("#employees-table").DataTable().destroy();
              initDatatale();
              document.getElementById("create-employee").reset();
              $(".modal-header .close").click();
            } else {
              return showNotification(response.errorMessage, "warning");
            }
          },
        });
      }
    }

    $("#createEmployeeBtn").on("click", function () {
      createUser();
    });
  },
]);

function validateUser(file, fullname, username, password, checkExist) {
  let check = true;
  if (!file) {
    check = false;
    return showNotification("Bạn phải chọn ảnh trước khi tạo.", "warning");
  }

  if (!fullname) {
    check = false;
    return showNotification("Tên người dùng không thể bỏ trống.", "warning");
  }
  if (!username) {
    check = false;
    return showNotification("Tên tài khoản không được bỏ trống.", "warning");
  }
  if (!password) {
    check = false;
    return showNotification("Mật khẩu không được bỏ trống.", "warning");
  }
  if (!checkExist) {
    check = false;
    return showNotification(
      "Tài khoản đã tồn tại vui lòng đổi tài khoản khác.",
      "warning"
    );
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
    data === "worker" ? (data = "Công Nhân") : (data = "Quản Lý");
  }
  let result =
    '<a class="table-row-link" href="/employee/' +
    employee._id +
    '">' +
    data +
    "</a>";
  return result;
}
