class Undo {
    constructor() {
        this.data = Array(256).fill(undefined)
    }
    
    load(destArr, id) {
        if (!this.data[id]) return

        const next = this.data[id].length
        if (!next) return

        for (let i = 0; i < 63; i++) {
            destArr[i] = this.data[id][next-1][i]
        }

        this.data[id].pop()
    }

    save(srcArr, id) {        
        if (!this.data[id]) {
            this.data[id] = []
        }

        let srcData = [...srcArr]        

        this.data[id].push(srcData)
        
    }
}