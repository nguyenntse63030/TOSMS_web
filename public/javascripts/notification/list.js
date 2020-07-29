var app = angular.module("TOSMS");
app.controller("listController", ["$scope", "apiService", function ($scope, apiService) {
  let findObj = {}
  let table
  let user = COMMON.getCookie('user')
  if (user) {
    $scope.user = JSON.parse(user)
    if ($scope.user.role !== COMMON.userRoles.ADMIN) {
      setTimeout(() => {
        $scope.selectedDistrict = $scope.user.district
        $scope.getWardByDistrict()
        $('#selectedDistrict').select2().next().hide()
      }, 100);
    }
  }


  apiService.getListDistrict('HCM').then(function (res) {
    $scope.districts = res.data.districts
  }).catch(function (error) {
    console.log(error)
    showNotification(errror.data.errorMessage, 'danger')
  })
  $scope.getWardByDistrict = () => {
    if ($scope.selectedDistrict) {
      apiService.getListWard($scope.selectedDistrict).then(function (res) {
        $scope.wards = res.data.wards
      }).catch(function (error) {
        console.log(error)
        showNotification(error.data.errorMessage, 'danger')
      })
    } else {
      $scope.wards = undefined
      $scope.selectedWard = ''
    }
  }
  $scope.generateFindObj = () => {
    findObj.district = $scope.selectedDistrict ? $scope.selectedDistrict : undefined
    findObj.ward = $scope.selectedWard ? $scope.selectedWard : undefined
    table.ajax.reload()
  }
  let createOption = (url) => {
    let options = {
      processing: true,
      serverSide: true,
      responsive: true,
      language: {
        decimal: ".",
        thousands: ",",
        url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json",
      },
      order: [
        [1, "desc"],
        [2, "desc"],
        [3, "desc"],
      ],
      search: {
        caseInsensitive: true,
      },
      ajax: {
        url: url,
        dataSrc: (response) => {
          return response.data.map((notification, i) => {
            return {
              id: ++i,
              name: generateATag(notification, "name"),
              status: generateATag(notification, "status"),
              createdTime: generateATag(notification, "createdTime"),
            };
          });
        },
        data: function (data) {
          data.find = findObj
          return data
        }
      },
      columns: [
        { data: "id", name: "id", orderable: false },
        { data: "name", name: "name" },
        { data: "status", name: "status" },
        { data: "createdTime", name: "createdTime" },
      ],
    };
    return options;
  };
  $scope.done = false;
  $scope.initNotificationTable = () => {
    $scope.done = false;
    $("#notification-table").DataTable().destroy();
    table = $("#notification-table").DataTable(createOption("/api/v1/notification"));
  };

  $scope.initNotificationTable();

  $scope.initTableDoneStatus = () => {
    $scope.done = true;
    $("#notification-table").DataTable().destroy();
    $("#notification-table").DataTable(
      createOption("/api/v1/notification/done")
    );
  };
},
]);

function generateATag(notification, property) {
  let data = notification[property];
  if (property === "createdTime") {
    data = parseInt(data);
    data = formatDate(data);
  } else if (property === "img") {
    return (
      '<a class="table-row-link" href="/notification/' +
      notification._id +
      '"><img class="img-data-row" alt="treeImg" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbQa3ZRo97YeHzyY7kBJPtS2nQx0u5dcMjD8rm2yLphWgWE3ci&usqp=CAU"/></a>'
    );
  }

  let result =
    '<a class="table-row-link" href="/notification/' +
    notification._id +
    '">' +
    data +
    "</a>";
  return result;
}
