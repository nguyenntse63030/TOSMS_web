var app = angular.module('TOSMS')
app.controller('listController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.notifications = [
        {
            createdTime: 1590831567000,
            treeID: 'T001',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T002',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T002',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T003',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T004',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T005',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T006',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T007',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T008',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T009',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T010',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T011',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T012',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T013',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T014',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T015',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T016',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831567000,
            treeID: 'T017',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
    ]
    setTimeout(() => {
        initNotificationDatatable()
    }, 1000);
    function initNotificationDatatable() {
        notificationTable = $('#notification-table').DataTable({
            retrieve: true,
            aLengthMenu: [
                [10, 20, 50, -1],
                [10, 20, 50, 'Tất cả']
            ],
            iDisplayLength: 10,
            language: {
                decimal: '.',
                thousands: ',',
                url: '//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json'
            },
            search: {
                caseInsensitive: true
            },
            // aaSorting: [2, 'desc'],
            order: [0, 'desc'],
            columnDefs: [{
                // targets: [0],
                // sortable: false
            }],
            aaSorting: []
        })
    }

}])
