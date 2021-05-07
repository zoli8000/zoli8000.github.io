"use strict";

class Bits {
    /**
     * Bit operations
     * 
     *      _bitArray           Array containing bytes
     *      _bitStr             String holding the whole binary data
     *      _bitsUsed           Used bytes
     *      _read               Read / write mode. No append mode!
     *      _bitPos             Current bit position
     */

    constructor(data = null) {
        /**
         * Usage:
         *      Bits()          Write mode
         *      Bits(bytes)     Read mode, use byte array
         */

        this._bitPos = 0
        
        if (data === null) {
            // Write mode
            this._bitArray = []
            this._bitsUsed = 0
            this._read = false
        } 
        else
        {
            // console.log(typeof(data))
            // Read mode - use an array of bytes
            this._read = true
            this._bitArray = data.map(v => [v.toString(2).padStart(8, '0')])
            this._bitStr = this.getStr()
            this._bitsUsed = data.length
            
        }
    }

    _assertRead(readMode) {

        // Currently in write mode, but read mode is needed
        if (readMode & !this._read) {            
            throw 'Bit reading is not possible during writing! Set mode to read only first!'            
        }

        // Currently in read mode, but write mode is needed
        else if (!readMode & this._read) {
            throw 'Bit writing is not possible during reading!'
        }
    }

    add(bitCount, bitVal) {
        /**
         * Adds bits to the container.
         * 
         * params:
         *      bitCount:       number of bits
         *      bitVal:         value to be stored
         */

        this._assertRead(false)
         
        let b = bitVal.toString(2)
        if (b.length > bitCount) {
            throw 'Invalid bit length!'
        }

        b = '0'.repeat(bitCount - b.length) + b

        this._bitArray.push(b)
        this._bitsUsed += b.length
    }
    
    trail() {
        /**
         * Trails the current data to whole bytes.
         */

        let trailing = 0
        if (this._bitsUsed % 8) {
            trailing = 8 - this._bitsUsed % 8
        }

        if (trailing) {
            this.add(trailing, 0)
        }
    }

    getStr() {
        let joined = this._bitArray.join('')
        
        // Trailing
        if (joined.length % 8) {
            joined += '0'.repeat(8 - joined.length % 8)
        }

        return joined
    }

    static getBytesFromStr(st) {
        /**
         * Returns an array containing the coded bytes from a binary string.
         */

        let bytes = Math.ceil(st.length / 8)
        let byteArr = []        

        for (let i = 0; i < bytes; i++) {
            let byteVal = Number('0b' + st.slice(i * 8, i * 8 + 8))
            byteArr.push(byteVal)
        }

        return byteArr

    }

    getBytes() {
        /**
         * Returns an array containing the coded bytes.
         */

        let joined = this.getStr()
        return Bits.getBytesFromStr(joined)
    }

    static getBytesFromFixedBits(arr, bitCount) {
        let newStr = ''
        
        for (let i = 0; i < arr.length; i++) {            
            newStr += (arr[i]).toString(2).padStart(bitCount, '0')
        }

        return Bits.getBytesFromStr(newStr)

    }

    gitBitData() {
        /**
         * Returns an array containing the coded bytes.
         */
         
         return this._bitArray
    }

    seek(bitPos) {
        /**
         * Sets bit position.
         * 
         * Params:
         *      bitPos:         bit position.
         */

        this._assertRead(true)

        this._bitPos = bitPos
    }

    readBits(bitCount, returnStr = true) {
        /**
         * Reads bits from the bit string.
         * 
         * Params:
         *      bitCount:       number of bits to read
         *      returnStr:      if true, returns a string, otherwise a number
         */

        this._assertRead(true)        

        let start = this._bitPos
        let end = this._bitPos + bitCount

        // Increases current position
        this._bitPos += bitCount

        // Gets the string and number format - returns only the one requested with formatStr param.
        let bitStr = this._bitStr.slice(start, end)
        let bitNum = Number(`0b${bitStr}`)

        // console.log(`Read ${bitCount} bits, value ${bitStr}`)
        return (returnStr) ? bitStr : bitNum
    }

    readBit(returnStr = true) {
        /**
         * Returns a single bit.
         * 
         * Params:         
         *      returnStr:      if true, returns a string, otherwise a number
         */

        return this.readBits(1, returnStr)
    }
}
