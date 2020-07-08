var app = angular.module('TOSMS')
app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.notificationId = $('#notificationId').text().trim();
    apiService.getDetailNotification($scope.notificationId).then((res) => {
        $scope.notification = res.data.notification;
    }).catch((err) => {
        console.log(err);
    });

    apiService.getListWorker().then(res => {
        $scope.workers = res.data.users

    }).catch(err => {
        console.log(err)
    })

    $scope.showModal = () => {
        $('#setWorker').modal('show')
    }

    $scope.active = ($event, worker) => {
        $event.currentTarget.className = $event.currentTarget.className + ' active';
        $scope.workerId = worker._id
    }

    $scope.setWorkerToNoti = () => {
        apiService.setWorkerToNoti($scope.workerId, $scope.notificationId).then(res => {
            if (res.data.status !== 200) {
                showNotification(res.data.errorMessage, "danger");
            } else {
                $scope.notification = res.data.notification
                $('#setWorker').modal('hide')
                showNotification(res.data.message, "success");
               
            }
        }).catch(err => {
            showNotification(err, "danger");
        })
    }
}])
