
function readFile(input) {    
    /**
     * Read sprites from image (path = input).
     */

    if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.onload = function (e) {
            imgSprite.setAttribute('src', e.target.result)            
            
            imgSprite.onload = function() { 
                readDataFromImage(imgSprite.width, imgSprite.height)
            }
        };
        reader.readAsDataURL(input.files[0])
      }
}

function writeFile() {
    /**
     * Write sprites to a file and download it.
     */
    let output = prompt("Download as...")
    
    if (!output) { return }

    let canvas = document.createElement('canvas')    
    canvas.width = 16 * 24
    canvas.height = 16 * 21

    let ctx = canvas.getContext('2d')        

    // Write all sprites on the image.

    for (let x = 0; x < 16; x++ ) {
        for (let y = 0; y < 16; y++ ) {
            sprId = x + y * 16
            spr.putIcon(sprId, ctx, x * 24, y * 21)
        }
    }
    
    let uri = canvas.toDataURL("image/png")
    let tempLink = document.createElement("a");
    
    tempLink.setAttribute('download', output);
    tempLink.href = uri;
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.remove();
}

function readDataFromImage(w, h) {
    /**
     * Read sprites from imgSprite. W and h contains width and height.
     * 
     */

    let canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h

    let ctx = canvas.getContext('2d')    
    ctx.drawImage(imgSprite, 0, 0)

    let imgD = ctx.getImageData(0, 0, w, h)
    sprActNo = 0

    for (let sprR = 0; sprR < Math.floor(h / 21); sprR ++) {
        for (let sprC = 0; sprC < Math.floor(w / 24); sprC ++) {
            // Read one sprite item            
            let data16 = []            
            let data = []

            let colorCount = Array(16).fill(0)
            for (let r = 0; r < 21; r++) {
                let pixelAddr = ( (sprR * 21 + r) * w + sprC * 24) * 4
                for (let c = 0; c < 24; c++) {

                    // It is really not a nice way to do this.
                    // All new colors should be cached with the closest color and reused later.
                    
                    let col16 = findColor(imgD.data.slice(pixelAddr, pixelAddr+4))
                    colorCount[col16]++;                   
                    data16.push(col16)

                    pixelAddr += 4
                }
            }
        
            // Determine if single or multicolor sprite

            let colorMapper = Array(16).fill(0)
            let actColor = 0

            // Map colors
            for (let i = 0; i < 16; i++) {
                if (colorCount[i] > 0) {
                    if (actColor > 3) { 
                        console.log(`Too many colors for sprite ${sprActNo}`)
                        actColor = 3
                    }

                    colorMapper[i] = actColor
                    actColor++
                }                
            }            

            // Handle singlecolor or multicolor sprite
            let bpp = 1
            if (actColor > 2) {
                bpp = 2                
            }
            
            // Convert image with mapped colors
            for (let i = 0; i < data16.length; i += bpp) {
                let col = colorMapper[data16[i]]
                data.push(col)
            }
            
            // Write to sprite
            let sprAct = spr.getSprite(sprActNo)
            sprAct.data = Bits.getBytesFromFixedBits(data, bpp)
            sprAct.multi = (bpp == 2) ? true : false
            repaintIcon(sprActNo);
            
            sprActNo++
        }
    }

    // Choose sprite 0
    chooseSprite(0)
}

function getAllData() {
    /**
     * Creates txt info containing compressed byte data for all sprites.
     */

    let sprDataStrAll = ""
    let sprRawStrAll = ""

    let totalBytes = 0
    let totalUncompr = 0
    
    for (let i = 0; i < 256; i++) {
        let sprAct2 = spr.getSprite(i)
        let [comprData, comprInfo] = SpriteCompress.compress(sprAct2.data)
        
        let sprDataStr = ""
        let sprRawStr = ""
        let sprXorBase
        
        // If empty, skip it
        if (comprData.length <= 2) { continue }

        let xoredSprite = false

        if (xoredUse && i > 0) {
            let xoredPacked, bytes
            [sprXorBase, xoredPacked, bytes] = getBestXored(i)

            // Use only if it is better
            if (bytes.length + 1 < comprData.length) {
                comprData = bytes            
                xoredSprite = true
            }
        }
        
        

        if (!xoredSprite) {
            sprDataStr += `/* Sprite ${numToHex(i)} - ${comprData.length+1} bytes */\n`    
            sprDataStr += `SPR_DEF_CMP0\n`            
        } else {            
            sprDataStr += `/* Sprite ${numToHex(i)} - ${comprData.length+1} bytes, based on sprite ${numToHex(sprXorBase)} */\n`
            sprDataStr += `SPR_DEF_CMP_BASE $${numToHex(sprXorBase)}\n`                        
        }

        
        sprDataStr += arrayToString(comprData)
        sprDataStr += "\n\n"
        totalBytes += comprData.length+1
        totalUncompr += 64

        sprDataStrAll += sprDataStr

        sprRawStr += `/* Sprite ${numToHex(i)}*/\n`    
        sprRawStr += arrayToString(sprAct2.data)

        sprRawStrAll += sprRawStr + "\n\n"

    }    

    if (!totalBytes) return            

    comprTextLabel.innerHTML = `${totalBytes} bytes - ${Math.ceil(totalBytes / totalUncompr * 100)}%`        
    rawTextLabel.innerHTML = `${totalUncompr} bytes`

    let comprBlock = document.getElementById("compr-block")        
    let rawBlock = document.getElementById("raw-block")    

    comprBlock.value = sprDataStrAll    
    rawBlock.value = sprRawStrAll

    setDataThis(false)

}

function setDataThis(setThis = true) {
    let dataThis = document.getElementById("data-this")
    let dataAll = document.getElementById("data-all")

    let comprBlock = document.getElementById("compr-block")        
    let rawBlock = document.getElementById("raw-block")    
    
    if (setThis) {
        dataThis.setAttribute("class", "data-selector")
        dataAll.setAttribute("class", "data-selector-off")
        
        comprBlock.readOnly = false
        rawBlock.readOnly = false
    }
    else {        
        dataAll.setAttribute("class", "data-selector")
        dataThis.setAttribute("class", "data-selector-off")        
        
        comprBlock.readOnly = true
        rawBlock.readOnly = true
    }
    
}