var app = angular.module("PRC391");
app.controller("createController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.tree = {
      idtree: "",
      typetree: "",
      status: "",
      location: "",
      idcamera: "",
    };

    $scope.createUser = () => {
      $scope.tree.dateOfBirth = getTimestampFromDatePicker("#birthdate");
      apiService
        .createUser($scope.tree)
        .then(function (res) {
          showNotification(res.data.message, "success");
          setTimeout(() => {
            window.location.href = "/tree";
          }, 2000);
        })
        .catch(function (error) {
          console.log(error);
          showNotification(error.data.errorMessage, "danger");
        });
    };
  },
]);
