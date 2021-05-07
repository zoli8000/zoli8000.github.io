"use strict";

function initProg() {
    /** 
     * Initialization.
     * 
     * Creates toggles, colors, sprite icons, commands and tooltips.
     */

    drawColor = 1
    moveState = false
    // command = cmdPaint

    clipb = new Clipboard()

    sprColors = [0, 1, 2, 3]
    createToggles()
    createColors()
    
    createSpriteList()
    createCommands()
    createLowerCommands()    
    
    addDataToolTips()
        
    spr = new Sprites();         

    stat = document.getElementById("raw-block")
            
    let cv = document.getElementById("cv")
    ctx = cv.getContext("2d")        

    createHatch()

    cv.style.cursor = "crosshair"; 

    chooseSprite(0)
    
    setToolEvents()
    setTool(cmdPaint)

    imgSprite = document.createElement("IMG")
}


function draw_box(x, y, st, pixelw, signed = 0) {
    /**
     * Draw one pixel of the sprite.
     * Also shows compression info.
     */

    ctx.fillStyle = st
    ctx.fillRect(x * pixelw + 1, y * 8 + 1, pixelw - 1, 7)            

    // Show compressed status.

    if (compr) {
        // 1 bit: green, 2 bits: yellow-green, 4: yellow 5: red
        let comprColors = [,"#0A0", "#8B2", , "#EE2", "#F44"]
        if (signed > 0) {
            ctx.fillStyle = comprColors[signed]
            ctx.strokeStyle = "#000"
            ctx.fillRect((x + 0.5)* pixelw + 1, y * 8 + 4, pixelw * 0.5 - 1, 3)
            ctx.strokeRect((x + 0.5)* pixelw + 0.5, y * 8 + 3.5, pixelw * 0.5 - 1, 3)
        }
    }

}

function codeRead() {
    let rawCode = stringToArray(stat.value)
                
    sprAct.data = rawCode
                     
    fullRepaint();    
}



function getCode() {
    let sprData = spr.getPacked(sprActNo)
    stat.value = arrayToString(sprData)
}

function showStats() {           
    /**
     * Show stats and byte data.
     */ 

    [comprData, comprInfo] = SpriteCompress.compress(sprAct.data)
    
    let comprText = document.getElementById("compr-text")
    comprText.innerHTML = `${comprInfo.method} - ${comprData.length} bytes - ${Math.ceil(comprData.length/63*100)}%`

    let comprBlock = document.getElementById("compr-block")
    
    comprBlock.value = arrayToString(comprData)    
 
    /* Test function - removed from final version.

    let n = SpriteCompress.decompress(comprData)
    for (let i = 0; i < 63; i++) {
        if (sprAct.data[i] != n[i]) {
            console.log(`Different value @${i}, ${sprAct.data[i]} != ${n[i]}`)
        }
    }
    */        
}

function showMap(grid) {            
    if (!repaint) return

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, 192, 168)

    ctx.strokeStyle = "#FFF"
    ctx.beginPath()
    ctx.strokeRect(0, 0, 192, 168)
    ctx.stroke()
    
    ctx.strokeStyle = "#777"
                
    let sprData = sprAct.getUnpacked()                        
    let params = sprAct.getParams()
    let cols = params.maxCol            
    
    showStats()
    let useful = comprInfo.useful
    let ranges = comprInfo.ranges

    // console.log(ranges)
    let pixelWidth = (sprAct.multi) ? 16 : 8

    if (grid) {
        for (let x = 0; x < cols; x++) {

            if (x % (params.ppb/2) == 0) {
                ctx.strokeStyle = "#FFF"
            }
            else {
                ctx.strokeStyle = "#777"
            }

            ctx.beginPath()
            ctx.moveTo(x * pixelWidth + .5 , .5)
            ctx.lineTo(x * pixelWidth + .5, 21 * 8 + .5)
            ctx.stroke()                
        }

        for (let y = 0; y < 21; y++) {
            ctx.beginPath() 
            ctx.moveTo(.5, y * 8 + .5)
            ctx.lineTo(cols * pixelWidth + .5, y * 8 + .5)
            ctx.stroke()                
        }            
    }            

    let boxId = 0
    for (let y=0; y < 21; y++) 
            for (let x=0; x < cols; x++) {
                let colorCode = sprColors[sprData[boxId]]
                let HTMLcolor = colors[colorCode]
                
                let comprSign = 0

                let adr = y + Math.floor(x * params.bpp / 4) * 21

                if (comprInfo.nibNeeded[adr]) {                            
                    comprSign = comprInfo.finalBitLen[adr]                            
                }

                draw_box(x, y, HTMLcolor, pixelWidth, comprSign)
                boxId++;                    
            }      

    // Show unused
    if (unused) {
        for (let c = 0; c < ranges.length - 1; c++) {
            let blanks = useful[c][0]
            let x = ranges[c]
            let w = ranges[c+1] - ranges[c]
                            
            ctx.fillStyle = hatchPattern
            ctx.fillRect(x * 8 * 4, 0, 8 * 4 * w, 8 * blanks)
            

            blanks = useful[c][1]
            ctx.fillRect(x * 8 * 4, 21 * 8  - 8 * blanks, 8 * 4 * w, 8 * blanks)
        }
    }
    
    repaint = false                                 
    getCode()    
    
}    

function setColor(c) {

    if (!multi && c > 1) {
        return
    }

    let button = document.getElementsByClassName('ink-button')[drawColor]
    button.innerHTML = "&nbsp;"
    
    drawColor = c
    button = document.getElementsByClassName('ink-button')[drawColor]
    button.innerHTML = "&#x2B1B;"
    
}

function createColors() {

    let holder = document.getElementById('color-list')
    for (let i = 0; i < 16; i++) {
        let citem = document.createElement("LI");
        citem.style.backgroundColor = colors[i]
        citem.addEventListener("click", ()=>chooseColor(i));
        holder.appendChild(citem)

        if (i==7) {
            let div = document.createElement("BR")
            holder.appendChild(div)
        }
        
    }
}

function _addToggle(labelName, varName, func, defaultValue = false) {
    let holder = document.getElementById('options')
    let item = document.createElement('INPUT')

    // Add checkbox
    item.setAttribute("type", "checkbox");
    item.checked = defaultValue
    item.setAttribute("id", varName);
    item.varName = varName
    item.addEventListener("change", ()=>func(item));

    holder.appendChild(item)

    // Add label
    let label = document.createElement("LABEL");
    label.setAttribute("for", varName);
    label.innerHTML = labelName;
    holder.appendChild(label);

    window[varName] = defaultValue
}

function _toggle(v, t) {
    // console.log(`Toggling ${v}...`)
    window[v] = t.checked
    
    fullRepaint();
}

function createToggles() {
    /*
    <input type="checkbox" name="grid" id="grid" onchange="gridToggle(this)" checked/>
    <label for "grid">Grid</label>
    */

    _addToggle('Grid', 'grid', (t)=>_toggle('grid', t), true)
    _addToggle('Multicolor', 'multi', multiToggle, false)
    _addToggle('Compression', 'compr', (t)=>_toggle('compr', t), false)
    _addToggle('Unused area', 'unused', (t)=>_toggle('unused', t), false)
    
    _addToggle('Use $', 'dollarUse', (t)=>_toggle('dollarUse', t), true)
    _addToggle('Use XORed', 'xoredUse', (t)=>_toggle('xoredUse', t), true)

}

function multiToggle(t) {
    /**
     * Special function for toggling multicolor sprites.
     * If number is not available, 
     */

    multiSet(t.checked)    
}

function multiSet(isMulti) {
    if (!isMulti && drawColor > 1) {
        setColor(1)
    }

    let button = document.getElementsByClassName('ink-button')

    for (let i = 2; i < 4; i++) {
        button[i].style.visibility = (isMulti) ? "visible" : "hidden"
    }

    let t = document.getElementById("multi")
    
    spr.getSprite(sprActNo).multi = isMulti
    _toggle('multi', t)
}

function _addCommand(cmdName, toolTip, func) {
    let holder = document.getElementById("command-wrapper")
        
    let button = document.createElement("div")
    button.setAttribute("class", "command-button")
    
    func.element = button    
    button.innerHTML = cmdName    
    
    button.addEventListener("click", () => setTool(func))
    button.addEventListener('mouseenter', (event) => setToolTip(toolTip, event))
    button.addEventListener('mouseout', () => setToolTip(''))

    holder.appendChild(button)
}

function createCommands() {        
    _addCommand('🖉', 'Paint', cmdPaint)
    _addCommand('▯', 'Rectangle', cmdRect)
    _addCommand('▮', 'Rect full', cmdRectFull)     
    _addCommand('◯', 'Circle', cmdCircle)
    _addCommand('⬤', 'Circle full', cmdCircleFull)
    _addCommand('⟍', 'Line', cmdLine)
    _addCommand('▨', 'Select', cmdSelect)    
    _addCommand('⎌', 'Undo', undo)
}

function setTool(toolObj) {
    // Define first
    if (!tool) {
        tool = toolObj
    }

    if (toolObj === undo) {
        undo()
    } else {
        tool.element.style.backgroundColor = "#000"
        tool = toolObj
        tool.element.style.backgroundColor = "#444"
    }
}

function setToolEvents() {
    let canv = document.getElementById("cv")

    canv.addEventListener("click", callerFunc.click)
    canv.addEventListener("mousedown", callerFunc.mousedown)
    canv.addEventListener("mousemove", callerFunc.mousemove)
    canv.addEventListener("mouseup", callerFunc.mouseup)
}

function createSpriteList() {
    let holder = document.getElementById('sprite-list')

    for (let i = 0; i < 256; i++) {
        let citem = document.createElement("canvas")
        citem.width = 24
        citem.height = 21
        citem.addEventListener("click", ()=>chooseSprite(i))
                
        let toolTip = `${numToHex(i)}`
        citem.addEventListener('mouseenter', (event) => setToolTip(toolTip, event))
        citem.addEventListener('mouseout', () => setToolTip(''))
        
        if (i % 8 == 0) {
            let infoItem = document.createElement("SPAN")
            infoItem.innerHTML = `${Number(i).toString(16).padStart(2, '0').toUpperCase()}`            

            holder.appendChild(infoItem)
        }

        holder.appendChild(citem)

        if (i % 8 == 7) {
            let div = document.createElement("BR")
            holder.appendChild(div)
        }
        
    }
}

function _createLower(toolTip, className, text = "", func = 0) {
    let holder = document.getElementById('button-wrapper')

    let item = document.createElement('DIV')

    if (toolTip != 'Div') {        
        item.setAttribute('class', className)
        item.innerHTML = text    

        item.addEventListener('click', func)
        item.addEventListener('mouseenter', (event) => setToolTip(toolTip, event))
        item.addEventListener('mouseout', () => setToolTip(''))
    }

    holder.appendChild(item)
}

function setToolTip(txt, e) {    
    let tooltip = document.getElementById('tooltip')    
    tooltip.style.visibility = "visible"
    tooltip.style.width = Math.ceil(txt.length*0.7)+"em"
    tooltip.innerHTML = txt    
    
    if (txt != '') {
        tooltip.style.left = (e.clientX-30)+"px"
        tooltip.style.top = (e.clientY-30)+"px"
    }    
}

function createLowerCommands() {
    _createLower('Background', 'ink-button', '&nbsp;', () => setColor(0))
    _createLower('Color 1', 'ink-button', '&#x2B1B;', () => setColor(1))
    _createLower('Color 2', 'ink-button', '&nbsp;', () => setColor(2))
    _createLower('Color 3', 'ink-button', '&nbsp;', () => setColor(3))

    _createLower('Div')
    
    _createLower('Scroll left', 'movement-button', '🡄', () => scrollImage(TRANSFORM.LEFT))
    _createLower('Scroll up', 'movement-button','🡅', () => scrollImage(TRANSFORM.UP))
    _createLower('Scroll down', 'movement-button','🡇', () => scrollImage(TRANSFORM.DOWN))
    _createLower('Scroll right', 'movement-button','🡆', () => scrollImage(TRANSFORM.RIGHT))            

    _createLower('Mirror vertical', 'movement-button','⬍', () => scrollImage(TRANSFORM.MIRR_VERT))
    _createLower('Mirror horizontal', 'movement-button','⬌', () => scrollImage(TRANSFORM.MIRR_HOR))
    
    _createLower('Div')

    _createLower('Rotate 90', 'movement-button','⮮', () => rotateImage(1))
    _createLower('Rotate 180', 'movement-button','⮏', () => rotateImage(2))
    _createLower('Rotate 270', 'movement-button','⮯', () => rotateImage(3))
    
    _createLower('Copy', 'movement-button','○⇥', copyToClipb)
    _createLower('Paste', 'movement-button','↦○', pasteFromClipb)
    

    let button = document.getElementsByClassName('ink-button')
    for (let i = 0; i < 4; i++) {
        button[i].style.backgroundColor = colors[i]
    }
}

function chooseColor(i) {
    sprColors[drawColor] = i
    
    let button = document.getElementsByClassName('ink-button')[drawColor]
    button.style.backgroundColor = colors[i]
        
    fullRepaint();
}


function addDataToolTips() {
    let items = document.getElementsByClassName("io-item")
    let toolTip = ["Load file", "Download", "Xor current image"]

    for (let i = 0; i < 3; i++) {
        let item = items[i]
        item.addEventListener('mouseenter', (event) => setToolTip(toolTip[i], event))
        item.addEventListener('mouseout', () => setToolTip(''))
    }
}


function fullRepaint() {
    repaint = true;
    showMap(grid);
    repaintIcon(sprActNo);
}

function repaintIcon(sprId) {
    let cvItem = document.getElementById('sprite-list').getElementsByTagName('canvas')[sprId]    

    let cvCtx = cvItem.getContext('2d');
    spr.putIcon(sprId, cvCtx, 0, 0)
}