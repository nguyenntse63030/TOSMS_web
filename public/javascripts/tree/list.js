
app.controller('listController', ['$scope', 'apiService', function ($scope, apiService) {
    let options = {
        language: {
            decimal: '.',
            thousands: ',',
            url: '//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json'
        },
        ajax: {
            url: '/javascripts/tree/list.json',
            dataSrc: (response) => {
               return response.map((tree) => {
                    return {
                        id: generateATag(tree, 'id'),
                        img: generateATag(tree, 'img'),
                        location: generateATag(tree, 'location'),
                        status: generateATag(tree, 'status'),
                        createdTime: generateATag(tree, 'createdTime'),
                    }
               })
            }
        },
        columns: [
            { data: 'id' },
            { data: 'img' },
            { data: 'location' },
            { data: 'status' },
            { data: 'createdTime' },
        ]
    }
    $('#tree-table').DataTable(options);
    $scope.city = 1
  
    apiService.getListCities().then(res => {
        $scope.cities = res.data.cities
        $scope.getListDistrict()
    }).catch(err => {
        console.log(err)
    })

    $scope.getListDistrict = () => {
        apiService.getListDistrict($scope.city).then(res => {
            $scope.districts = res.data.districts
            $scope.district = $scope.districts[0].id;
            $scope.getListWard();
        })
    }
  
    $scope.getListWard = () => {
        apiService.getListWard($scope.district).then(res => {
            $scope.wards = res.data.wards
            $scope.ward = $scope.wards[0].id;
        })
    }
}])

function createTree() {
    let formData = new FormData();
    let file = $('#file')[0].files[0];
    let treeType = $('#treeType').val();
    let city = $('#city').val().slice($('#city').val().indexOf(':') + 1);
    let district = $('#city').val().slice($('#city').val().indexOf(':') + 1);
    let ward = $('#ward').val().slice($('#city').val().indexOf(':') + 1);
    let street = $('#street').val();
    let longtitude = $('#longtitude').val();
    let latitude = $('#latitude').val();

    let check = validateCreateTree(file, treeType, city, district, ward, street);

    if (check) {
        formData.append("image", file)
        formData.append("treeType", treeType)
        formData.append("city", city)
        formData.append("district", district)
        formData.append("ward", ward)
        formData.append("street", street)
        formData.append("longtitude", longtitude)
        formData.append("latitude", latitude)

        $.ajax({
            url: '/api/v1/tree',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                document.getElementById('create-tree').reset();
                $('.modal-header .close').click();
                !response.message ? showNotification(response.errorMessage, 'warning') : showNotification(response.message, 'success');
            }
        })
    }
}

$('#createTreeBtn').on('click', function() {createTree()})

function generateATag(tree, property) {
    let data = tree[property]
    if (property === 'createdTime') {
        data = parseInt(data)
        data = formatDate(data)
    } else if (property === 'img') {
        return '<a class="table-row-link" href="/tree/' + tree.id + '"><img class="img-data-row" alt="treeImg" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbQa3ZRo97YeHzyY7kBJPtS2nQx0u5dcMjD8rm2yLphWgWE3ci&usqp=CAU"/></a>'
    } 

    let result = '<a class="table-row-link" href="/tree/' + tree.id + '">' + data + '</a>'
    return result
}