app.controller('listController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.listEmployees = [];
    // $scope.listEmployees = await apiService.getListEmployee();
    let options = {
        language: {
            lengthMenu: "Hiển thị _MENU_ dòng mỗi trang",
            zeroRecords: "Không có dữ liệu - xin lỗi",
            info: "Hiển thị _PAGE_ của _PAGES_",
            infoEmpty: "Không có dữ liệu phù hợp",
            infoFiltered: "(Lọc từ _MAX_ tổng bản ghi)"
        },
        ajax: {
            url: '/javascripts/employee/MOCK_DATA.json',
            dataSrc: (response) => {
               return response.map((employee) => {
                    return {
                        createdTime: generateATag(employee, 'createdTime'),
                        id: generateATag(employee, 'id'),
                        fullname: generateATag(employee, 'fullname'),
                        role: generateATag(employee, 'role'),
                        address: generateATag(employee, 'address'),
                        status: generateATag(employee, 'status'),
                    }
               })
            }
        },
        columns: [
            { data: 'createdTime' },
            { data: 'id' },
            { data: 'fullname' },
            { data: 'role' },
            { data: 'address' },
            { data: 'status' },
        ]
    }
    $('#employees-table').DataTable(options);
}])

function generateATag(employee, property) {
    let data = employee[property]
    if (property === 'createdTime') {
        data = formatDate(data)
    } 
    let result = '<a class="table-row-link" href="/employee/' + employee.id + '">' + data + '</a>'
    return result
}