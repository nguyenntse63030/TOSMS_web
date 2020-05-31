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
                        avatar: generateATag(employee, 'avatar'),
                        id: generateATag(employee, 'id'),
                        fullname: generateATag(employee, 'fullname'),
                        role: generateATag(employee, 'role'),
                        address: generateATag(employee, 'address'),
                        status: generateATag(employee, 'status'),
                        createdTime: generateATag(employee, 'createdTime')
                    }
                })
            }
        },
        columns: [
            { data: 'avatar' },
            { data: 'id' },
            { data: 'fullname' },
            { data: 'role' },
            { data: 'address' },
            { data: 'status' },
            { data: 'createdTime' }
        ]
    }
    $('#employees-table').DataTable(options);
}])

function generateATag(employee, property) {
    let data = employee[property];
    if (property === 'createdTime') {
        data = formatDate(new Date());
    } else if (property === 'status') {
        data = data === true ? 'Kích hoạt' : "Vô hiệu";
    } else if (property === 'avatar') {
        data = '<img class="img-data-row" alt="avatar" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"/>'
    } else if (property === 'role') {
        data = data === 'org' ? 'Giám sát' : 'Công nhân'
    }
    let result = '<a class="table-row-link" href="/employee/' + employee.id + '">' + data + '</a>';
    return result
}