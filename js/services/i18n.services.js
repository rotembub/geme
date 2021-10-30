'use strict'

var gTrans = {
    memes: {
        en: 'Memes',
        he: 'מימים'
    },
    gallery: {
        en: 'Gallery',
        he: 'גלריה'
    },
    search: {
        en: 'Search',
        he: 'חיפוש'
    },
    copyrights: {
        en: '©Coffeerights 2021',
        he: '©כול הזכויות שמורות 2021'
    },
    more: {
        en: 'More',
        he: 'עוד'
    },
    input: {
        en: 'Enter Text Here',
        he: 'הכנס טקסט כאן'
    },
    download: {
        en: 'Download',
        he: 'הורדה'
    },
    upload: {
        en: 'Upload',
        he: 'העלאה'
    },
    add: {
        en: 'Add',
        he: 'הוספה'
    },
    mad: {
        en: 'mad',
        he: 'כעס'
    },
    funny: {
        en: 'funny',
        he: 'מצחיק'
    },
    happy: {
        en: 'happy',
        he: 'שמח'
    },
    cute: {
        en: 'cute',
        he: 'חמוד'
    },
    baby: {
        en: 'baby',
        he: 'תינוק'
    },
    sleep: {
        en: 'sleep',
        he: 'שינה'
    },
    strong: {
        en: 'strong',
        he: 'חזק'
    },
    crazy: {
        en: 'crazy',
        he: 'משוגע'
    },
    hair: {
        en: 'hair',
        he: 'שיער'
    },
    surprise: {
        en: 'surprise',
        he: 'הפתעה'
    },
    proud: {
        en: 'proud',
        he: 'גאווה'
    },
    leader: {
        en: 'leader',
        he: 'מנהיג'
    },
    adult: {
        en: 'adult',
        he: 'מבוגר'
    },
    blame: {
        en: 'blame',
        he: 'אשמה'
    },
    charisma: {
        en: 'charisma',
        he: 'כריזמה'
    },
    inspire: {
        en: 'inspire',
        he: 'השראה'
    },
    lotr: {
        en: 'lotr',
        he: 'שר הטבעות'
    },
    leaders: {
        en: 'leaders',
        he: 'מנהיגים'
    },
    classic: {
        en: 'classic',
        he: 'קלאסי'
    },
};

var gCurrLang = 'en';

function setLang(language) {
    gCurrLang = language;
}

function getCurrLang() {
    return gCurrLang;
}

function getTrans(key) {
    var translation = gTrans[key][gCurrLang];
    if (!translation) return 'UNKNOWN';
    return translation;
}