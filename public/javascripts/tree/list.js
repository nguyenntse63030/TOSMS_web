app.controller("listController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.user = JSON.parse(COMMON.getCookie("user"));
    let change = false;
    if ($scope.user.role === COMMON.userRoles.MANAGER) {
      $scope.district = $scope.user.district;
      change = true;
    } 
    let initDatatale = () => {
      let options = {
        processing: true,
        serverSide: true,
        language: {
          decimal: ".",
          thousands: ",",
          url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json",
        },
        order: [
          [4, "desc"],
        ],
        search: {
          caseInsensitive: true,
        },
        ajax: {
          url: "/api/v1/tree",
          dataSrc: (response) => {
            return response.data.map((tree, i) => {
              return {
                id: ++i,
                location: generateATag(tree, "location"),
                code: generateATag(tree, "code"),
                note: generateATag(tree, "note"),
                createdTime: generateATag(tree, "createdTime"),
              };
            });
          },
        },
        columns: [
          { data: "id", name: "id", orderable: false },
          { data: "location", name: "location" },
          { data: "code", name: "code" },
          { data: "note", name: "note" },
          { data: "createdTime", name: "createdTime" },
        ],
      };
      $("#tree-table").DataTable(options);
      loadLocation($scope, apiService, change);
      $scope.getListCities();
    };

    initDatatale();
    function createTree() {
      let formData = new FormData();
      let file = $("#file")[0].files[0];
      let treeType = $("#treeType").val();
      let city = $("#city").val();
      let district = $("#district").val();
      let ward = $("#ward").val();
      let street = $("#street").val();
      let code = $("#code").val();
      let longtitude = $("#longitude").val();
      let latitude = $("#latitude").val();

      let check = validateCreateTree(
        file,
        treeType,
        longtitude,
        latitude,
        street,
        code
      );

      if (check) {
        formData.append("image", file);
        formData.append("treeType", treeType);
        formData.append("city", city);
        formData.append("district", district);
        formData.append("ward", ward);
        formData.append("street", street);
        formData.append("code", code);
        formData.append("longitude", longtitude);
        formData.append("latitude", latitude);

        $.ajax({
          url: "/api/v1/tree",
          method: "POST",
          data: formData,
          contentType: false,
          processData: false,
          success: function (response) {
            if (response.message) {
              document.getElementById("create-tree").reset();
              $(".modal-header .close").click();
              $("#tree-table").DataTable().destroy();
              initDatatale();
              showNotification(response.message, "success");
            } else {
              showNotification(response.errorMessage, "danger");
            }
          },
          error: function (error) {
            console.log(error);
            showNotification(error.responseJSON.errorMessage, "danger");
          },
        });
      }
    }

    $("#createTreeBtn").on("click", function () {
      createTree();
    });
  },
]);
function validateCreateTree(
  file,
  treeType,
  longtitude,
  latitude,
  street,
  code
) {
  let check = true;
  if (!file) {
    check = false;
    return showNotification("Bạn phải chọn ảnh trước khi tạo.", "danger");
  }
  if (!treeType) {
    check = false;
    return showNotification("Loại Cây không thể bỏ trống.", "danger");
  }
  if (!latitude) {
    check = false;
    return showNotification("Vĩ độ không được bỏ trống.", "danger");
  }
  if (!longtitude) {
    check = false;
    return showNotification("Kinh độ không được bỏ trống.", "danger");
  }
  if (!street) {
    check = false;
    return showNotification("Tên đường không được bỏ trống.", "danger");
  }
  if (!code) {
    check = false;
    return showNotification("Code không được bỏ trống.", "danger");
  }
  return check;
}

function generateATag(tree, property) {
  let data = tree[property];
  if (property === "createdTime") {
    data = parseInt(data);
    data = formatDate(data);
  } else if (property === "location") {
    data =
      tree.street +
      " - " +
      tree.ward.name +
      " - " +
      tree.district.name +
      " - " +
      tree.city.name;
  }

  let result =
    '<a class="table-row-link" href="/tree/' + tree._id + '">' + data ||
    "" + "</a>";
  return result;
}
