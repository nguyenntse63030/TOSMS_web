const apiVersion = '/api/v1'
angular.module('TOSMS').factory('apiService', ['$http', function ($http) {
    return {
        getListEmployee: () => {
            return $http.get(apiVersion + '/employee/MOCK_DATA.json');
        },
        getProfileEmployee: (id) => {
            return $http.get(apiVersion + '/employee/detailEmp.json');
        },
        getListTree: () => {
            return $http.get(apiVersion + '/tree');
        },
        getDetailTree: (id) => {
            return $http.get(apiVersion + '/tree/' + id);
        },
        updateTree: (id, data) => {
            return $http.put(apiVersion + '/tree/' + id, data)
        },
        getDetailNotification: (id) => {
            return $http.get(apiVersion + '/notification/' + id);
        },
        getListCities: () => {
            return $http.get(apiVersion + '/location/city');
        },
        getListDistrict: (cityId) => {
            return $http.get(apiVersion + '/location/city/' + cityId);
        },
        getListWard: (districtId) => {
            return $http.get(apiVersion + '/location/district/' + districtId)
        }
    }
}])
