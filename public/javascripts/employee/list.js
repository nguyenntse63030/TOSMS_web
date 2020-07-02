var app = angular.module("TOSMS");
app.controller("listController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.listEmployees = [];
    // $scope.listEmployees = await apiService.getListEmployee();
    let options = {
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
        url: "/api/v1/user",
        dataSrc: (response) => {
          return response.data.map((employee, i) => {
            return {
              avatar: generateATag(employee, "avatar"),
              id: ++i,
              fullname: generateATag(employee, "name"),
              role: generateATag(employee, "role"),
              address: generateATag(employee, "address"),
              status: generateATag(employee, "status"),
              createdTime: generateATag(employee, "createdTime"),
            };
          });
        },
      },
      columns: [
        { data: "avatar" },
        { data: "id" },
        { data: "fullname" },
        { data: "role" },
        { data: "address" },
        { data: "status" },
        { data: "createdTime" },
      ],
    };
    $("#employees-table").DataTable(options);
  },
]);

function generateATag(employee, property) {
  let data = employee[property];
  if (property === "createdTime") {
    data = parseInt(data);
    data = formatDate(data);
  } else if (property === "status") {
    data = data === true ? "Kích hoạt" : "Vô hiệu";
  } else if (property === "avatar") {
    data =
      '<img class="img-data-row" alt="avatar" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"/>';
  } else if (property === "role") {
    data = data === "org" ? "Giám sát" : "Công nhân";
  }
  let result =
    '<a class="table-row-link" href="/employee/' +
    employee._id +
    '">' +
    data +
    "</a>";
  return result;
}
