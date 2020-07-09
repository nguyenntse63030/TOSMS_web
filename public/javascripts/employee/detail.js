app.directive("fileModel", [
  "$parse",
  function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        let model = $parse(attrs.fileModel);
        let modelSetter = model.assign;
        element.bind("change", function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  },
]);

app.controller("detailController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.id = $("#code").text();
    $scope.isNotEditing = true;
    $scope.user = JSON.parse(COMMON.getCookie('user'));
    $scope.employee = {};
    $scope.role = (JSON.parse(COMMON.getCookie('user'))).role;
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
      $scope.employee.birthday = getTimestampFromDatePicker($('#birthdate'))
      apiService
        .updateEmployee($scope.id, $scope.employee)
        .then((res) => {
          if (res.data.status !== 200) {
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
