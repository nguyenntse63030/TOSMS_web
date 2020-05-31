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
}])

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