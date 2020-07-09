const apiVersion = "/api/v1";
angular.module("TOSMS").factory("apiService", [
  "$http",
  function ($http) {
    return {
      getListEmployee: () => {
        return $http.get(apiVersion + "/employee/MOCK_DATA.json");
      },
      getProfileEmployee: (id) => {
        return $http.get(apiVersion + "/user/" + id);
      },
      uploadAvataEmployee: (id, data) => {
        return $http({
          url: apiVersion + "/user/" + id + "/image",
          method: "PUT",
          data: data,
          headers: { "Content-Type": undefined },
        });
      },
      getListWorker: () => {
        return $http.get(apiVersion + "/user/worker")
      },
      updateEmployee: (id, data) => {
        return $http.put(apiVersion + "/user/" + id, data);
      },
      deleteEmployee: (id) => {
        return $http.delete(apiVersion + "/user/" + id);
      },
      getListTree: () => {
        return $http.get(apiVersion + "/tree");
      },
      updateTree: (id, data) => {
        return $http.put(apiVersion + "/tree/" + id, data);
      },
      uploadImageTree: (id, data) => {
        return $http({
          url: apiVersion + "/tree/" + id + "/image",
          method: "PUT",
          data: data,
          headers: { "Content-Type": undefined },
        });
      },
      deleteTree: (id) => {
        return $http.delete(apiVersion + "/tree/" + id);
      },
      getDetailTree: (id) => {
        return $http.get(apiVersion + "/tree/" + id);
      },
      getListCamera: () => {
        return $http.get(apiVersion + "/camera");
      },
      updateCamera: (id, data) => {
        return $http.put(apiVersion + "/camera/" + id, data);
      },
      deleteCamera: (id) => {
        return $http.delete(apiVersion + "/camera/" + id);
      },
      getDetailCamera: (id) => {
        return $http.get(apiVersion + "/camera/" + id);
      },
      getCameraStream: (id) => {
        return $http.get(apiVersion + '/camera/stream/' + id)
      },
      uploadImageCamera: (id, data) => {
        return $http({
          url: apiVersion + "/camera/" + id + "/image",
          method: "PUT",
          data: data,
          headers: { "Content-Type": undefined },
        });
      },

      getDetailNotification: (id) => {
        return $http.get(apiVersion + "/notification/" + id);
      },
      setWorkerToNoti: (workerId, id) => {
        return $http.put(apiVersion + "/notification/" + id + "/worker", {workerId})
      },
      getListCities: () => {
        return $http.get(apiVersion + "/location/city");
      },
      getListDistrict: (cityId) => {
        return $http.get(apiVersion + "/location/city/" + cityId);
      },
      getListWard: (districtId) => {
        return $http.get(apiVersion + "/location/district/" + districtId);
      },
      setNotiStatusSuccess: (id) => {
        return $http.put(apiVersion + "/notification/" + id + "/status")
      }
    };
  },
]);
