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

    // $scope.getListTree = () => {
    //   apiService.getListTree().then(response => {
    //     $scope.trees = response.data.data
    //   }).catch(err => {
    //     showNotification(err.data.errorMessage, 'warning')
    //   })
    // }
    // $scope.getListTree();

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
          let canvas = document.getElementById('video')
          player = new JSMpeg.Player('ws://'+ window.location.hostname + ':' + res.data.port, {
            canvas: canvas // Canvas should be a canvas DOM element
          })
        }).catch((error) => {
          showNotification(error, "danger");
        })
      }
    }
    $scope.uploadImageCamera = () => {
      let formData = new FormData();
      let file = $scope.cameraImage;
      formData.append("image", file);
      apiService
        .uploadImageCamera($scope.id, formData)
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
  },
]);
