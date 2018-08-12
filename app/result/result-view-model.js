const observableModule = require("data/observable");

function ResultViewModel() {
    const viewModel = observableModule.fromObject({
        url: ""
    });

    viewModel.setFileName = function(fileName) {
        viewModel.url = "https://trollface-maker.herokuapp.com/img/" + fileName;
    };

    return viewModel;
}

module.exports = ResultViewModel;
