'use strict'

var gElCanvas;
var gCtx;

function initCanvas() {
    gElCanvas = document.getElementById('canvas');
    gCtx = gElCanvas.getContext('2d');
}


function RenderImages() {
    var images = getImgs();
    console.log(images);
    var elGallery = document.querySelector('.img-gallery');
    var strHtml = images.map(img => {
        return `<img src="${img.url}" onclick="openEditor(this.name)" alt="" name="${img.id}">`
    })
    elGallery.innerHTML = strHtml.join('');
}

function openEditor(id) {
    console.log(id);
    updateCurrentgMeme(id);
    var elEditor = document.querySelector('.meme-editor');
    drawImg();
    elEditor.classList.add('opened');
}

function closeEditor(elEditor) {
    console.log(elEditor);
    elEditor.classList.remove('opened');
}

function drawImg() {
    var imgSource = getgMemeImg();
    var img = new Image();
    img.src = imgSource;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        initialText();
    };
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    // You may clear part of the canvas
    // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height / 4)
}

// ORIGINAL:

// function initialText() { // need to fix it so it draws other lines other than the first
//     var meme = getMeme()
//     var x = gMeme.lines[gMeme.selectedLineIdx].pos.x;
//     var y = gMeme.lines[gMeme.selectedLineIdx].pos.y;
//     gCtx.lineWidth = 2;
//     gCtx.strokeStyle = 'black';
//     gCtx.fillStyle = `${meme.lines[meme.selectedLineIdx].color}`;
//     gCtx.font = `${meme.lines[meme.selectedLineIdx].size}px Impact`;
//     gCtx.fillText(meme.lines[meme.selectedLineIdx].txt, x, y);
//     gCtx.strokeText(meme.lines[meme.selectedLineIdx].txt, x, y);
// }

function onUpdateText(val) {
    updateMemeText(val);
    renderText();
}

function renderText() {
    clearCanvas();
    drawImg();
    initialText();
}

function onChangeTextSize(isIncrease) {
    if (isIncrease) increaseTextSize();
    else decreaseTextSize();
    renderText();
}

function onMoveLine(isUp) {
    if (isUp) moveTextUp();
    else moveTextDown();
    renderText();
}

function onNewLineInput() {
    document.querySelector('.lower-text').style.visibility = 'visible';
    createNewLine(); // WATCHOUT need to remove it from here later
    setCurrLine(); // WATCHOUT need to remove it from here later
}

function onSwitchLine() {
    setCurrLine(); // WATCHOUT need to remove it from here later
}

// prototype:
function initialText() {
    var meme = getMeme();
    for (var i = 0; i < meme.lines.length; i++) {
        // meme.lines.forEach(line => {
        // console.log(meme.lines.indexOf(line));
        var x = gMeme.lines[i].pos.x;
        var y = gMeme.lines[i].pos.y;
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = 'black';
        gCtx.fillStyle = `${meme.lines[i].color}`;
        gCtx.font = `${meme.lines[i].size}px Impact`;
        gCtx.fillText(meme.lines[i].txt, x, y);
        gCtx.strokeText(meme.lines[i].txt, x, y);
        // });
    }

}

