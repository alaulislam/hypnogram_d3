function downloadAsZip()
{
    // code here
function resetMessage () {
    $("#result")
    .removeClass()
    .text("");

    $("#card_result").removeClass("invisible");
}

function showMessage(text) {
    resetMessage();
    $("#result")
    .addClass("alert alert-success")
    .text(text);

    $("card_result").addClass("visible");
}

function showError(text) {
    resetMessage();
    $("#result")
    .addClass("alert alert-danger")
    .text(text);
}

function updatePercent(percent) {
    $("#progress_bar").removeClass("invisible").addClass("visible")
    .find(".progress-bar")
    .attr("aria-valuenow", percent)
    .css({
        width : percent + "%"
    });
}

if(!JSZip.support.blob) {
    showError("This project works only with a recent browser !");
    return;
}

resetMessage();

var zip = new JSZip();

$.each(imageArray, function(i, e){
    var img = zip.folder(imageSize+"_size");
    var $this = $(this);
    var dataURL = $this.attr('href');
    var url = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    var filename = $this.attr('download');
    img.file(filename, url, {base64: true});
});

zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
    var msg = "progression : " + metadata.percent.toFixed(2) + " %";
    if(metadata.currentFile) {
        msg += ", current file = " + metadata.currentFile;
    }
    showMessage(msg);
    updatePercent(metadata.percent|0);
})
.then(function callback(blob) {
    saveAs(blob, imageSize+"_size.zip");
    showMessage("done !");
}, function (e) {
    showError(e);
});

//return false;
}
