
app.controller('listController', ['$scope', 'apiService', function ($scope, apiService) {
    initDatatale()
    $scope.getListTree = () => {
        apiService.getListTree().then(response => {
            $scope.trees = response.data.data
            if (!$scope.trees.length) {
                return showNotification('Hiện tại bạn chưa tạo cây để theo dõi', 'warning')
            }
        }).catch(err => {
            showNotification(err, 'warning')
        })
    }
}])
function initDatatale() {
    let options = {
        processing: true,
        serverSide: true,
        language: {
            decimal: '.',
            thousands: ',',
            url: '//cdn.datatables.net/plug-ins/1.10.19/i18n/Vietnamese.json'
        },
        search: {
            caseInsensitive: true
        },
        ajax: {
            url: '/api/v1/camera',
            dataSrc: (response) => {
                return response.data.map((camera, i) => {
                    return {
                        id: ++i,
                        code: generateATag(camera, 'code'),
                        ipAddress: generateATag(camera, 'ipAddress'),
                        status: generateATag(camera, 'status'),
                        createdTime: generateATag(camera, 'createdTime'),
                    }
                })
            }
        },
        columns: [
            { data: 'id' },
            { data: 'code' },
            { data: 'ipAddress' },
            { data: 'status' },
            { data: 'createdTime' },
        ]
    }
    $('#camera-table').DataTable(options);
}


// $(document).ready(function () {
//     $('.select-2').select2();
// });

function createCamera() {
    let formData = new FormData();
    let file = $('#file')[0].files[0];
    let cameraType = $('#cameraType').val();
    let ip = $('#ip').val();
    let treeId = $('#treeId').val();
    let code = $('#code').val();

    let check = validateCamera(file, code, ip)

    if (check) {
        formData.append("image", file)
        formData.append("code", code)
        formData.append("cameraType", cameraType)
        formData.append("ipAddress", ip)
        formData.append("tree", treeId)

        $.ajax({
            url: '/api/v1/camera',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (!response.message) {
                    return showNotification(response.errorMessage, 'warning');
                }
                else {
                    showNotification(response.message, 'success');
                    $('#camera-table').DataTable().destroy();
                    initDatatale();
                    document.getElementById('create-camera').reset();
                    $('.modal-header .close').click();
                }
            }
        })
    }
}

function validateCamera(file, code, ip) {
    let check = true;
    if (!file) {
        check = false;
        return showNotification('Bạn phải chọn ảnh trước khi tạo.', 'warning');
    }

    if (!code) {
        check = false;
        return showNotification('Camera code không thể bỏ trống.', 'warning');
    }

    if (!ip) {
        check = false;
        return showNotification('Camera IP không được bỏ trống.', 'warning');
    }
    return check;
}

$('#createCameraBtn').on('click', function () { createCamera() })

function generateATag(camera, property) {
    let data = camera[property]
    if (property === 'createdTime') {
        data = parseInt(data)
        data = formatDate(data)
    }

    let result = '<a class="table-row-link" href="/camera/' + camera._id + '">' + data + '</a>'
    return result
}