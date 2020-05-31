app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.id = 0;
    $scope.isNotEditing = true;
    $scope.tree = {};

    apiService.getDetailTree($scope.id).then((res) => {
        $scope.tree = res.data;
    }).catch((error) => {
        console.log(error);
        showNotification('Co loi!', 'danger');
    })

    $scope.deleteTree = () => {
        try {
            throw 'xoa that bai';
        } catch (error) {
            showNotification(error, 'danger');
        }
    }

    $scope.updateTree = () => {
        try {
            throw 'chinh sua that bai';
        } catch (error) {
            showNotification(error, 'danger');
        }
    }

    $scope.notifications = [
        {
            createdTime: 1590831567000,
            code: '1',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbQa3ZRo97YeHzyY7kBJPtS2nQx0u5dcMjD8rm2yLphWgWE3ci&usqp=CAU',
            content: 'Cây bình thường',
            priority: 'Không quan trọng',
            status: 'Không cần xử lý',
        },
        {
            createdTime: 1590831800000,
            code: '2',
            img: 'https://i.stack.imgur.com/lLkEO.jpg',
            content: 'Nứt, Nghiêng, Gãy',
            priority: 'Nguy hiểm',
            status: 'Chưa xử lý',
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