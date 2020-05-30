const apiVersion = '/javascripts'
angular.module('TOSMS').factory('apiService', ['$http', function ($http) {
    return {
        getListEmployee: () => {
            return $http.get(apiVersion + '/employee/MOCK_DATA.json');
        },
        getProfileEmployee: (id) => {
            return $http.get(apiVersion + '/employee/detailEmp.json');
        }
    }
}])
