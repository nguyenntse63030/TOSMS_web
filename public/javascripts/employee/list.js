app.controller('listController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.listEmployees = [];
    // $scope.listEmployees = await apiService.getListEmployee();
    let options = {
        language: {
            decimal: '.',
            thousands: ',',
            url: '//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json'
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