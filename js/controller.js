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

function initialText() {
    var meme = getMeme()
    var x = gElCanvas.width * 0.5;
    var y = gElCanvas.height * 0.1;
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = `${meme.lines[meme.selectedLineIdx].color}`;
    gCtx.font = `${meme.lines[meme.selectedLineIdx].size}px Impact`;
    gCtx.fillText(meme.lines[meme.selectedLineIdx].txt, x, y);
    gCtx.strokeText(meme.lines[meme.selectedLineIdx].txt, x, y);
}

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