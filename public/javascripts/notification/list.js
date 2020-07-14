var app = angular.module("TOSMS");
app.controller("listController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
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
      $("#notification-table").DataTable(createOption("/api/v1/notification"));
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
