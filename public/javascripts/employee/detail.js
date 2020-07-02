app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.id = $('#code').text();
    $scope.isNotEditing = true;
    $scope.employee = {};

    apiService.getProfileEmployee($scope.id).then((res) => {
        $scope.employee = res.data.user;
    }).catch((error) => {
        console.log(error);
        showNotification('Co loi!', 'danger');
    })

    $scope.deleteEmployee = () => {
        try {
            throw 'xoa that bai';
        } catch (error) {
            showNotification(error, 'danger');
        }
    }

    $scope.updateEmployee = () => {
        try {
            throw 'chinh sua that bai';
        } catch (error) {
            showNotification(error, 'danger');
        }
    }
}])