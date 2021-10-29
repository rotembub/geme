'use strict'

var gElCanvas;
var gCtx;
var gAlign = 'center';
var gIsClicked = false;
var gCurrImage;
var gSavedMemes;
var gSearchBy;
var gIsSearching = false;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function initCanvas() {
    gElCanvas = document.getElementById('canvas');
    setCanvasMeasures();
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
// function renderCanvas() { 
//     gCtx.save()
//     gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
//     renderText();
//     gCtx.restore()
// }

// click and drag functions:
function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        setCanvasMeasures();
        loadImage();
        renderText();
    })
}
function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}
function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}
// come back to it later
// function resizeCanvas() {
//     const elContainer = document.querySelector('.canvas-container')
//     gElCanvas.width = elContainer.offsetWidth
//     gElCanvas.height = elContainer.offsetHeight
//     console.log('here');
// }


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
    if (gTouchEvs.includes(ev.type)) {
        // console.log(ev);
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop //- 200 // parent element on Absolute position with 200px from the top
        }
    }
    console.log(pos);
    return pos
}

function renderImages() {
    var images = getImgs();
    // console.log(images);
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
    // initialText(); // WATCHOUT TRYING SOMETHING
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
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

function onMoveLine(isUp) {
    if (isUp) moveTextUp();
    else moveTextDown();
    renderText();
}

function onNewLineInput() {
    document.querySelector('.lower-text').style.visibility = 'visible';
    createNewLine(); // WATCHOUT 
    setCurrLine(); // WATCHOUT 
}

function onSwitchLine() {
    setCurrLine(); // WATCHOUT 
    renderText();
    markSelected();
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
        // console.log(gElCanvas.width, gElCanvas.height);
        setLineLength(i, gCtx.measureText(meme.lines[i].txt).width);
        var x = meme.lines[i].pos.x;
        var y = meme.lines[i].pos.y;
        // console.log('x,y:', x, y);
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

// a failed attemped need to either fix or delete
// GET BACK TO IT LATER CALLING DIRECTLLY TO gMeme need a work around
// prototype: currently NOT IN USE
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

function onIncreaseFont(word) {
    increaseRate(word);
    displayKeyWords();
    setSearchBy(word);
}

function getCanvasMeasures() {
    console.log('hi measure canvas');
    if (window.innerWidth <= 850) {
        // setCanvasMeasures();
        return { width: 250, height: 250 };
    }
    // setCanvasMeasures();
    return { width: 500, height: 500 };
}

function setCanvasMeasures() {
    if (window.innerWidth <= 850) {
        if (gElCanvas.width === 250) return; //////////////////////
        gElCanvas.width = 250;
        gElCanvas.height = 250;
        // loadImage();
    } else {
        if (gElCanvas.width === 500) return; //////////////////////
        gElCanvas.width = 500;
        gElCanvas.height = 500;
        // loadImage();
    }
}