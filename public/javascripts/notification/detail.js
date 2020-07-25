var app = angular.module('TOSMS')
app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.notificationId = $('#notificationId').text().trim();
    $scope.user = JSON.parse(COMMON.getCookie('user'))
    apiService.getDetailNotification($scope.notificationId).then((res) => {
        $scope.notification = res.data.notification;
    }).catch((err) => {
        console.log(err);
        showNotification(err.data.errorMessage || err.statusText, 'danger');
        setTimeout(function () {
            location.href = "/notification";
        }, 1000);
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
        $('.active').removeClass()
        $event.currentTarget.className = $event.currentTarget.className + ' active';
        $scope.workerId = worker._id;
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


    $scope.setNotiStatusSuccess = () => {
        apiService.setNotiStatusSuccess($scope.notificationId).then((res) => {
            if (res.data.errorMessage) {
                console.log(res)
                showNotification(res.data.errorMessage, "danger");
            } else {
                $scope.notification = res.data.notification
                $('#confirm-success').modal('hide')
                showNotification(res.data.message, "success");
            }
        })
            .catch((error) => {
                showNotification(error.data.errorMessage, "danger");
            });
    }

    $scope.linkToTree = () => {
        window.open('/tree/' + $scope.notification.tree._id, '_blank')
    }

    $scope.linkToWorker = () => {
        window.open('/employee/' + $scope.notification.worker._id, '_blank')
    }
}])
