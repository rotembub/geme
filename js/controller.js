'use strict'

var gElCanvas;
var gCtx;
var gIsClicked = false;
var gCurrImage;
var gSavedMemes;
var gSearchBy;
var gIsSearching = false;
var gWordsRevealed
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

function onDown(event) {
    var pos = getEvPos(event);
    console.log(pos);
    gIsClicked = isLineClicked(pos);
    if (gIsClicked) {
        renderText(); // WATCHOUT 
        drawLineBorders();
        document.body.style.cursor = 'grabbing';
    } else renderText();
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
    document.body.style.cursor = 'auto';
    // var pos = getEvPos(event);
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    console.log(pos); /////////////
    if (gTouchEvs.includes(ev.type)) {
        console.log(ev);
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.offsetParent.offsetLeft,  // did these changes on saturday 9pm hopefully didnt break the code
            y: ev.pageY - ev.target.offsetTop - ev.target.offsetParent.offsetTop    // there was problems locating touches on the canvas
        }
        // these were the original units which worked up untill i changed CSS and everything went off course with touch locations
        // console.log('x',ev.pageX , ev.target.offsetLeft , ev.target.clientLeft);
        // console.log('y',ev.pageY , ev.target.offsetPare , ev.target.clientTop);
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
    setNewMeme();
    var elMain = document.querySelector('main');       ///////////////////////////
    elMain.style.display = 'none';                  //////////////////////////////
    setCurrMemeImg(id);
    var elEditor = document.querySelector('.meme-editor');
    loadImage();
    drawImg();
    elEditor.classList.add('opened');
}

function closeEditor(elEditor) {
    document.querySelector('.share-container').innerHTML = '';
    elEditor.classList.remove('opened');
    var elMain = document.querySelector('main');       ///////////////////////////
    elMain.style.display = 'block';                         /////////////////////
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
    document.querySelector('#upper-text').value = '';
    createNewLine(undefined, getCanvasMeasures()); // WATCHOUT 
    setCurrLine(); // WATCHOUT 
}

function onSwitchLine() {
    setCurrLine(); // WATCHOUT 
    renderText();
    drawLineBorders();
}

function onSetFont(font) {
    updateLineFont(font);
    renderText();
}
function onSetColor(color) {
    updateLineColor(color);
    renderText();
}
function onAlignLines(alignment) {
    alignLines(alignment, getCanvasMeasures());
    renderText();
}

function onDeleteLine() {
    deleteSelectedLine();
    renderText();
}

function onDownloadImg(elAnchor) {
    elAnchor.href = gElCanvas.toDataURL('image/jpeg');
    gSavedMemes.push(elAnchor.href);
    saveToStorage('savedMemes', gSavedMemes);
}

// prototype:
function initialText() {
    var meme = getMeme();
    for (var i = 0; i < meme.lines.length; i++) {
        setLineLength(i, gCtx.measureText(meme.lines[i].txt).width);
        var x = meme.lines[i].pos.x;
        var y = meme.lines[i].pos.y;
        gCtx.shadowBlur = 0;
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = 'black';
        gCtx.fillStyle = `${meme.lines[i].color}`;
        gCtx.font = `${meme.lines[i].size}px ${meme.lines[i].font}`;
        gCtx.fillText(meme.lines[i].txt, x, y);
        gCtx.strokeText(meme.lines[i].txt, x, y);
    }
}
 
function drawLineBorders() {
    var selectedLine = getSelectedLine();
    gCtx.beginPath();
    gCtx.rect(selectedLine.pos.x, selectedLine.pos.y, selectedLine.lineLength, -selectedLine.size);
    gCtx.strokeStyle = 'white';
    gCtx.stroke();
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
// see if can display them when clicked
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
        strHTML += `<span style="font-size: calc(16px + ${keywords[key]}px);" data-trans="${key}" onclick="onIncreaseFont('${key}')">${key}</span>`;
    }
    document.querySelector('.keywords').innerHTML = strHTML;
    if (gWordsRevealed) onRevealKeyWords();
}
// REMINDER: i could set invisible in CSS to all spans except for like 4 and when a button is pressed it gives visible to all.
// UPDATE: didnt work taking extra space and ruins design
function onRevealKeyWords() {
    gWordsRevealed = true;
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
    if (window.innerWidth <= 850) {
        return { width: 250, height: 250 };
    }
    return { width: 500, height: 500 };
}

function setCanvasMeasures() {
    if (window.innerWidth <= 850) {
        if (gElCanvas.width === 250) return; //WATCHOUT
        gElCanvas.width = 250;
        gElCanvas.height = 250;
    } else {
        if (gElCanvas.width === 500) return; //WATCHOUT
        gElCanvas.width = 500;
        gElCanvas.height = 500;
    }
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

function onAddStickers(elEmoji) {
    console.log(elEmoji.innerText);
    createNewLine(elEmoji.innerText, getCanvasMeasures());
    setCurrLine();
    renderText();
}

function renderStickers() {
    var stickers = getStickers();
    var elStickersContainer = document.querySelector('.stickers-container');
    var strHtml = stickers.map(sticker => {
        return `<span onclick="onAddStickers(this)">${sticker}</span>`
    });
    elStickersContainer.innerHTML = strHtml.join('');
}

function onShowNext(isNext) {
    showNext(isNext);
    renderStickers();
}

function onSetLang(lang) {
    setLang(lang);
    var elBody = document.querySelector('body');
    if (lang === 'he') elBody.classList.add('hebrew');
    else elBody.classList.remove('hebrew');
    onTranslate();
}


function onTranslate() {
    var elements = document.querySelectorAll('[data-trans]');
    elements.forEach(element => {
        var elDataTrans = element.dataset.trans;
        if (element.nodeName === 'INPUT') element.placeholder = getTrans(elDataTrans);
        else element.innerText = getTrans(elDataTrans);
    });
}

function onMarkHeadings(pressed) {
    var elHeadingGallery = document.querySelector('.h-gallery');
    var elHeadingMemes = document.querySelector('.h-memes');
    if (pressed === 'gallery') {
        renderImages();
        if (elHeadingGallery.classList.contains('pressed')) return;
        elHeadingMemes.classList.toggle('pressed');
        elHeadingGallery.classList.toggle('pressed');
    } else if (pressed === 'memes') {
        displaySavedMemes();
        if (elHeadingMemes.classList.contains('pressed')) return;
        elHeadingMemes.classList.toggle('pressed');
        elHeadingGallery.classList.toggle('pressed');
    }
}