const apiVersion = '/api/v1/'
angular.module('TOSMS').factory('apiService', ['$http', function ($http) {
    return {
        getListEmployee: () => {
            return $http.get(apiVersion + '/employee/MOCK_DATA.json');
        },
        getProfileEmployee: (id) => {
            return $http.get(apiVersion + '/employee/detailEmp.json');
        },
        getDetailTree: (id) => {
            return $http.get(apiVersion + '/tree/detail.json');
        },
        getDetailNotification: (id) => {
            return $http.get(apiVersion + 'notification/' + id);
        }
    }
}])
