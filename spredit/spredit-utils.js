/**
 * Simple utility functions for sprite editor.
 * 
 *  stringToArray(str)          Converts a string to an array of bytes, separated by ','.
 *  arrayToString(arr)          Converts array to string. Uses dollarUse global variable to choose between $ and 0x prefixes.
 *  numToHex(num)               Converts num to 2 character long hexadecimal.
 *  findColor(a)                Find closest C64 color to a<RGB>.
 *  getXored(a, b)              Returns xored value of two 63 bytes arrays.
 *  createHatch()               Creates a pattern for showing unused ranges.
 */


function stringToArray(str) {
    /**
     * Converts a string to an array of bytes.
     */

    return str.replace(/\s+/gm,',').split(/,+/gm).map(x => {
        if (x[0] == '$') {                    
            return parseInt("0x"+x.slice(1,),16)
        } 
        else if (x.slice(0,2) == "0x") {
            return parseInt(x, 16)
        }

        return parseInt(x, 10)
    }).slice(0,63)
}

function numToHex(num) {
    /**
     * Converts num to 2 character long hexadecimal. 
     */

    return num.toString(16).padStart(2,'0').toUpperCase()
}

function arrayToString(arr) {    
    /**
     * Uses dollarUse global variable to choose between $ and 0x prefixes.
     */

    let strPrefix = (dollarUse) ? '$' : '0x'
    return arr.map(x => strPrefix + numToHex(x)).join(', ')
}

// Convert the 16 colors to RGB format.

var colorLong = Array(16)

for (let i = 0; i < 16; i++) {
    
    let colArr = []
    for (let c = 0; c < 3; c++) {
        let col = parseInt(colors[i][c+1], 16) * 0x11
        colArr.push(col)
    }
    colorLong[i] = colArr
    
}

function findColor(a) {
    /**
     * Find closest C64 color to a<RGB>.
     * 
     * Returns closest color (0-15).
     */

    let bestColor = 0
    let bestDist = 255 * 3
    
    for (let i = 0; i < 16; i++) {
        let thisDist = 0
        for (let c = 0; c < 3; c++) {
            thisDist += Math.abs(a[c] - colorLong[i][c])
        }

        if (thisDist < bestDist) {
            bestDist = thisDist
            bestColor = i
        }
    }    
    return bestColor
}

function getXored(a, b) {
    /**
     * Xor to 63 byte arrays.
     * Returns xored array.
     */

    let xoredPacked = []

    for (let x = 0; x < 63; x++) {
        let xorVal = a[x] ^ b[x]
        xoredPacked.push(xorVal)
    }
    return xoredPacked
}

function createHatch() {
    /* Create hatch pattern */

    let p = document.createElement("canvas")
    p.width = 8;
    p.height = 8;
    
    let pCtx = p.getContext('2d');
    pCtx.lineWidth = 1;
    pCtx.strokeStyle = "#FFF7";            
    pCtx.beginPath();
    pCtx.arc(4.5, 4.5, 2.5, 0, 2 * Math.PI);
    pCtx.stroke();

    hatchPattern = ctx.createPattern(p, 'repeat');            
}