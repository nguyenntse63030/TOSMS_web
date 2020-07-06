app.controller("detailController", ["$scope", "apiService", function ($scope, apiService) {
  $scope.id = $("#id").text();
  $scope.isNotEditing = true;
  $scope.camera = {};
  let checkCameraStream = false

  apiService
    .getDetailCamera($scope.id)
    .then((res) => {
      $scope.camera = res.data.camera;
      if (!$scope.camera.tree) {
        showNotification('Bạn chưa chọn cây để theo dõi cho camera hoặc cây đã bị xóa.', 'warning')
      }
    })
    .catch((error) => {
      console.log(error);
      showNotification("Co loi!", "danger");
    });

  $scope.deleteCamera = () => {
    apiService
      .deleteCamera($scope.id)
      .then((res) => {
        if (res.data.errorMessage) {
          showNotification(res.data.errorMessage, "danger");
        } else {
          showNotification(res.data.message, "success");
          setTimeout(function () {
            window.location.href = "/camera";
          }, 1000);
        }
      })
      .catch((error) => {
        showNotification(error, "danger");
      });
  };

  $scope.updateCamera = () => {
    apiService
      .updateCamera($scope.id, $scope.camera)
      .then((res) => {
        if (res.data.errorMessage) {
          showNotification(res.data.errorMessage, "danger");
        } else {
          $scope.camera = res.data.camera;
          showNotification(res.data.message, "success");
        }
      })
      .catch((error) => {
        showNotification(error, "danger");
      });
  };

  $scope.getCameraStream = () => {
    if (!checkCameraStream) {
      apiService.getCameraStream($scope.camera._id).then((res) => {
        checkCameraStream = true
        player = new JSMpeg.Player('ws://localhost:9999', {
          canvas: document.getElementById('video') // Canvas should be a canvas DOM element
        })
      }).catch((error) => {
        showNotification(error, "danger");
      })
    }
  }

},
]);
