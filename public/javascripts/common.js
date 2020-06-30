const COMMON = {
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date()
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
        var expires = 'expires=' + d.toUTCString()
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
    },
    getCookie: function (cname) {
        var name = cname + '='
        var decodedCookie = decodeURIComponent(document.cookie)
        var ca = decodedCookie.split(';')
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ''
    }
}

function showNotification(message, type) { // type: ['success', 'danger']
    $.notify({
        icon: type === 'success' ? 'check' : 'close',
        message: message
    }, {
        type: type,
        z_index: 2000,
        timer: 4000,
        placement: {
            from: 'top',
            align: 'right'
        }
    })
}

function showModalChangeAvatar() {
    $('#modal-change-avatar').modal('show')
}

function getTimestampFromDatePicker(selector) {
    var str = $(selector).datepicker({ dateFormat: 'dd/mm/yy' }).val()
    str = str.split('/')
    var year = parseInt(str[2])
    var month = parseInt(str[1]) - 1
    var day = parseInt(str[0])
    return new Date(year, month, day).getTime()
}

function getTimestampFromDatePickerMonth(selector) {
    var str = $(selector).datepicker({ dateFormat: 'mm/yy' }).val()
    str = str.split('/')
    var year = parseInt(str[1])
    var month = parseInt(str[0]) - 1
    return new Date(year, month, 1, 0, 0, 0).getTime()
}

function numberFormat() {
    (function ($, undefined) {
        'use strict'
        $(function () {
            $('.numberInput').on('keyup', function (event) {
                var $this = $(this)
                var input = $this.val()
                var input = input.replace(/[\D\s\._\-]+/g, '')
                $this.val(function () {
                    return input.toLocaleString('en-US')
                })
            })
        })
    })(jQuery)
}

function currencyFormat() {
    (function ($, undefined) {
        'use strict'

        // When ready.
        $(function () {
            $('.currencyInput').on('keyup', function (event) {
                // When user select text in the document, also abort.
                var selection = window.getSelection().toString()
                if (selection !== '') {
                    return
                }

                // When the arrow keys are pressed, abort.
                if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
                    return
                }

                var $this = $(this)

                // Get the value.
                var input = $this.val()

                input = input.replace(/[^0-9-]/g, '').replace(/(?!^)-/g, '') // https://stackoverflow.com/a/43670484
                if (!input) {
                    return $this.val('')
                }
                input = isNaN(input) ? input : parseInt(input, 10)
                $this.val(function () {
                    return input.toLocaleString('en-US')
                })
            })

            /**
               * ==================================
               * When Form Submitted
               * ==================================
               */
            $('form').on('submit', function (event) {
                var $this = $(this)
                var arr = $this.serializeArray()

                for (var i = 0; i < arr.length; i++) {
                    arr[i].value = arr[i].value.replace(/[($)\s\._\-]+/g, '') // Sanitize the values.
                };

                event.preventDefault()
            })
        })
    })(jQuery)
}

function change_alias(str) {
    if (!str) return ''
    str = str.toLowerCase().trim()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    return str
}

function parseNumberToMoney(number) {
    if (!number) return 0
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function parseMoneyToNumber(money) {
    if (!money) return 0
    return parseInt(money.toString().replace(/,/g, ''))
}

function formatDate(date) {
    now = new Date(date);
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
}

function validateCreateTree(file, treeType, city, district, ward, street) {
    let check = true;
    if (!file) {
        check = false;
        return showNotification('Bạn phải chọn ảnh trước khi tạo.', 'warning');
    }
    if (!treeType) {
        check = false;
        return showNotification('Loại cây không thể bỏ trống.', 'warning');
    }
    if (!street) {
        check = false;
        return showNotification('Tên đường không thể bỏ trống.', 'warning');
    }
    return check;
}
