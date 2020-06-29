var app = angular.module('TOSMS')
app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.notificationId = $('#notificationId').text().trim();
    apiService.getDetailNotification($scope.notificationId).then((res) => {
        $scope.notification = res.data.notification;
    }).catch((err) => {
        console.log(err);
    });
}])
