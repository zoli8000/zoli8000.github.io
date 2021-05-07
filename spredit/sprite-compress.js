"use strict";

// Compressions
const CMP_NONE  = 0b00;      // All nibbles are stored on 4 bits
const CMP_UPLF  = 0b10;      // Uncompressed: <0><4 bits nib>, up: <10>, left: <11>
const CMP_BASE  = 0b11;      // Uncompressed: <0><4 bits nib>, base: <1>

const CMP_TEXT = ['NOCOMPR', '', 'UPLEFT', 'BASE']

const CMP_UP    = 0b0;       // Data same as above
const CMP_LF    = 0b1;       // Data same as left
const CMP_COMPR = 0b1;       // Data compressed
const CMP_BS    = 0b1;       // Use base data

// Get nibble mask variables

let _nibMaskProps = []
for (let nibV = 0; nibV <= 0b111111; nibV++) {
    
    let val = nibV
    let highBits = 0
    let colRangeArr = []
    
    colRangeArr.push(0)

    for (let i = 0; i < 6; i++) {
        if (val & 0x20) {
            colRangeArr.push(i)
            highBits++;
        }        
        val <<= 1
    }
    colRangeArr.push(6)

    _nibMaskProps.push({highBits: highBits, ranges: colRangeArr})
}

// console.log(_nibMaskProps)

class SpriteCompress {

    static getNib(sprData, nibcol, row) {
        /**
         * Returns nibble from sprData.
         * params:
         *      sprData: array of 63-64 bytes.
         *      nibcol:  nibble column (0-5).
         *      row:     row (0-20).
         */

        // Get address and nibble (low/high).
        let addr = row * 3 + Math.floor(nibcol / 2)
        let nib = nibcol % 2

        // Calculate relevant nibble
        let data = (nib) ? sprData[addr] & 0xf : sprData[addr] >> 4

        return data
    };

    static getNibbleArray(sprData) {
        /**
         * Returns the nibble array - data is read downwards!
         * 
         * Params:
         *     sprdata          sprite data (63/64 bytes)
         * 
         * Returns:
         *     array of nibs
         */

        let nibs = []

        for (let c = 0; c < 6; c++) {
            for (let r = 0; r < 21; r++) { 
                let val = SpriteCompress.getNib(sprData, c, r)

                nibs.push(val)                
            }
        }

        return nibs
    }

    static getUseful(sprData, nibMask = 0b111111) {
        /**
         * For each nibble column, calculates minimum and maximum coordinates holding data.
         * 
         * params: 
         *      sprData:    array of 63-64 bytes, containing single or multicolor sprite data.
         *      nibMask:    nibble mask, which nibble columns will be handled seperately. (0-63)
         * 
         * returns: array of 6 (or less if nibMask is defined) with <min><max> coordinates.
         * 
         * E.g.: [0x14, 0x16, 0x16, 0x43, 0x43, 0xff]
         *   0x14:  First nibble column (index 0).
         *          Data starts at row 1, and the last 4 rows are empty.
         *          This means 16 nibbles are needed, 5 is not modified. 
         *          (So 0 or base sprite is kept.)     
         * 
         * For calculating useful area for sprites based on other sprites, the two sprites are xored first.
         * (Not in this function.)
         * 
         * To use nibMask, use a number between 0-63.
         * 000000   means all columns with each value is stored.
         * 100000   means the first column gets a min and max value, and all remaining columns use the same min-max values.
         * 
         * */
                  
        
        let useful = []                         // Useful min-max
        let nibNeeded = [];                     // Array containing 0 / 1 values for multiplication

        let minRow;                             // Minimum row with data
        let maxRow;                             // Maximum row with data (started from below)
        
        let ranges = _nibMaskProps[nibMask].ranges
        let nibMaxCount = ranges.length - 1
        
        for (let nibCount = 0; nibCount < nibMaxCount; nibCount++) {
            minRow = 16;
            maxRow = 16;

            for (let nibCol = ranges[nibCount]; nibCol < ranges[nibCount+1]; nibCol++) {
                
                // Calculate minimum row            
                let minRowLocal;

                for (minRowLocal = 0; minRowLocal < 15; minRowLocal++) {
                    let val = SpriteCompress.getNib(sprData, nibCol, minRowLocal)

                    if (val) break;
                }

                // Calculate maximum row
                let maxRowLocal;
                for (maxRowLocal = 0; maxRowLocal < 15; maxRowLocal++) {
                    let val = SpriteCompress.getNib(sprData, nibCol, 20 - maxRowLocal)

                    if (val) break;
                }
                
                if (minRow > minRowLocal) {
                    minRow = minRowLocal
                }

                if (maxRow > maxRowLocal) {
                    maxRow = maxRowLocal
                }

            }
            
            if (minRow + maxRow > 21) {
                maxRow = 21 - minRow
            }
                        
            useful.push([minRow, maxRow])
        }
        
        // Create 1/0 values for size calculation (0: not stored, 1: stored)
        for (let nibCount = 0; nibCount < nibMaxCount; nibCount++) {
            for (let nibCol = ranges[nibCount]; nibCol < ranges[nibCount+1]; nibCol++) {
                let [minRow, maxRow] = useful[nibCount]                                

                // First one is tricky. It contains the column range which needs to be stored completely.
                if (nibCount == 0) {
                    minRow = 0
                    maxRow = 0
                }

                let usefulRow = 21 - minRow - maxRow

                // Push 0s and 1s - 0s are not stored, 1s are stored.
                for (let r = 0; r < minRow; r++) { nibNeeded.push(0) }
                for (let r = 0; r < usefulRow; r++) { nibNeeded.push(1) }
                for (let r = 0; r < maxRow; r++) { nibNeeded.push(0) }
            }
        }

        return [useful, ranges, nibNeeded]
    }
    
    static getNibInfo(sprData) {
        /**
         * Returns nibble data - bits needed to be stored
         * 
         * Params:
         *      sprData                 sprite data (63/64 bytes)         
         */


        const getIndex = (arr, i) => ((i >= 0) & (i < arr.length)) ? arr[i] : 0

        let nibData = SpriteCompress.getNibbleArray(sprData)
        
        // Data object containing all possible versions
        let data = {}
        
        data._uncompr = {data: [], length: []}
        data._upleft = {data: [], length: []}
        data._base = {data: [], length: []}

        // Loop through 126 nibs (21 nibs from the 1st nibcol, 21 nibs from the 2nd nib col...)
        for (let i = 0; i < 126; i++) {
            let val = nibData[i]
            data._uncompr.data.push(val)
            data._uncompr.length.push(4)
            
            let val_uplf = val
            
            // Check up, and check 0 value for first row
            if ( 
                ((i % 21 == 0) && (val_uplf == 0)) ||             
                (getIndex(nibData, i - 1) == getIndex(nibData, i))
             ) {                                
                data._upleft.data.push(CMP_COMPR * 2 + CMP_UP)
                data._upleft.length.push(2)
            }

            // Check left (move one nibcol left)
            else if (getIndex(nibData, i - 21) == getIndex(nibData, i)){                
                data._upleft.data.push(CMP_COMPR * 2 + CMP_LF)
                data._upleft.length.push(2)
            }
            // Store without compression            
            else {
                data._upleft.data.push(val_uplf)
                data._upleft.length.push(5)
            }

            let val_base = val

            // Base value (0 or same as other sprite)
            if (getIndex(nibData, i) == 0) {
                data._base.data.push(CMP_BS)
                data._base.length.push(1)
            } 
            // Store full value
            else {
                data._base.data.push(val_base)
                data._base.length.push(5)
            }
        }

        return data

    }
    static compress(sprData) {
        /**
         * Compresses Header byte
         * 
         */

        // Get coded nibble data.        
        // _base, _uncompr and _upleft objects contain data and bit length.        
        let sprNibInfo = SpriteCompress.getNibInfo(sprData)
        

        // Sum product function.
        const sumProduct = (a, b) => a.reduce( (t, c, i) => t + c * b[i], 0)


        // Best method
        let [bestLength, bestMethod, bestMask] = [67, CMP_NONE, 0]

        let finalData
        let finalBitLen        

        // Try all masks
        for (let usefulMask = 0; usefulMask <= 0b111111; usefulMask++) {
            let [useful, ranges, nibNeeded] = SpriteCompress.getUseful(sprData, usefulMask)
            let headerLen = ranges.length

            let baseTotal =  Math.ceil(sumProduct(sprNibInfo._base.length, nibNeeded)/8) + headerLen
            let uncomprTotal = Math.ceil(sumProduct(sprNibInfo._uncompr.length, nibNeeded)/8) + headerLen
            let upleftTotal = Math.ceil(sumProduct(sprNibInfo._upleft.length, nibNeeded)/8) + headerLen
            
            let bestOfCurrent = Math.min(baseTotal, uncomprTotal, upleftTotal)

            if (bestOfCurrent < bestLength) {
                bestLength = bestOfCurrent
                bestMask = usefulMask                

                if      (bestOfCurrent == uncomprTotal) { 
                    bestMethod = CMP_NONE
                    finalData = sprNibInfo._uncompr.data
                    finalBitLen = sprNibInfo._uncompr.length
                }
                else if (bestOfCurrent == baseTotal)    { 
                    bestMethod = CMP_BASE
                    finalData = sprNibInfo._base.data
                    finalBitLen = sprNibInfo._base.length 
                }
                else if (bestOfCurrent == upleftTotal)  { 
                    bestMethod = CMP_UPLF
                    finalData = sprNibInfo._upleft.data
                    finalBitLen = sprNibInfo._upleft.length
                }
                
            }            
            
        }

        let compressed = new Bits()
        let [useful, ranges, nibNeeded] = SpriteCompress.getUseful(sprData, bestMask)

        compressed.add(2, bestMethod)
        compressed.add(6, bestMask)

        for (let i = 1; i < useful.length; i++) {            
            let [minRow, maxRow] = useful[i]
            compressed.add(4, minRow)
            compressed.add(4, maxRow)
        }

        for (let i = 0; i < 126; i++) {
            if (nibNeeded[i]) {
                let bitLen = finalBitLen[i]
                let bitVal = finalData[i]
                compressed.add(bitLen, bitVal)
            }
        }
                
        // Export object containing stats
        let comprInfo = {method: CMP_TEXT[bestMethod]}
        comprInfo.bestMask = bestMask
        comprInfo.ranges = ranges
        comprInfo.useful = useful
        comprInfo.compressed = compressed
        comprInfo.bitData = compressed.gitBitData()
        comprInfo.finalBitLen = finalBitLen
        comprInfo.nibNeeded = nibNeeded

        return [compressed.getBytes(), comprInfo]
    }

    static decompress(comprData) {
        /**
         * 
         */

        let compressed = new Bits(comprData)

        let comprMode = compressed.readBits(2, false)

        // Create nibble useful array from nibble mask
        let usefulMask = compressed.readBits(6, false)

        let [minRow, maxRow] = [0, 0]
        let nibNeeded = []
        
        for (let i = 0; i < 6; i++) {
            
            // If usefulMask bit is set, new values must be read for unused ranges
            if (usefulMask & 0x20) {
                minRow = compressed.readBits(4, false)
                maxRow = compressed.readBits(4, false)
            }

            let usefulRow = 21 - minRow - maxRow
            // console.log(minRow, usefulRow, maxRow)

            // Push 0s and 1s - 0s are not stored, 1s are stored.            
            for (let r = 0; r < minRow; r++) { nibNeeded.push(0) }
            for (let r = 0; r < usefulRow; r++) { nibNeeded.push(1) }
            for (let r = 0; r < maxRow; r++) { nibNeeded.push(0) }
                                    
            usefulMask <<= 1
        }
        
        

        let nibId = 0
        let nibData = []

        while (nibId < 126) {
            // Unused area
            if (!nibNeeded[nibId]) {
                nibData.push(0)
            } else 
            // Real data
            {
                if (comprMode == CMP_NONE) {
                    // console.log(`${nibId} - 4 bits uncompressed`)
                    nibData.push(compressed.readBits(4, false))
                } 
                else 
                // Compressed
                {
                    // Compression bit
                    if (compressed.readBits(1, false) == CMP_COMPR) {
                        // Compressed, BASE -> store 0
                        if (comprMode == CMP_BASE) {
                            // console.log(`${nibId} - base 0`)
                            nibData.push(0)
                        } else {
                            // Up
                            let val;

                            if (compressed.readBits(1, false) == CMP_UP) {                                
                                // First row: 0, otherwise value from above
                                val = (nibId % 21) ? nibData[nibId - 1] : 0
                                // console.log(`${nibId} - UP`)
                            } else
                            // Left
                            {
                                val = (nibId >= 21) ? nibData[nibId - 21] : 0
                                // console.log(`${nibId} - LEFT`)
                            }
                            nibData.push(val)
                        }
                    } else
                    // No compression, get 4 bits and store
                    {
                        // console.log(`${nibId} - 4 bits stored`)
                        nibData.push(compressed.readBits(4, false))
                    }
                }

            }

            nibId++;
        }
        
        let nibDataSorted = []
        for (let r = 0; r < 21; r++) {
            for (let c = 0; c < 6; c++) {
                let val = nibData[c * 21 + r]
                nibDataSorted.push(val)
            }
        }

        return Bits.getBytesFromFixedBits(nibDataSorted, 4)
    }
}