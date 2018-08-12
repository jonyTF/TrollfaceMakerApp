/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const HomeViewModel = require("./home-view-model");
const camera = require("nativescript-camera");
const app = require("application");
const frameModule = require("ui/frame");
const imageSourceModule = require("image-source");
const fs = require("file-system");
const imagepicker = require("nativescript-imagepicker");

var page;

exports.onNavigatingTo = function(args) {
    page = args.object;
    page.bindingContext = new HomeViewModel();
    page.actionBarHidden = true;
    page.getViewById("mainLayout").backgroundImage = Math.random() < .5 ? "~/img/trolla_lisa.jpg" : "~/img/trump_troll.jpg";
};

exports.takePhoto = function() {
    camera.requestPermissions()
    .then(() => camera.takePicture())
    .then((imageAsset) => {
        if (app.android) {
            makeTrollface(imageAsset.android);
        } else if (app.ios) {
            getFilePathIOS(imageAsset)
            .then((filePath) => {
                makeTrollface(filePath);
            });
        }
    })
    .catch((err) => {
        console.log("camera.takePicture() Error -> " + err.message);
    });
};

exports.choosePhoto = function() {
    var context = imagepicker.create({mode: "single"});

    context
        .authorize()
        .then(() => {
            return context.present();
        })
        .then((selection) => {
            var filePath;
            if (app.android) {
                filePath = selection[0].android;
                makeTrollface(filePath);
            } else if (app.ios) {
                getFilePathIOS(selection[0])
                .then((filePath) => {
                    makeTrollface(filePath);
                });
            }
        })
        .catch((e) => {
            console.log(e);
        });
};

exports.openGallery = function() {
    alert('open gallery');
};

getFilePathIOS = function(imageAsset) {
    const source = new imageSourceModule.ImageSource();
    return new Promise((resolve, reject) => {
        source.fromAsset(imageAsset)
        .then((imageSource) => {
            var savePath = fs.knownFolders.documents().path;
            var fileName = "temp.jpg";
            var filePath = fs.path.join(savePath, fileName);
            console.log("saving " + filePath);
            var saved = imageSource.saveToFile(filePath, "jpg");
            if (saved) {
                console.log("Saved " + filePath + " successfully!");
                resolve(filePath);
            } else {
                reject(Error("Error: Failed to save File"));
            }
        });
    });
};

makeTrollface = function(filePath) {
    const navigationEntry = {
        moduleName: "result/result-page",
        context: { filePath: filePath },
        animated: true
    };

    frameModule.topmost().navigate(navigationEntry);
};