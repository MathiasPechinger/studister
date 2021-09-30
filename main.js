var mainApp = {};
var lastPredictID = null;
(function(){
    app_fireBase.auth().onAuthStateChanged(function(user) {
        if(user){
            //user signed in.
            uid = user.uid;
        }else{
            //redirect to login page
            uid = null;
            window.location.replace("login.html");
        }
    });

    function logOut(){
        app_fireBase.auth().signOut();
    }

    function messageHandler(err){
        if(!!err){
            console.log(err);
        }
    }
    var textField = document.getElementById("textOutput");
    var enableScanButton = document.getElementById("scanButton");
    enableScanButton.addEventListener("click", async () => {
        textField.innerHTML = ("Reading NFC");
        const dbRef = app_fireBase.database().ref();
        dbRef.child("users").get().then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            textField.innerHTML = ("> Scan started");
        
            ndef.addEventListener("readingerror", () => {
                textField.innerHTML = ("Argh! Cannot read data from the NFC tag. Try another one?");
            });
        
            ndef.addEventListener("reading", ({ _, serialNumber }) => {
                textField.innerHTML = (`> Serial Number: ${serialNumber}`);
                var path = 'scans/';
                var data = {serialNumber: `${serialNumber}`};
                app_fireBase.databaseApi.update(path, data, messageHandler);
            });
        } catch (error) {
            textField.innerHTML = ("Argh! " + error);
        }
      }
    );

    
    var updatePlasticIcon = function(id, text) {

        if(id == 0){
            hidePlasticIcon();
            document.getElementById("plasticText").style.display = 'block';
            document.getElementById("loaderCircle").style.display = 'none';
            var plasticText = document.getElementById("plasticText");
            plasticText.innerHTML = text;         
        } else {
            // html items of plastic Icon
            showPlasticIcon();
            var plasticText = document.getElementById("plasticText");
            var plasticNumber = document.getElementById("plasticNumber");
            plasticText.innerHTML = text;
            plasticNumber.innerHTML = id;
        }
        
    };
    
    function controlCallBack(value){
        if(!!value){
            if(value.measure == 'false' && value.predictID.name != lastPredictID){
                lastPredictID = value.predictID.name;
                var path = 'devices/your_device_id/detection/measurements/' + value.predictID.name;
                //attach listener to get informed about prediction upload
                app_fireBase.databaseApi.listen(path, dataUpdateCallback)
            }
        }
    }

    function dataUpdateCallback(value){
        if(!!value.PlasticID || value.PlasticID == 0){
            console.log(value);
            showPlasticIcon();
            updatePlasticIcon(value.PlasticID, value.PlasticType);
            document.getElementById("scan_button").disabled = false;
        }else{
            console.log('no PlasticID available');
        }
    }

    function hidePlasticIcon() {
        document.getElementById("plasticText").style.display = 'none';
        document.getElementById("plasticNumber").style.display = 'none';
        document.getElementById("recyclingIcon").style.display = 'none';
        document.getElementById("loaderCircle").style.display = 'block';
    }

    function showPlasticIcon() {
        document.getElementById("plasticText").style.display = 'block';
        document.getElementById("plasticNumber").style.display = 'block';
        document.getElementById("recyclingIcon").style.display = 'block';
        document.getElementById("loaderCircle").style.display = 'none';
    }
    mainApp.logOut = logOut;
})()