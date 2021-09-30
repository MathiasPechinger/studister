let scanButton = document.getElementById("scanButton");
let textField = document.getElementById("textOutput");

scanButton.addEventListener("click", async () => {
    textField.innerHTML = ("User clicked scan button");
  
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      textField.innerHTML = ("> Scan started");
  
      ndef.addEventListener("readingerror", () => {
        textField.innerHTML = ("Argh! Cannot read data from the NFC tag. Try another one?");
      });

      ndef.addEventListener("reading", ({ _, serialNumber }) => {
        textField.innerHTML = (`> Serial Number: ${serialNumber}`);
      });
    } catch (error) {
        textField.innerHTML = ("Argh! " + error);
    }
  }
);