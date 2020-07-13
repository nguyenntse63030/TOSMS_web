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
    $scope.tree = {};
    $scope.user = JSON.parse(COMMON.getCookie("user"));
    loadLocation($scope, apiService);

    apiService
      .getDetailTree($scope.id)
      .then((res) => {
        $scope.tree = res.data.tree;
        $scope.city = $scope.tree.city;
        $scope.district = $scope.tree.district;
        $scope.ward = $scope.tree.ward;
        if (!$scope.tree.camera) {
          showNotification(
            "Bạn chưa thiết lập camera giám sát cho cây hoặc camera đã bị xóa.",
            "warning"
          );
        }
        apiService.getListCities().then((res) => {
          $scope.cities = res.data.cities;
        });
        apiService.getListDistrict($scope.city).then((res) => {
          $scope.districts = res.data.districts;
        });
        apiService.getListWard($scope.district).then((res) => {
          $scope.wards = res.data.wards;
        });

        initNotificationDatatable();
      })
      .catch((error) => {
        console.log(error);
        showNotification("Co loi!", "danger");
      });

    $scope.deleteTree = () => {
      apiService
        .deleteTree($scope.id)
        .then((res) => {
          if (res.data.errorMessage) {
            showNotification(res.data.errorMessage, "danger");
          } else {
            showNotification(res.data.message, "success");
            setTimeout(function () {
              window.location.href = "/tree";
            }, 1000);
          }
        })
        .catch((error) => {
          showNotification(error, "danger");
        });
    };

    $scope.updateTree = () => {
      $scope.tree.city = $scope.city;
      $scope.tree.district = $scope.district;
      $scope.tree.ward = $scope.ward;
      apiService
        .updateTree($scope.id, $scope.tree)
        .then((res) => {
          if (res.data.errorMessage) {
            showNotification(res.data.errorMessage, "danger");
          } else {
            $scope.tree = res.data.tree;
            showNotification(res.data.message, "success");
          }
        })
        .catch((error) => {
          showNotification(error, "danger");
        });
    };

    $scope.uploadImageTree = () => {
      let formData = new FormData();
      let file = $scope.treeImage;
      formData.append("image", file);
      apiService
        .uploadImageTree($scope.id, formData)
        .then((res) => {
          if (res.data.errorMessage) {
            showNotification(res.data.errorMessage, "danger");
          } else {
            $scope.tree = res.data.tree;
            showNotification(res.data.message, "success");
            $(".modal-header .close").click();
          }
        })
        .catch((error) => {
          showNotification(error, "danger");
        });
    };
  },
]);

let dateChange = () => {
  $("#notification-table").DataTable().destroy();
  initNotificationDatatable();
};

function initNotificationDatatable() {
  let options = {
    searchDelay: 500,
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
      url: "/api/v1/tree/" + $("#id").text() + "/notification",
      data: {
        startDate: new Date($("#startDate").val()).getTime(),
        endDate: new Date($("#endDate").val()).getTime(),
      },
      dataSrc: (response) => {
        return response.data.map((notification, i) => {
          return {
            id: ++i,
            image: generateATag(notification, "image"),
            name: generateATag(notification, "name"),
            status: generateATag(notification, "status"),
            createdTime: generateATag(notification, "createdTime"),
          };
        });
      },
    },
    columns: [
      { data: "id" },
      { data: "image" },
      { data: "name" },
      { data: "status" },
      { data: "createdTime" },
    ],
  };
  $("#notification-table").DataTable(options);
}

function generateATag(notification, property) {
  let data = notification[property];
  if (property === "createdTime") {
    data = parseInt(data);
    data = formatDate(data);
  } else if (property === "image") {
    data = '<img alt="imageTree" width="70" height="70" src="' + data + '"/>';
  }

  let result =
    '<a class="table-row-link" href="/notification/' +
      notification._id +
      '">' +
      data || "" + "</a>";
  return result;
}
