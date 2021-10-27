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
    gElCanvas = document.getElementById('canvas');
    gCtx = gElCanvas.getContext('2d');
}


function loadImages() {
    var elGallery = document.querySelector('.img-gallery');
    var strHtml = '';

}

function openEditor(imgSrc) {
    console.log(imgSrc);
    var elEditor = document.querySelector('.meme-editor');
    // var elMemeImg = document.querySelector('.meme-editor img');
    // console.log(elEditor);
    // console.log(elMemeImg);
    // elMemeImg.src = imgSrc;
    drawImg(imgSrc);
    elEditor.classList.add('opened');


}

function closeEditor(elEditor) {
    console.log(elEditor);
    elEditor.classList.remove('opened');
}

function drawImg(imgSrc) {
    var img = new Image();
    img.src = imgSrc;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    };
}


