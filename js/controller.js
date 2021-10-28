'use strict'

var gElCanvas;
var gCtx;
var gAlign = 'center';
var gIsClicked = false;
var gCurrImage;

function initCanvas() {
    gElCanvas = document.getElementById('canvas');
    gCtx = gElCanvas.getContext('2d');
    addListeners();
}
// click and drag functions:
function addListeners() {
    addMouseListeners();
}
function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function onDown(event) {
    var pos = getEvPos(event);
    console.log(pos);
    gIsClicked = isLineClicked(pos);
    if (gIsClicked) {
        renderText(); // WATCHOUT completely negates the shadow mark effect
        markSelected();
    }
}

function onMove(event) {
    var pos = getEvPos(event);
    if (gIsClicked) {
        changeTextPos(pos.x, pos.y);
        renderText();
    }
}

function onUp(event) {
    gIsClicked = false;
    var pos = getEvPos(event);

}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // console.log(pos);
    return pos
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
    // console.log(id);
    updateCurrentgMeme(id);
    var elEditor = document.querySelector('.meme-editor');
    loadImage();
    drawImg();
    elEditor.classList.add('opened');
}

function closeEditor(elEditor) {
    // console.log(elEditor);
    elEditor.classList.remove('opened');
}

// seperating into load and draw functions to prevent image from flashing on change to the canvas
function loadImage() {
    var imgSource = getgMemeImg();
    gCurrImage = new Image();
    gCurrImage.src = imgSource;
    gCurrImage.onload = () => {
        gCtx.drawImage(gCurrImage, 0, 0, gElCanvas.width, gElCanvas.height);
        initialText();
    };
}
function drawImg() {
    gCtx.drawImage(gCurrImage, 0, 0, gElCanvas.width, gElCanvas.height);
    initialText(); // WATCHOUT TRYING SOMETHING
}


// DONT DELETE!!!!
// MIGHT HAVE TO GO BACK TO IT IF BUG PRESISTS
// function drawImg() {
//     var imgSource = getgMemeImg();
//     var img = new Image();
//     img.src = imgSource;
//     img.onload = () => {
//         gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
//         initialText();
//     };
// }

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
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
    renderText();
    markSelected();
    // drawLineBorders();
}

function onSetFont(font) {
    updateLineFont(font);
    renderText();
}
function onSetColor(color) {
    updateLineColor(color);
    renderText();
}
function onAlignRight() {
    gAlign = 'right';
    alignLines(gAlign);
    renderText();
}
function onAlignLeft() {
    gAlign = 'left';
    alignLines(gAlign);
    renderText();
}
function onAlignCenter() {
    gAlign = 'center';
    alignLines(gAlign);
    renderText();
}

function onDeleteLine() {
    deleteSelectedLine();
    renderText();
}

function onDownloadImg(elAnchor) {
    elAnchor.href = gElCanvas.toDataURL('image/jpeg');
}

// prototype:
function initialText() {
    var meme = getMeme();
    for (var i = 0; i < meme.lines.length; i++) {
        // console.log(gCtx.measureText(meme.lines[i].txt).width);
        setLineLength(i, gCtx.measureText(meme.lines[i].txt).width);
        var x = gMeme.lines[i].pos.x;
        var y = gMeme.lines[i].pos.y;
        // gCtx.direction = 'ltr';
        // gCtx.textBaseline = 'middle';
        // gCtx.textAlign = gAlign;
        gCtx.shadowBlur = 0;
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = 'black';
        gCtx.fillStyle = `${meme.lines[i].color}`;
        gCtx.font = `${meme.lines[i].size}px ${meme.lines[i].font}`;
        gCtx.fillText(meme.lines[i].txt, x, y);
        gCtx.strokeText(meme.lines[i].txt, x, y);
    }
}


// GET BACK TO IT LATER
function drawLineBorders() {
    gMeme.lines[gMeme.selectedLineIdx]
    var x = gMeme.lines[gMeme.selectedLineIdx].border.xStart;
    var y = gMeme.lines[gMeme.selectedLineIdx].border.yStart;
    var width = gMeme.lines[gMeme.selectedLineIdx].border.xEnd - x;
    var height = gMeme.lines[gMeme.selectedLineIdx].border.yEnd - y;
    gCtx.beginPath();
    gCtx.rect(x, y, width, height);
    gCtx.strokeStyle = 'white';
    gCtx.stroke();
}

// not looking good gotta fix it if there is time
function markSelected() {
    var meme = getMeme()
    var x = gMeme.lines[gMeme.selectedLineIdx].pos.x;
    var y = gMeme.lines[gMeme.selectedLineIdx].pos.y;
    gCtx.shadowColor = "black";
    gCtx.shadowBlur = 50;
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = `${meme.lines[meme.selectedLineIdx].color}`;
    gCtx.font = `${meme.lines[meme.selectedLineIdx].size}px Impact`;
    gCtx.fillText(meme.lines[meme.selectedLineIdx].txt, x, y);
    gCtx.strokeText(meme.lines[meme.selectedLineIdx].txt, x, y);
}