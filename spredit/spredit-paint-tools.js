/**
 * Functions for handling draw events.
 * 
 * getPixelCoordsFromEvent          Returns mouse coordinates (exact x, exact y, pixel x, pixel y)
 *
 * drawPaint                        Paints a single pixel.
 * drawCircle                       Filled or stroked circle/ellipse.
 * drawLine                         Draws a line.
 * undo                             Undo last draw event.
 * drawRect                         Filled or stroked rectangle.
 * 
 * toolStart                        Saves undo info, and records starting coordinate.
 * toolEnd                          Finishes drawing.
 * 
 * callerFunc                       Handles mouse events.
 */

function getPixelCoordsFromEvent(e, m){
    const bdRect = cv.getBoundingClientRect()
    const x = (e.clientX - bdRect.left)
    const y = (e.clientY - bdRect.top)

    let pixelX, pixelY
    
    pixelX = Math.floor((x) / 8 / 2) / m
    pixelY = Math.floor((y) / 8 / 2)

    return [x, y, pixelX, pixelY]
}

function drawPaint(e) {
    
    const [_x, _y, x, y] = getPixelCoordsFromEvent(e, sprAct.getParams().bpp)
                    
    sprAct.setPixel(x, y, drawColor)
    repaint = true
                
    showMap(grid)            
    repaintIcon(sprActNo)
}

function drawCircle(e, fill) {
    callerFunc.undoChange()

    const [exactX, exactY, px, py] = getPixelCoordsFromEvent(e, sprAct.getParams().bpp)
    
    const x0 = Math.min(px, callerFunc.startPX)
    let x1 = Math.max(px, callerFunc.startPX) + 0.5

    let y0 = Math.min(py, callerFunc.startPY)
    let y1 = Math.max(py, callerFunc.startPY) + 0.5

    let w = Math.round((x1 - x0) / 2)
    let h = Math.round((y1 - y0) / 2)
    
    let xc = x0 + w
    let yc = y0 + h

    let dr = Math.max(0.1, h/20)
    let dc = Math.max(0.1, w/20)
        
    for (let r = -h-1; r <= h+1; r += dr ) {
        for (let c = -w-1; c <= w+1; c += dc ) {
            let val = Math.floor((r * r / h / h + c * c / w / w) * 8) 
            if (((val == 8) && (!fill)) || ((val <= 8) && (fill))) {
                sprAct.setPixel(Math.floor(xc + c), Math.floor(yc + r), drawColor)    
            }
        }
    }    

    repaint = true                
    showMap(grid)        
}

function drawLine(e) {    
    callerFunc.undoChange()

    const [exactX, exactY, px, py] = getPixelCoordsFromEvent(e, sprAct.getParams().bpp)

    const x0 = Math.min(px, callerFunc.startPX)
    let x1 = Math.max(px, callerFunc.startPX) + 0.5

    let [y0, y1] = [py, callerFunc.startPY]

    if (x0 != px) {
        [y1, y0] = [py, callerFunc.startPY]
    }

    let dx = x1 - x0
    let dy = y1 - y0


    for (let c = x0; c <= x1; c += dx / 80) {
        let r = y1 + dy * (c - x1) / dx
        sprAct.setPixel(Math.floor(c), Math.floor(r), drawColor)    
    }        

    repaint = true                
    showMap(grid)                
}

function undo() {
    callerFunc.undoChange()
    fullRepaint();
}

function drawRect(e, fill) {
    callerFunc.undoChange()

    const [_x, _y, x, y] = getPixelCoordsFromEvent(e, sprAct.getParams().bpp)

    const x0 = Math.min(x, callerFunc.startPX)
    const x1 = Math.max(x, callerFunc.startPX)

    const y0 = Math.min(y, callerFunc.startPY)
    const y1 = Math.max(y, callerFunc.startPY)
    
    if (!fill) {
        for (let r = y0; r <= y1; r++) {
            sprAct.setPixel(x0, r, drawColor)    
            sprAct.setPixel(x1, r, drawColor)    
        }

        for (let c = x0; c <= x1; c++) {
            sprAct.setPixel(c, y0, drawColor)    
            sprAct.setPixel(c, y1, drawColor)    
        }
    }
    else {
        for (let r = y0; r <= y1; r++) {
            for (let c = x0; c <= x1; c++) {
                sprAct.setPixel(c, r, drawColor)                    
            }
        }
    }
    
    repaint = true
                
    showMap(grid)                
}

function toolStart(event) {
    [callerFunc.startX, callerFunc.startY, callerFunc.startPX, callerFunc.startPY] = getPixelCoordsFromEvent(event, sprAct.getParams().bpp)
    callerFunc.started = true
    console.log(`Started at ${[callerFunc.startPX, callerFunc.startPY]}`)

    callerFunc.saveUndo()
    
}

function toolEnd(event) {    
    callerFunc.started = false
    repaintIcon(sprActNo)
}


const cmdPaint = {
    click: (event) => drawPaint(event),
    mousedown: (event) => toolStart(event),
    mousemove:  (event) => { if (callerFunc.started) { drawPaint(event) } },    
}

const cmdRect = {
    click: (event) => null,
    mousedown: (event) => toolStart(event),
    mousemove: (event) => { if (callerFunc.started) { drawRect(event, false)}},
    mouseup: (event) => { callerFunc.started = false; }
}

const cmdLine = {
    click: (event) => null,
    mousedown: (event) => toolStart(event),
    mousemove: (event) => { if (callerFunc.started) { drawLine(event)}},
    mouseup: (event) => { callerFunc.started = false; }
}

const cmdRectFull = {
    click: (event) => null,
    mousedown: (event) => toolStart(event),
    mousemove: (event) => { if (callerFunc.started) { drawRect(event, true)}},    
}

const cmdCircle = {
    click: (event) => null,
    mousedown: (event) => toolStart(event),
    mousemove: (event) => { if (callerFunc.started) { drawCircle(event, false)}},    
}

const cmdCircleFull = {
    click: (event) => null,
    mousedown: (event) => toolStart(event),
    mousemove: (event) => { if (callerFunc.started) { drawCircle(event, true)}},    
}

var callerFunc = {
    click: (event) => tool.click(event),
    mousedown: (event) => tool.mousedown(event),
    mousemove: (event) => tool.mousemove(event),
    mouseup: (event) => toolEnd(event) ,
    
    undoChange: () => {
        for (let i = 0; i < 63; i++) {
            sprAct.data[i] = callerFunc.undoData[i]
        }
    },

    saveUndo: () => {
        if (!callerFunc.undoData) {
            callerFunc.undoData = Array(63).fill(0)
        }

        for (let i = 0; i < 63; i++) {
            callerFunc.undoData[i] = sprAct.data[i]
        }
    },

    undoData: null,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,

    startPX: 0,
    startPY: 0,
    endPX: 0,
    endPY: 0,

    started: false
}