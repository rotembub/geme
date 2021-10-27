'use strict'

var gKeywords = { 'happy': 12, 'funny puk': 1 }


// var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];
var gImgs = [
    {
        id: 1,
        url: '/meme-imgs (square)/1.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 2,
        url: '/meme-imgs (square)/2.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 3,
        url: '/meme-imgs (square)/3.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 4,
        url: '/meme-imgs (square)/4.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 5,
        url: '/meme-imgs (square)/5.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 6,
        url: '/meme-imgs (square)/6.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 7,
        url: '/meme-imgs (square)/7.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 8,
        url: '/meme-imgs (square)/8.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 9,
        url: '/meme-imgs (square)/9.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 10,
        url: '/meme-imgs (square)/10.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 11,
        url: '/meme-imgs (square)/11.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 12,
        url: '/meme-imgs (square)/12.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 13,
        url: '/meme-imgs (square)/13.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 14,
        url: '/meme-imgs (square)/14.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 15,
        url: '/meme-imgs (square)/15.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 16,
        url: '/meme-imgs (square)/16.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 17,
        url: '/meme-imgs (square)/17.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 18,
        url: '/meme-imgs (square)/18.jpg',
        keywords: ['happy', 'funny'],
    },

];

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 30,
            align: 'left',
            color: 'white'
        }
    ]
}

function getImgs() {
    return gImgs;
}

function getImgById(imgId) {
    var id = parseInt(imgId);
    updateGmemeId(id);
    return gImgs.find(img => img.id === parseInt(id));
}

function updateGmemeId(id) {
    gMeme.selectedImgId = id;
    console.log(gMeme);
}

function updateCurrentgMeme(id) {
    gMeme.selectedImgId = id;
}
function updateMemeText(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text;
}

function getgMemeImg() {
    return getImgById(gMeme.selectedImgId).url;
}

function getMeme() {
    return gMeme;
}