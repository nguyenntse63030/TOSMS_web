var app = angular.module("PRC391");
app.controller("createController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.employee = {
      name: "",
      phone: "",
      gender: "",
      // email: '',
      role: "",
      address: "",
      username: "",
      password: "",
    };

    $scope.createUser = () => {
      $scope.employee.dateOfBirth = getTimestampFromDatePicker("#birthdate");
      apiService
        .createUser($scope.employee)
        .then(function (res) {
          showNotification(res.data.message, "success");
          setTimeout(() => {
            window.location.href = "/employee";
          }, 2000);
        })
        .catch(function (error) {
          console.log(error);
          showNotification(error.data.errorMessage, "danger");
        });
    };
  },
]);
