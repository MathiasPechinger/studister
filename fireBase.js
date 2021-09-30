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

  firebase.initializeApp(config);

  app_fireBase = firebase;
  
  function fnCreate(path, body, callBack){
    if(!path || !body) return;
    app_fireBase.database().ref(path).set(body, callBack);
  }

  function fnUpdate(path, body, callBack){
    if(!path || !body) return;
    app_fireBase.database().ref(path).update(body, callBack);
  }

  function fnListen(path, callBack){
    if(!path || !callBack) return;

    var listen = app_fireBase.database().ref(path);
    listen.on('value', function(snapshot) {
      callBack(snapshot.val());
    });
  }

  function fnGet(path, successCallback, errorCallBack){
    if(!path || !successCallback || !errorCallBack) return;
    
    app_fireBase.database().ref(path).once('value').then(successCallback, errorCallBack)
  }

  app_fireBase.databaseApi = {
    create: fnCreate,
    update: fnUpdate,
    get: fnGet,
    listen: fnListen
  }

})()

