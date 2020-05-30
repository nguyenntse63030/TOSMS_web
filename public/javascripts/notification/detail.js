var app = angular.module('TOSMS')
app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.treeID = $('#treeID').text().trim()
    $scope.notification = {
        createdTime: 1590831567000,
        treeID: 'T001',
        content: 'Cây bình thường',
        priority: 'Không quan trọng',
        status: 'Không cần xử lý',
    }
}])
