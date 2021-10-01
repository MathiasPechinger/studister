var mainApp = {};
var lastPredictID = null;
(function(){
    let dbBase = app_fireBase.database();
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

    async function get_data(hash_key) {

        var user_ref = dbBase.ref('users/' + hash_key)
        let data;
        await user_ref.on('value', async function(snapshot) {
            data = snapshot.val();
            if(data == null){
                console.log("user doesn't exist")
                return new Promise(resolve => {
                    data = null;
                    resolve(data);
                });
            } else{
                if (data.status == null){
                    alert('error code 0x001');
                }else{
                    // console.log(data.status);
                    return new Promise(resolve => {
                        resolve(data.status);
                    },
                    reject => {
                        reject(null);
                        alert('error code 0x002');
                    });
                }
            }
        });
        return new Promise(resolve => {
            if(data == null) {
                resolve(data);
            }
            else if (data == undefined) 
            {
                // alert('error code 0x003');
                // reslove(await get_data(hash_key));
                // todo: find issue on first start... (BUG!) 
            }
            else{
                resolve(data.status);
            }
            
            
        });
    }




    var textField = document.getElementById("textOutput");
    var enableScanButton = document.getElementById("scanButton");
    
    enableScanButton.addEventListener("click", async () => {

        textField.innerHTML = ("Reading NFC");
        const dbRef = app_fireBase.database().ref();
        dbRef.child("users").get().then(async(snapshot) => {
        if (snapshot.exists()) {
            // console.log("------------new log-------------");
            // serialNumber = "3456";
            // status = await get_data(serialNumber);
            
            // if (status == "null"){
            //     textField.innerHTML = ("User doesn't exist! Status: "+status);
            //     console.log("user does not exsit");
            // } else if (status == "undefined"){
            //     console.log("undefined do nothing");
            //     textField.innerHTML = ("try again: "+status);
            // } else {
            //     textField.innerHTML = ("User found: "+status);
            //     console.log("user exists, write new valid info");
            //     if (status == "true"){
            //         textField.innerHTML = ("Access granted, status string: "+status);
            //         document.getElementById("result_box").style.backgroundColor="green";
            //         console.log("granted"+status);
            //     }
            //     else if(status == true){
            //         textField.innerHTML = ("Access granted, status 2: "+status);
            //         document.getElementById("result_box").style.backgroundColor="green";
            //         console.log("granted"+status);
            //     } else {
            //         textField.innerHTML = ("Access DENIED, status test: "+status);
            //         document.getElementById("result_box").style.backgroundColor="red";
            //         console.log("denies"+status);
            //     }                    
            // }
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
            document.getElementById("result_box").style.backgroundColor="none";
        
            ndef.addEventListener("readingerror", () => {
                textField.innerHTML = ("Argh! Cannot read data from the NFC tag. Try another one?");
            });
        
            // read serial number from card
            ndef.addEventListener("reading", async ({ _, serialNumber }) => {
                textField.innerHTML = (`> Serial Number is: ${serialNumber}`);

                textField.innerHTML = ("Waiting for data: "+serialNumber);
                //get user info
                status = await get_data(serialNumber);
                
                if (status == "null"){
                    textField.innerHTML = ("User doesn't exist! Status: "+status);
                } else if (status == "undefined"){
                    console.log("undefined do nothing");
                    textField.innerHTML = ("try again: "+status);
                } else {
                    textField.innerHTML = ("User found: "+status);
                    console.log("user exists, write new valid info");
                    if (status == true){
                        textField.innerHTML = ("Access granted, status: "+status);
                        document.getElementById("result_box").style.backgroundColor="green";
                    } else {
                        textField.innerHTML = ("Access DENIED, status: "+status);
                        document.getElementById("result_box").style.backgroundColor="red";
                    }                    
                }

                // const dbRef = app_fireBase.database().ref();

                // dbRef.child(`users/${serialNumber}`).get().then((snapshot) => {
                // if (snapshot.exists()) {
                //     console.log(snapshot.val());
                //     accessAllowed = snapshot.val();
                // } else {
                //     console.log("No data available");
                // }
                // }).catch((error) => {
                // console.error(error);
                // });

                // var path = 'users/';
                // var data = {
                //     serialNumber: `${serialNumber}`,
                //     access: accessAllowed
                // };
                // app_fireBase.database().ref(path).push(data);
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