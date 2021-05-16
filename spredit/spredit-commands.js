"use strict";

// Transform functions
const TRANSFORM = {
    UP: -24, 
    DOWN: 24, 
    LEFT: -1, 
    RIGHT: 1,
    MIRR_HOR: -100,
    MIRR_VERT: 100
}

// Not implemented yet.
const cmdSelect = () => 0

function sprNoChange(change) {
    /**
     * Changes actual sprite.
     * Params:
     *      change:         -1 / +1
     */

     let sprNo = (sprActNo + change) & 255
     chooseSprite(sprNo)
     
}

function chooseSprite(sprNo) {
    sprActNo = sprNo
    sprAct = spr.getSprite(sprActNo)
    draw = 0
    repaint = true
    multi = sprAct.multi
    multiSet(multi)
    showMap(grid) 

    let sprNumText = document.getElementById("sprite-number")
    sprNumText.innerHTML = numToHex(sprActNo)
}

function handleXor() {
    let xorb = document.getElementById("xor-button")
    let xorStat = document.getElementById("xor-stat")

    sprXored = !sprXored

    if (sprXored) {        
        xorb.innerHTML = "⇝ Revert XOR"
        checkBase()
        xorStat.innerHTML = `XORed using sprite ${numToHex(sprXorBase)}.`
        
    } else 
    {        
        xorb.innerHTML = "⇝ XOR sprite"
        revertXOR()
        xorStat.innerHTML = ""
    }

}


function getBestXored(sprId) {

    let xoredPacked
    let thisPacked = spr.getSprite(sprId).getPacked()

    let minSize = 65
    
    for (let i = 0; i < sprId; i++) {
        let sprChecked = spr.getSprite(i).getPacked()
        
        xoredPacked = getXored(sprChecked, thisPacked)
        
        let [bytes, _comprInfo] = SpriteCompress.compress(xoredPacked)
        // console.log(`Compared to sprite ${i}: ${bytes.length+1}`)

        // Better found
        if (minSize > bytes.length) {
            minSize = bytes.length
            sprXorBase = i
        }
    }

    let sprChecked = spr.getSprite(sprXorBase).getPacked()
    let [bytes, _comprInfo] = SpriteCompress.compress(xoredPacked)

    xoredPacked = getXored(sprChecked, thisPacked)

    return [sprXorBase, xoredPacked, bytes]
}
function checkBase() {        
    
    clipb.copy(sprAct.getPacked())
    
    let [xorBase, xoredPacked, bytes] = getBestXored(sprActNo)

    sprAct.data = [...xoredPacked]
    multiSet(multi)
    showMap(grid)     
}

function revertXOR() {
    let thisPacked = sprAct.getPacked()
    let sprChecked = spr.getSprite(sprXorBase).getPacked()
    
    let xoredPacked = getXored(sprChecked, thisPacked)

    sprAct.data = [...xoredPacked]
    multiSet(multi)
    showMap(grid)     
}

function copyToClipb() {
    clipb.copy(sprAct.getPacked())
}

function pasteFromClipb() {
    sprAct.data = clipb.getData()

    fullRepaint()
}

function clearImage() {
    callerFunc.saveUndo()

    sprAct.clearSprite()
    fullRepaint()
}

function scrollImage(scrollAmount) {
    /**
     * Scrolls actual image
     * Params:
     *      scrollAmount:         -1 / +1 / -24 / +24
     */
    if (scrollAmount == TRANSFORM.UP) { sprAct.scrollUp() }
    else if (scrollAmount == TRANSFORM.DOWN) { sprAct.scrollDown() }
    else if (scrollAmount == TRANSFORM.LEFT) { sprAct.scrollLeft() }
    else if (scrollAmount == TRANSFORM.RIGHT) { sprAct.scrollRight() }
    else if (scrollAmount == TRANSFORM.MIRR_HOR) { sprAct.mirrorHorizontal() }
    else if (scrollAmount == TRANSFORM.MIRR_VERT) { sprAct.mirrorVertical() }

    
    multi = sprAct.multi
    
    fullRepaint()
}

function rotateImage(rotateCount) {
    for (let i = 0; i < rotateCount; i++) {
        sprAct.rotate90()
    }

    fullRepaint()

}




