const ResultViewModel = require("./result-view-model");
const bghttp = require("nativescript-background-http");

var page;
var pageData = new ResultViewModel();

exports.onNavigatingTo = function(args) {
    page = args.object;
    page.bindingContext = pageData;
    page.actionBarHidden = true;

    const context = page.navigationContext;
    makeTrollface(context.filePath);
};

makeTrollface = function(filePath) {
    var session = bghttp.session("image-upload");
            
    var request = {
        url: "https://trollface-maker.herokuapp.com/make_trollface",
        method: "POST",
    };

    var uploadParams = [
        { name: "pic", filename: filePath, mimeType: "image/jpeg" }
    ];

    console.log("uploading " + filePath);
    var task = session.multipartUpload(uploadParams, request);

    function logEvent(e) {
        console.log(e.eventName);
    }

    task.on("progress", logEvent);
    task.on("error", logEvent);
    task.on("complete", logEvent);

    task.on("responded", (e) => {
        var data = JSON.parse(e.data);
        console.log("Data: " + data.filename);
        pageData.setFileName(data.filename);
    });
};
