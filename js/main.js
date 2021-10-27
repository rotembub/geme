'use strict'

// 1. Phase1 – main flow with no design (shall take 1-6 hours):
// a. Setup git and make sure you can commit and push to the repository. 
// b. Design an initial home page (index.html, main.js, CSS files) 
// c. Commit and Push
// d. Create gMeme as described above with a single txt line. 
// e. Create a Canvas with a single image – the image shall be taken from 
// gMeme (managed by a memeService)
// f. Draw a text line on it with IMPACT font at the top of the image. The text 
// shall be taken from gMeme
// g. Add text input to the HTML and dynamically take the text line value from 
// the input to gMeme and from it to the Canvas
// h. Make a simple image-gallery with 2 images. Click an image to update 
// gMeme and present it onto the Canvas. Note that to start with – locate 
// the Editor above the Image-Gallery.
// i. Make sure you can access your project in gitPage


var gElCanvas;
var gCtx;

function init() {
    RenderImages();
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
        addText();
    };
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    // You may clear part of the canvas
    // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height / 4)
}

function addText() {
    var meme = getMeme()
    var x = gElCanvas.width *0.5;
    var y = gElCanvas.height * 0.1;
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = `${meme.lines[meme.selectedLineIdx].color}`;
    gCtx.font = `${meme.lines[meme.selectedLineIdx].size}px Impact`;
    gCtx.fillText(meme.lines[meme.selectedLineIdx].txt, x, y);
    gCtx.strokeText(meme.lines[meme.selectedLineIdx].txt, x, y);
}