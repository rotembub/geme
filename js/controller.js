'use strict'

var gElCanvas;
var gCtx;
var gAlign = 'center';
var gIsClicked = false;
var gCurrImage;
var gSavedMemes;
var gSearchBy;
var gIsSearching = false;

function initCanvas() {
    gElCanvas = document.getElementById('canvas');
    gCtx = gElCanvas.getContext('2d');
    gSavedMemes = loadSavedMemes() // watchout
    addListeners();
}
// prototye
function loadSavedMemes() {
    var memes = loadFromStorage('savedMemes');
    console.log(memes);
    if (!memes) return [];
    else return memes;
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

function renderImages() {
    var images = getImgs();
    console.log(images);
    var elGallery = document.querySelector('.img-gallery');
    var strHtml = images.map(img => {
        if (gIsSearching) {
            if (img.keywords.includes(gSearchBy)) return `<img src="${img.url}" onclick="openEditor(this.name)" alt="" name="${img.id}">`;
        } else {
            return `<img src="${img.url}" onclick="openEditor(this.name)" alt="" name="${img.id}">`;
        }
    })
    elGallery.innerHTML = strHtml.join('');
    gIsSearching = false; // WATCHOUT
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
    document.querySelector('.share-container').innerHTML = '';
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
    // gSavedMemes.push(getMeme()); // prototype
    elAnchor.href = gElCanvas.toDataURL('image/jpeg');
    gSavedMemes.push(elAnchor.href);
    saveToStorage('savedMemes', gSavedMemes);
}



// prototype:
function initialText() {
    var meme = getMeme();
    for (var i = 0; i < meme.lines.length; i++) {
        // console.log(gCtx.measureText(meme.lines[i].txt).width);
        setLineLength(i, gCtx.measureText(meme.lines[i].txt).width);
        var x = meme.lines[i].pos.x;
        var y = meme.lines[i].pos.y;
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


// GET BACK TO IT LATER CALLING DIRECTLLY TO gMeme need a work around
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
    var x = meme.lines[meme.selectedLineIdx].pos.x;
    var y = meme.lines[meme.selectedLineIdx].pos.y;
    gCtx.shadowColor = "black";
    gCtx.shadowBlur = 50;
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = `${meme.lines[meme.selectedLineIdx].color}`;
    gCtx.font = `${meme.lines[meme.selectedLineIdx].size}px Impact`;
    gCtx.fillText(meme.lines[meme.selectedLineIdx].txt, x, y);
    gCtx.strokeText(meme.lines[meme.selectedLineIdx].txt, x, y);
}


function onUpload(ev) {
    loadInputImage(ev, drawImg);
}

function loadInputImage(ev, drawImage) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = drawImage.bind(null, img);
        img.src = event.target.result;
        gCurrImage = img;
    }
    reader.readAsDataURL(ev.target.files[0]);
}


// need to figure out a way of allowing it to be edited , set opened meme as gMeme get back to it later figure out name = id cause it has none
function displaySavedMemes() {
    var elGallery = document.querySelector('.img-gallery');
    var strHtml = gSavedMemes.map(meme => {
        return `<img src="${meme}" alt="">`
    })
    elGallery.innerHTML = strHtml.join('');
}

function setSearchBy(word) {
    if (!word) {
        renderImages();
        return;
    }
    gIsSearching = true;
    gSearchBy = word;
    console.log(gSearchBy);
    renderImages();
}

function displayKeyWords() {
    var keywords = getKeyWords();
    var strHTML = ''
    for (var key in keywords) {
        strHTML += `<span style="font-size: calc(16px + ${keywords[key]}px);" onclick="onIncreaseFont('${key}')">${key}</span>`;
    }
    // strHTML += '<a onclick="revealKeyWords()">More</a>'
    // console.log(strHTML);
    document.querySelector('.keywords').innerHTML = strHTML;
}

// REMINDER: i could set invisible in CSS to all spans except for like 4 and when a button is pressed it gives visible to all.

function revealKeyWords() {
    var elSpans = document.querySelectorAll('.search-bar .keywords span');
    elSpans.forEach(elSpan => {
        elSpan.classList.add('reveal');
    });
}

function onIncreaseFont( word) {
    increaseRate(word);
    displayKeyWords();
    setSearchBy(word);
}