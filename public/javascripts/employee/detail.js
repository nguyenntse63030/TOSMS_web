app.controller("detailController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.id = $("#code").text();
    $scope.isNotEditing = true;
    $scope.employee = {};

    apiService
      .getProfileEmployee($scope.id)
      .then((res) => {
        $scope.employee = res.data.user;
      })
      .catch((error) => {
        console.log(error);
        showNotification("Co loi!", "danger");
      });

    $scope.updateEmployee = () => {
      apiService
        .updateEmployee($scope.id, $scope.employee)
        .then((res) => {
          if (res.data.errorMessage) {
            showNotification(res.data.errorMessage, "danger");
          } else {
            $scope.employee = res.data.user;
            showNotification(res.data.message, "success");
          }
        })
        .catch((error) => {
          showNotification(error, "danger");
        });
    };
    $scope.deleteEmployee = () => {
      apiService
        .deleteEmployee($scope.id)
        .then((res) => {
          if (res.data.errorMessage) {
            showNotification(res.data.errorMessage, "danger");
          } else {
            showNotification(res.data.message, "success");
            setTimeout(function () {
              window.location.href = "/employee";
            }, 1000);
          }
        })
        .catch((error) => {
          showNotification(error, "danger");
        });
    };

    $scope.uploadAvataEmployee = () => {
      let formData = new FormData();
      let file = $scope.employeeAvata;
      formData.append("image", file);
      apiService
        .uploadAvataEmployee($scope.id, formData)
        .then((res) => {
          if (res.data.errorMessage) {
            showNotification(res.data.errorMessage, "danger");
          } else {
            $scope.employee = res.data.user;
            showNotification(res.data.message, "success");
          }
        })
        .catch((error) => {
          showNotification(error, "danger");
        });
    };
  },
]);
