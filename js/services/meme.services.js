'use strict'

var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gStickersIdx = 0;
const StickersPageSize = 3;
var gStickers = ['🎁', '😈', '💩', '🎵', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '💯', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎'];
var gMeme;
var gImgs = [
    {
        id: 1,
        url: './meme-imgs (square)/1.jpg',
        keywords: ['mad', 'funny'],
    },
    {
        id: 2,
        url: './meme-imgs (square)/2.jpg',
        keywords: ['happy', 'cute'],
    },
    {
        id: 3,
        url: './meme-imgs (square)/3.jpg',
        keywords: ['cute', 'funny', 'baby'],
    },
    {
        id: 4,
        url: './meme-imgs (square)/4.jpg',
        keywords: ['sleep', 'cute', 'funny'],
    },
    {
        id: 5,
        url: './meme-imgs (square)/5.jpg',
        keywords: ['strong', 'funny', 'baby'],
    },
    {
        id: 6,
        url: './meme-imgs (square)/6.jpg',
        keywords: ['crazy', 'funny', 'hair'],
    },
    {
        id: 7,
        url: './meme-imgs (square)/7.jpg',
        keywords: ['surprise', 'funny', 'baby'],
    },
    {
        id: 8,
        url: './meme-imgs (square)/8.jpg',
        keywords: ['happy', 'proud'],
    },
    {
        id: 9,
        url: './meme-imgs (square)/9.jpg',
        keywords: ['happy', 'funny', 'baby'],
    },
    {
        id: 10,
        url: './meme-imgs (square)/10.jpg',
        keywords: ['happy', 'funny', 'leader'],
    },
    {
        id: 11,
        url: './meme-imgs (square)/11.jpg',
        keywords: ['adult', 'mad'],
    },
    {
        id: 12,
        url: './meme-imgs (square)/12.jpg',
        keywords: ['blame', 'funny'],
    },
    {
        id: 13,
        url: './meme-imgs (square)/13.jpg',
        keywords: ['happy', 'leader', 'funny', 'charisma'],
    },
    {
        id: 14,
        url: './meme-imgs (square)/14.jpg',
        keywords: ['inspire', 'charisma'],
    },
    {
        id: 15,
        url: './meme-imgs (square)/15.jpg',
        keywords: ['lotr', 'funny', 'charisma'],
    },
    {
        id: 16,
        url: './meme-imgs (square)/16.jpg',
        keywords: ['happy', 'funny'],
    },
    {
        id: 17,
        url: './meme-imgs (square)/17.jpg',
        keywords: ['leaders', 'funny',],
    },
    {
        id: 18,
        url: './meme-imgs (square)/18.jpg',
        keywords: ['happy', 'funny', 'classic'],
    },

];

mapKeyWords();

function getImgs() {
    return gImgs;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getImgById(imgId) {
    var id = parseInt(imgId);
    setCurrMemeImg(id);
    return gImgs.find(img => img.id === parseInt(id));
}
function setNewMeme() {
    gMeme = _createNewMeme();
}
function _createNewMeme() {
    var newMeme = {
        selectedImgId: null,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Use the text box',
                size: 30,
                align: 'left',
                color: 'white',
                font: 'Impact',
                pos: { x: 50, y: 50 },
                lineLength: null,
            }
        ],
    }
    return newMeme;
}

function setCurrMemeImg(id) { 
    gMeme.selectedImgId = id;
}
function updateMemeText(text) {
    getSelectedLine().txt = text;
}

function getgMemeImg() {
    return getImgById(gMeme.selectedImgId).url;
}

function getMeme(canvasSize) {
    return gMeme
}

function increaseTextSize() {
    getSelectedLine().size++;
}

function decreaseTextSize() {
    getSelectedLine().size--;
}

function changeTextPos(x, y) {
    var currLine = getSelectedLine();
    currLine.pos.x = x;
    currLine.pos.y = y;
}

function moveTextUp() {
    getSelectedLine().pos.y -= 5;
}
function moveTextDown() {
    getSelectedLine().pos.y += 5;
}

function createNewLine(text = 'I never eat Falafel', canvasMeasures) {
    var newLine = {
        txt: text,
        size: 30,
        align: 'left',
        color: 'white',
        font: 'Impact',
        pos: { x: canvasMeasures.width / 2, y: canvasMeasures.height - 50 },
        lineLength: null,
    }
    if (gMeme.lines.length === 0) newLine.pos.y = 50;
    if (gMeme.lines.length >= 2) {
        newLine.pos.y = canvasMeasures.height / 2;
    }
    gMeme.lines.push(newLine);
}

function setCurrLine() {
    gMeme.selectedLineIdx++;
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

function updateLineFont(font) {
    getSelectedLine().font = font;
}

function updateLineColor(color) {
    getSelectedLine().color = color;
}
// problem in here, maybe caused by canvas size changes ,FIXED (i think)
function setLineLength(lineIdx, length) {
    gMeme.lines[lineIdx].lineLength = length;
}

function isLineClicked(pos) {
    for (var i = 0; i < gMeme.lines.length; i++) {
        var currLine = gMeme.lines[i];
        if (pos.x >= currLine.pos.x && pos.x < currLine.pos.x + currLine.lineLength && pos.y >= currLine.pos.y - currLine.size && pos.y <= currLine.pos.y) {
            console.log(true);
            gMeme.selectedLineIdx = i; // WATCHOUT
            return true;
        }
    }
    return false;
}

// i could perhaps make it prettier get back to it later:
function alignLines(side, canvasMeasures) {
    var xLocation;
    switch (side) {
        case 'left':
            xLocation = 20;
            break;
        case 'right':
            xLocation = canvasMeasures.width;
            break;
        case 'center':
            xLocation = canvasMeasures.width / 2;
            break;
    }
    gMeme.lines.forEach(line => {
        line.pos.x = xLocation;
        if (side === 'right') line.pos.x = xLocation - line.lineLength;
        if (side === 'center') line.pos.x = xLocation - line.lineLength / 2;
    });
}

function deleteSelectedLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
}

function mapKeyWords() {
    gKeywords = gImgs.reduce((map, img) => {
        img.keywords.reduce((innermap, word) => {
            (!map[word]) ? map[word] = 1 : map[word]++
            return innermap;
        }, {});
        return map;
    }, {});
}

function getKeyWords() {
    return gKeywords;
}

function increaseRate(word) {
    gKeywords[word]++;
}

function getStickers() {
    return gStickers.slice(gStickersIdx * StickersPageSize, (gStickersIdx * StickersPageSize) + StickersPageSize);
}

function showNext(isNext) {
    if (isNext) {
        gStickersIdx++;
        if (gStickersIdx * StickersPageSize >= gStickers.length) gStickersIdx = 0;
    }
    else {
        if (gStickersIdx === 0) return;
        gStickersIdx--;
    }
}