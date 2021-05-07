class Clipboard {
    constructor () {
        this._data = []
        this._width = 0
        this._height = 0
    }
    
    copy(data, width, height) {
        this._data = [...data]
        this._width = width
        this._height = height
    }

    getData() {
        return this._data
    }
}