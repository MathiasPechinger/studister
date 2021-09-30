var app_fireBase = {};
(function(){
  // Your web app's Firebase configuration
  const config = {
    apiKey: "AIzaSyDRNEQbVnhlmbimWlWkmOi_WcW-EP1Bk8c",
    authDomain: "studister-4b944.firebaseapp.com",
    databaseURL: "https://studister-4b944-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "studister-4b944",
    storageBucket: "studister-4b944.appspot.com",
    messagingSenderId: "873374776677",
    appId: "1:873374776677:web:fba4eec6d6507d0af4758c"
  };

  app_fireBase = firebase.initializeApp(config);
  
  const db = app_fireBase.database();
  function fnCreate(path, body, callBack){
    if(!path || !body) return;
    db.ref(path).set(body, callBack);
  }

  function fnUpdate(path, body, callBack){
    if(!path || !body) return;
    db.ref(path).update(body, callBack);
  }

  function fnListen(path, callBack){
    if(!path || !callBack) return;

    var listen = db.ref(path);
    listen.on('value', function(snapshot) {
      callBack(snapshot.val());
    });
  }

  function fnGet(path, successCallback, errorCallBack){
    if(!path || !successCallback || !errorCallBack) return;
    
    db.ref(path).once('value').then(successCallback, errorCallBack)
  }

  app_fireBase.databaseApi = {
    create: fnCreate,
    update: fnUpdate,
    get: fnGet,
    listen: fnListen
  }

})()

