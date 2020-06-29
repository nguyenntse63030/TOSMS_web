
const firebaseConfig = {
    apiKey: "AIzaSyB7EPFR3o1xXSyye7neNRao6j68dVeVpbY",
    authDomain: "tosms-web.firebaseapp.com",
    databaseURL: "https://tosms-web.firebaseio.com",
    projectId: "tosms-web",
    storageBucket: "tosms-web.appspot.com",
    messagingSenderId: "215697346340",
    appId: "1:215697346340:web:3fd5c13f24fb2475ec2db1"
};

// // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

firestore.collection("manager").orderBy("createdTime").limit(10).get().then(function (querySnapshot) {
    let count = 0;
    querySnapshot.docs.map((doc) => {
        let notification = doc.data();
        createNotiElement(notification);
        if (notification.readed === false) {
            count += 1;
        }
    })
    if (count > 0) {
        $('#count-number').text(count)
        $('#count-number').css('display', 'block')
    } else {
        $('#count-number').css('display', 'none')
    }
})


firestore.collection("manager").onSnapshot(function (querySnapshot) {
    let count = 0;
    querySnapshot.docs.map((doc) => {
        let notification = doc.data();
        if (notification.readed === false) {
            count += 1;
        }
    })
    if (count > 0) {
        $('#count-number').text(count)
        $('#count-number').css('display', 'block')
    } else {
        $('#count-number').css('display', 'none')
    }
})

let createNotiElement = (notification) => {
    $('#list-noti').append('<div class="menu-item"><a onclick="visitLink(\'' + notification.link + '\')">'
        + '<img src="' + notification.icon + '"/>'
        + '<span class="content-noti">'
        + '<p class="title">' + notification.title + '</p>'
        + '<p class="content">' + notification.body + '</p>'
        + '</span>'
        + '</a><div>')
}

$('.container-noti').click(() => {
    $.ajax({
        url: '/api/v1/notification/',
        method: 'PUT'
    })
})

let visitLink = (link,) => {
    window.location.href = link;
}
