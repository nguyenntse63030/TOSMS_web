/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */
function showRegisterForm() {
    $('.loginBox').fadeOut('fast', function() {
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast', function() {
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    });
    $('.error').removeClass('alert alert-danger').html('');

}

function showLoginForm() {
    $('#loginModal .registerBox').fadeOut('fast', function() {
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast', function() {
            $('.login-footer').fadeIn('fast');
        });

        $('.modal-title').html('Login with');
    });
    $('.error').removeClass('alert alert-danger').html('');
}

function openLoginModal() {
    showLoginForm();
    setTimeout(function() {
        $('#loginModal').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    }, 230);

}

function openRegisterModal() {
    showRegisterForm();
    setTimeout(function() {
        $('#loginModal').modal('show');
    }, 230);

}

function loginAjax() {
    var $form = $('form')
    var data = getFormData($form)
    $.ajax({
        url: '/api/v1/auth/sign_in',
        type: 'POST',
        data: data,
        complete: function(res) {
            if (res.status !== 200) {
                return shakeModal(res.responseJSON.errorMessage)
            } else {
                COMMON.setCookie('user', JSON.stringify(res.responseJSON.user))
                window.location.href = '/notification'
            }
        }
    })

    /*   Simulate error message from the server   */
    // shakeModal();
}

function shakeModal(text) {
    $('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html(text);
    $('input[type="password"]').val('');
    setTimeout(function() {
        $('#loginModal .modal-dialog').removeClass('shake');
    }, 1000);
}

function getFormData($form) {
    var unindexedArray = $form.serializeArray()
    var indexedArray = {}
    $.map(unindexedArray, function(n, i) {
        indexedArray[n['name']] = n['value'].trim()
    })
    return indexedArray
}