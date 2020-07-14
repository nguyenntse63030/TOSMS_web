
const firebaseConfig = {
  apiKey: "AIzaSyB7EPFR3o1xXSyye7neNRao6j68dVeVpbY",
  authDomain: "tosms-web.firebaseapp.com",
  databaseURL: "https://tosms-web.firebaseio.com",
  projectId: "tosms-web",
  storageBucket: "tosms-web.appspot.com",
  messagingSenderId: "215697346340",
  appId: "1:215697346340:web:3fd5c13f24fb2475ec2db1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// khởi tạo hằng số
const firestore = firebase.firestore();
const COUNT_NUMBER_ELEMENT = $('#count-number');
const COLLECTION_NAME = "manager";
const LIST_NOTIES = $('#list-noti')
const CONTAINER_LIST_NOTI = $('#container-list-noti');

var check = 0; //biến hỗ trợ kiểm tra nếu > 0 thì mới gọi ajax để chỉnh sửa noti thành readed
var limit = 25;//biến giới hạn số noti được query mỗi lần
var skip; //object làm flag cho mỗi lần query mỗi lần query firestore sẽ dùng để biết query từ vị trí nào
let count = 0; //biến đếm số lượng noti chưa được đọc
let the_first = true; //lần đầu load page mục đích để hàm load noti realtime ko thực hiện add lại các element vì hàm này lần đầu vào vấn chạy
let scrollY = 1335; //biến cờ scroll mục đích nếu cuộn dọc lớn hơn thì thực hiện query tiếp

// hàm load dữ liệu từ firestore với realtime khi có thay đổi
function loadNotificationFromFirestore() {
  firestore.collection('manager').orderBy("createdTime", "desc").onSnapshot(function (querySnapshot) {
    querySnapshot.docChanges().forEach(function (change) {
      if (!the_first) {
        if (change.type === 'added') {
          let notification = change.doc.data();
          createNotiElement(notification, true)
          count += 1;
          showCountNumber(count)
        }
      }
      if (change.type === 'modified') {
        count = 0;
        showCountNumber(count)
      }
    })
    check = count
    the_first = false;
  })
} //kết thúc hàm

loadNotificationFromFirestore()

let loadNotifications = (sk) => {
  let queryConfig;
  // nếu có sk thì mới thực hiện query starAfter vì lần đầu query không có object để thực hiện sẻ bị lỗi
  if (sk) {
    queryConfig = firestore.collection(COLLECTION_NAME).orderBy("createdTime", "desc").startAfter(sk).limit(limit);
  } else {
    queryConfig = firestore.collection(COLLECTION_NAME).orderBy("createdTime", "desc").limit(limit);
  }
  //thực hiện query
  queryConfig.get().then(function (querySnapshot) {
    if (querySnapshot.docs.length) {
     
      querySnapshot.docs.map((doc, i) => {
        let notification = doc.data();
        //tạo noti element
        createNotiElement(notification);
        /* với mỗi noti mới đến chưa được đọc (readed=false) thì sẽ
        cộng vào count để hiên thị số lượng noti chưa được đọc cho người dùng */
        if (notification.readed === false) {
          count += 1;
        }
      })
      showCountNumber(count);
      //mục đích gán check để nhận biết biến count > 0 thì mới gọi hàm ajax update readed = true
      check = count
      skip = querySnapshot.docs[querySnapshot.docs.length - 1];

      hideLoading();
    } else{
      showCountNumber(0);
      hideLoading();
    }

  })
}

//hàm hiển thị khi count > 0 có nghĩa là có noti chưa được đọc hoặc 
//ẩn khi count = 0 có nghĩa không có noti nào chưa đọc
let showCountNumber = (count) => {
  if (count > 0) {
    COUNT_NUMBER_ELEMENT.text(count)
    COUNT_NUMBER_ELEMENT.css('display', 'block')
  } else {
    COUNT_NUMBER_ELEMENT.css('display', 'none')
  }
}

LIST_NOTIES.scroll(function () { 
  if (LIST_NOTIES.scrollTop() >= scrollY) {
    showLoading()
    loadNotifications(skip)
    scrollY = 2 * scrollY
  }
})

let createNotiElement = (notification, appendBefore) => {
  let timestamp = notification.createdTime.seconds*1000;
  let date = formatDate(new Date(timestamp)); 

  let notiElement = '<div class="row menu-item" onclick="visitLink(\'' + notification.link + '\')"><div class="col-3 align-self-center"><div class="card card-body"><img src="' + notification.icon + '"/></div></div><div class="col-9"><div class="card text-noti-content"><div class="card-body"><h5 class="card-title">' + notification.title + '</h5>' + '<p class="card-text mt-1">' + notification.body + '</p></div><p class="card-body my-1">' + date + '</p></div></div></div>';
  if (!appendBefore) {
    LIST_NOTIES.append(notiElement);
  } else {
    $(notiElement).prependTo(LIST_NOTIES);
  }
}

$('.container-noti').click(() => {
  if (check > 0) {
    $.ajax({
      url: '/api/v1/notification/',
      method: 'PUT'
    })
  }
})

let visitLink = (link) => {
  window.location.href = link;
}

let showLoading = () => {
  $('#loading-noti').addClass("loading");
}

let hideLoading = () => {
  $('#loading-noti').removeClass("loading");
}
