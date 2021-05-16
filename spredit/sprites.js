"use strict";

const PARAM_SINGLE = {    
    maxCol: 24,             // 12 or 24 pixels wide          
    ppb: 8,                 // 4 or 8 pixels per byte
    pixelMask: 0b10000000,  // pixel mask for getting data
    bpp: 1,                 // bits per pixel     
}

const PARAM_MULTI = {    
    maxCol: 12,             // 12 or 24 pixels wide          
    ppb: 4,                 // 4 or 8 pixels per byte
    pixelMask: 0b11000000,  // pixel mask for getting data
    bpp: 2,                 // bits per pixel
}

// One sprite
class SpriteItem {
    /**
     * One sprite.
     * 
     * @param {*} sprCount 
     */

    constructor(sprCount) {
        this.multi = false
        this.color = 15
        this.id = sprCount
        this.edited = false
        this.xored = false

        this.data = new Array(63).fill(0);

        // this.data = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xfe, 0x30, 0x01, 0x9c, 0x70, 0x0f, 0x5e, 0xe0, 0x0f, 0xfc, 0xe0, 0x05, 0x7e, 0xf0, 0x0f, 0xfc, 0x70, 0x07, 0x9e, 0x60, 0x00, 0x1c, 0x40, 0x00, 0x1e, 0x80, 0x03, 0xff, 0xc0, 0x07, 0xff, 0xe0, 0x03, 0x81, 0xf0, 0x01, 0x80, 0x70, 0x00, 0xc0, 0x60, 0x07, 0xe0, 0x60, 0x00, 0x00, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]

        // Duck
        // this.data = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x01, 0x50, 0x00, 0x01, 0x10, 0x00, 0x29, 0x50, 0x00, 0x09, 0x50, 0x00, 0x00, 0x50, 0x00, 0x00, 0x50, 0x01, 0x00, 0x54, 0x15, 0x01, 0x55, 0x55, 0x01, 0x6a, 0xa4, 0x0d, 0x5a, 0x97, 0x3f, 0x5a, 0x5f, 0x3f, 0xd5, 0x7f, 0x0f, 0xff, 0xfc, 0x00, 0xfc, 0x00, 0x00, 0x00, 0x00, 0x00]
    }

    clearSprite() {
        for (let i = 0; i < 63; i++) {
            this.data[i] = 0
        }
    }

    getParams() {
        return (this.multi) ? PARAM_MULTI : PARAM_SINGLE;
    }

    setPixel(x, y, bitmapVal) {

        let p = this.getParams()

        // Error handling
        if ( (y > 20) || (x * p.bpp > 23) || (x < 0) || (y < 0)) { 
            return 
        }
        
        let addr = y * 3 + Math.floor(x / p.ppb)
        let x_shift = Math.floor(x % p.ppb) * p.bpp
        
        let and_mask = ~ (p.pixelMask >> x_shift)
        let val = bitmapVal << (8 - x_shift - p.bpp)

        this.data[addr] = (this.data[addr] & and_mask) | val
    }

    scrollUp() {
        let tmp = this.data.slice(0, 3)
        
        for (let i = 0; i < 63; i++) {
            if (i >= 20 * 3) {
                this.data[i] = tmp[i - 60]
            } else {
                this.data[i] = this.data[i+3]
            }
        }        
    }

    mirrorVertical() {                
        for (let i = 0; i < 30; i++) {
            let i2 = 60 + (i % 3) * 2  - i
            let temp = this.data[i]
            this.data[i] = this.data[i2]
            this.data[i2] = temp            
        }        
    }

    rotate90() {
        /**
         * 	x = 2..21
		    y= 0..19
			swapbits (c,r), (r+2, 21-c)
         */

        let unp = this.getUnpacked()
        let unp2 = Array(unp.length).fill(0)

        let p = this.getParams()
        let cols = 24 / p.bpp

        for (let r = 0; r < 21; r++) {

            for (let c = 2; c < 22; c++) {
                let addr = r * cols + c
                let addr2 = (21 - c) * cols + (2 + r)                               
                unp2[addr2] = unp[addr]
            }            
            
        }        

        this.data = Bits.getBytesFromFixedBits(unp2, p.bpp)
    }
 


    scrollDown() {
        let tmp = this.data.slice(60, 63)
        
        for (let i = 62; i >= 0; i--) {
            if (i <= 2) {
                this.data[i] = tmp[i]
            } else {
                this.data[i] = this.data[i-3]
            }
        }        
    }

    
    scrollLeft() {                
        let unp = this.getUnpacked()
        let p = this.getParams()
        let cols = 24 / p.bpp

        for (let i = 0; i < 21; i++) {
            let temp = unp[i * cols]
            let addr = i * cols            
            for (let c = 0; c < cols; c++) {
                if (c == cols - 1) {
                    unp[addr] = temp    
                } else {
                    unp[addr] = unp[addr + 1]
                }
                addr++
            }            
            
        }        

        this.data = Bits.getBytesFromFixedBits(unp, p.bpp)
    }

    scrollRight() {                
        let unp = this.getUnpacked()
        let p = this.getParams()
        let cols = 24 / p.bpp

        for (let i = 0; i < 21; i++) {
            let temp = unp[(i + 1) * cols - 1]
            let addr = i * cols + cols - 1
            for (let c = 0; c < cols; c++) {
                if (c == cols - 1) {
                    unp[addr] = temp    
                } else {
                    unp[addr] = unp[addr - 1]
                }
                addr--
            }            
            
        }        

        this.data = Bits.getBytesFromFixedBits(unp, p.bpp)
    }

    mirrorHorizontal() {                
        let unp = this.getUnpacked()
        let p = this.getParams()
        let cols = 24 / p.bpp

        for (let i = 0; i < 21; i++) {            
            let addr = i * cols + cols - 1
            let addr2 = i * cols
            for (let c = 0; c < cols / 2; c++) {                                
                let temp = unp[addr2]
                unp[addr2] = unp[addr]
                unp[addr] = temp
                addr--
                addr2++
            }            
            
        }        

        this.data = Bits.getBytesFromFixedBits(unp, p.bpp)
    }

    isMulti() {
        return this.multi
    }
    
    getUseful() {        
        return SpriteCompress.getUseful(this.data, 31)
    }

    getPacked() {
        return this.data
    }

    getUnpacked() {    
        /* Get unpacked data. All bytes contain one pixel color:
                0..1 for single color
                0..3 for multi color

                Result:
                    array of 24*21 for single and 12*21 for multicolor sprites.
        */

        // Single or multicolor sprite
        let p = (this.multi) ? PARAM_MULTI : PARAM_SINGLE;
        
        let addr = 0;                               // Starting address
        let dataUnpacked = []

        for (let row = 0; row < 21; row++) {
            for (let byteInRow = 0; byteInRow < 3; byteInRow++) {
                // Get current byte
                let bits = this.data[addr]

                // Get pixel info
                for (let byteCol = 0; byteCol < p.ppb; byteCol++) {
                    // ToDo: javítani!!!
                    let pixelVal = (bits & p.pixelMask) >> (8 - p.bpp)                    
                    dataUnpacked.push(pixelVal)

                    bits <<= p.bpp
                }
                addr++;
            }            
        }
        
        return dataUnpacked
    }
}

// Sprite data
class Sprites {
    constructor() {                
        this.sprArray = []        

        for (let sprId = 0; sprId < 256; sprId++) {
            var sp = new SpriteItem(sprId)
            this.sprArray.push(sp)
        }
    }

    
    isMulti(sprId) {
        return this.sprArray[sprId].multi
    }

    getSprite(sprId) {        
        return this.sprArray[sprId]
    }
    getUnpacked(sprId) {
        return this.sprArray[sprId].getUnpacked()
    }

    getPacked(sprId) {
        return this.sprArray[sprId].getPacked()
    }
    
    putIcon(sprId, ctx, x, y) {
        let sprThis = this.getSprite(sprId)
        let sprData = sprThis.getUnpacked()                        
        let params = sprThis.getParams()
        let cols = params.maxCol            
    
        let cvImg = ctx.createImageData(24,21)
        let cvData = cvImg.data
    
        let count = 0
        let cvCount = 0
        for (let y=0; y < 21; y++) {
            for (let x=0; x < cols; x++) {
                let colorCode = colors[sprColors[sprData[count]]]
                for (let b = 0; b < params.bpp; b++) {                        
                    cvData[cvCount] = parseInt(colorCode[1], 16) * 0x11
                    cvData[cvCount+1] = parseInt(colorCode[2], 16) * 0x11
                    cvData[cvCount+2] = parseInt(colorCode[3], 16) * 0x11
                    cvData[cvCount+3] = 255                     
                    cvCount += 4
                }
                count++
            }
        }
    
        ctx.putImageData(cvImg, x, y)
    }
}
