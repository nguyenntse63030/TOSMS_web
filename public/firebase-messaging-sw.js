importScripts("https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/7.15.1/firebase-messaging.js")
var firebaseConfig = {
    apiKey: "AIzaSyB7EPFR3o1xXSyye7neNRao6j68dVeVpbY",
    authDomain: "tosms-web.firebaseapp.com",
    databaseURL: "https://tosms-web.firebaseio.com",
    projectId: "tosms-web",
    storageBucket: "tosms-web.appspot.com",
    messagingSenderId: "215697346340",
    appId: "1:215697346340:web:3fd5c13f24fb2475ec2db1"
};

firebase.initializeApp(firebaseConfig)
const messagging = firebase.messaging();
self.addEventListener('notificationclick', function (event) {
      return clients.openWindow(event.notification.data.link);
})  
messagging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        data: {
            link: payload.data.action
        }
    };
    
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});


