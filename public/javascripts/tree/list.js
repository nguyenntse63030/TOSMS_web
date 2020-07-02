
app.controller('listController', ['$scope', 'apiService', function ($scope, apiService) {
    let options = {
        processing: true,
        serverSide: true,
        language: {
            decimal: '.',
            thousands: ',',
            url: '//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json'
        },
        ajax: {
            url: '/api/v1/tree',
            dataSrc: (response) => {
               return response.data.map((tree, i) => {
                    return {
                        id: ++i,
                        location: generateATag(tree, 'location'),
                        note: generateATag(tree, 'note'),
                        createdTime: generateATag(tree, 'createdTime'),
                    }
               })
            }
        },
        columns: [
            { data: 'id' },
            { data: 'location' },
            { data: 'note' },
            { data: 'createdTime' },
        ]
    }
    $('#tree-table').DataTable(options);
    loadLocation($scope, apiService)
}])

function createTree() {
    let formData = new FormData();
    let file = $('#file')[0].files[0];
    let treeType = $('#treeType').val();
    let city = $('#city').val();
    let district = $('#district').val();
    let ward = $('#ward').val();
    let street = $('#street').val();
    let code = $('#code').val();
    let longtitude = $('#longitude').val();
    let latitude = $('#latitude').val();

    let check = validateCreateTree(file, treeType, street);

    if (check) {
        formData.append("image", file)
        formData.append("treeType", treeType)
        formData.append("city", city)
        formData.append("district", district)
        formData.append("ward", ward)
        formData.append("street", street)
        formData.append("code", code)
        formData.append("longitude", longtitude)
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
    } else if (property === 'location') {
        data = tree.street + ' - ' + tree.ward.name + ' - ' + tree.district.name + ' - ' + tree.city.name
    }

    let result = '<a class="table-row-link" href="/tree/' + tree._id + '">' + data || '' + '</a>'
    return result
}