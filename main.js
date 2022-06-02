/* 2 canvases. 
DIRT: the main canvas, has all the dirt on top of it.
GEMS: this is where the randomly generated rocks go.

you clear rectangles from DIRT, which decreases the Density. once the density is below a certain level. the game ends

GEMS have an image, and flavor text that unlocks for each gem you collect.
*/

var dirtLayer = document.getElementById("dirt");
var gemsLayer = document.getElementById('gems');
var unlocksLayer = document.getElementById('unlocks');
var denseMeter = document.getElementById('denseMeter');

var dirtCtx = dirtLayer.getContext("2d");
var gemsCtx = gemsLayer.getContext("2d");

var sfx = [
    document.getElementById('sound0'),
    document.getElementById('sound1'),
    document.getElementById('sound2'),
    document.getElementById('sound3'),
    document.getElementById('sound4'),
    document.getElementById('sound5'),
];

var rockImages = [];
for (let i = 0; i < 20; i++) {
    rockImages.push(new Image());
    if (i == 2) rockImages[i].src = 'assets/img/2.png'; //the only png <3
    else
        rockImages[i].src = `assets/img/${i}.jpg`;
}




const MAX_HEIGHT = 600;
const MAX_WIDTH = 800;

const DENSITY_RATIO = 0.6;

const MAX_DENSITY = MAX_HEIGHT * MAX_WIDTH;

const MIN_DENSITY = MAX_DENSITY * DENSITY_RATIO;
var density = MAX_DENSITY;

const HAMMER_SIZE = 50;
const DRILL_SIZE = 10;
var isHammer = true;

//these are far from consistent, but they'll help a little bit!
const TYPICAL_IMAGE_WIDTH = 135;
const TYPICAL_IMAGE_HEIGHT = 85;

//************************** */
//the main code starts here!
//************************** */
dirtCtx.fillText('press R to start!', 300, 300);

dirtLayer.addEventListener('click', (e) => {
    var toolSize = DRILL_SIZE;
    if (isHammer) toolSize = HAMMER_SIZE;

    if(density > MIN_DENSITY) {
        dig(toolSize, e.offsetX, e.offsetY);
        changeDensity(toolSize);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code == 'KeyA') {
        isHammer = true;
    }
    else if (e.code == 'KeyZ') {
        isHammer = false;
    } else if (e.code == 'KeyR') {
        start();
    }

});

//************************** */
//assorted functions
//************************** */

function start() {
    //clear the contexts first
    dirtCtx.clearRect(0,0,MAX_WIDTH,MAX_HEIGHT);
    gemsCtx.clearRect(0,0,MAX_WIDTH,MAX_HEIGHT);
    density = MAX_DENSITY;

    dirtCtx.fillStyle = "#b38600";
    dirtCtx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);

    gemsCtx.fillStyle = "#000000";
    gemsCtx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);

    drawRandomGems(6);

    denseMeter.setAttribute('value', `${MAX_DENSITY}`);
    denseMeter.setAttribute('max', `${MAX_DENSITY}`);
    denseMeter.setAttribute('min', `${MIN_DENSITY}`);
    denseMeter.setAttribute('low', `${MIN_DENSITY + (MAX_DENSITY - MIN_DENSITY) / 3}`);
    denseMeter.setAttribute('high', `${MIN_DENSITY + 2 * (MAX_DENSITY - MIN_DENSITY) / 3}`);
}

function dig(toolSize, x, y) {
    var offX = x - toolSize / 2;
    var offY = y - toolSize / 2;

    dirtCtx.clearRect(offX, offY, toolSize, toolSize);
    randSound(sfx);

}

function drawRandomGems(amt) {
    const myGems = [];
    for(let i = 0; i < amt; i++) {
        let pos = rockImages[randBetween(0, rockImages.length)];
        myGems.push(rockImages[i]);

        let randX = randBetween(0, MAX_WIDTH);
        let randY = randBetween(0, MAX_HEIGHT);

        gemsCtx.drawImage(myGems[i], randX, randY)
    }

}

// an integer between min (inclusive) and max (exclusive)
function randBetween(min, max) {
    return min + Math.floor(Math.random() * max);
}

//plays a random sound from the source array.
function randSound(array) {
    const rand = randBetween(0, array.length);
    array[rand].play();
    return;
}

// subtracts diameter^2 from the density and updates the meter.
function changeDensity(diameter) {
    console.log(`${density} - ${Math.pow(diameter, 2)}`);
    density -= Math.pow(diameter, 2);
    denseMeter.setAttribute('value', `${density}`);
}