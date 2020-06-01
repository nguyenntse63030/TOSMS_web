var app = angular.module("PRC391");
app.controller("createController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.camera = {
      idcamera: "",
      status: "",
    };

    $scope.createUser = () => {
      $scope.camera.dateOfBirth = getTimestampFromDatePicker("#birthdate");
      apiService
        .createUser($scope.camera)
        .then(function (res) {
          showNotification(res.data.message, "success");
          setTimeout(() => {
            window.location.href = "/camera";
          }, 2000);
        })
        .catch(function (error) {
          console.log(error);
          showNotification(error.data.errorMessage, "danger");
        });
    };
  },
]);
