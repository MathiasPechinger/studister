var app_fireBase = {};
(function(){
  // Import the functions you need from the SDKs you need
  // import { initializeApp } from "firebase/app";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const config = {
    apiKey: "AIzaSyDRNEQbVnhlmbimWlWkmOi_WcW-EP1Bk8c",
    authDomain: "studister-4b944.firebaseapp.com",
    projectId: "studister-4b944",
    storageBucket: "studister-4b944.appspot.com",
    messagingSenderId: "873374776677",
    appId: "1:873374776677:web:fba4eec6d6507d0af4758c"
  };

  // Initialize Firebase
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