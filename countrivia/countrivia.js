// var countryData = null                // Countries of the world
// var possibleItems = null              // Possible data items
// var puzzleData                        // Puzzle data

const EMPTY = '.'
const SIZE = 12
const USABLE_WORDS = 40
const PUZZLE_TRIES = 5

// Fetch data from Rest Countries API

fetch('https://restcountries.eu/rest/v2/all')
    .then( (resp) => resp.json() )
    .then( (data) => startGame(data) )             
    .catch( (err) => console.error(err) )
        
class Clues {
    constructor(countryData) {
        this._cd = countryData

        this.clueTemplates = {
                'country': [ 
                    ['A country in {subregion}, with a population of {population}.', [this.getSubRegion, this.getPopulation]],
                    ['Its capital city is {capital}.', [this.getCapital]],
                    ['This country is a member of {regionalblock}.', [this.getBlock]],
                    ['A country bordered by {borders}.', [this.getBorders]]
                ],
                'capital': [
                    ['The capital of {country}.', [this.getCountry]],
                    ['A capital in {subregion} region, rhymes with {capital_rhyme}.', [this.getSubRegion, this.capitalRhyme]], 
                    ['A capital adjacent to {neighborCapital}.', [this.getNeighborCapital]]
                ],
                'currency': [
                    ['The currency of {country}.', [this.getCountry]],
                    ['The currency used in {capital}.', [this.getCapital]]
                ],
            
                'code': [
                    ['The 3 letter country code of a member of {regionalblock}.', [this.getBlock]],
                    ['The 3 letter country code of a country in {subregion} region, with a population of {population}.', [this.getSubRegion, this.getPopulation]]
                ]
            }
        
    }

    getCountry(obj, id) { return obj._cd[id].name }
    getCapital(obj, id) { return obj._cd[id].capital }
    getSubRegion(obj, id) { return obj._cd[id].subregion }
    getNeighborCapital(obj, id) { 
        if (obj._cd[id].borders.length < 2) return undefined

        let country1 = obj.getObjFromAlpha3(obj._cd[id].borders[0]).capital
        let country2 = obj.getObjFromAlpha3(obj._cd[id].borders[1]).capital

        if (!country1 || !country2) return undefined
        return `${country1} </span> and <span> ${country2}` // ToDo
    } 

    async capitalRhyme(obj, id) {
        let capital = obj._cd[id].capital 
        const response = await fetch(`https://rhymebrain.com/talk?function=getRhymes&word=${capital}`);
        const rhymes = await response.json();

        const bestRhyme = rhymes[0].word
        return bestRhyme
    }

    getPopulation(obj, id) {

        const prec2 = num => parseFloat((num).toPrecision(2))

        let pop = obj._cd[id].population 
        
        if (pop < 1000) { return pop }
        if (pop < 10000) { return `${prec2(pop/1000)}00`}
        if (pop < 1000000) { return `${prec2(pop/1000)} 000`}
        if (pop < 1000000000) { return `${prec2(pop/1000000)} million`}
        if (pop < 1000000000) { return `${prec2(pop/1000000000)} billion`}
        
    }

    getBlock(obj, id) {
        // ToDo
        if (obj._cd[id].regionalBlocs.length) {
            return obj._cd[id].regionalBlocs[0].acronym + " ("+obj._cd[id].regionalBlocs[0].name + ")"
        }
        return undefined
    }

    getBorders(obj, id) {
        if (obj._cd[id].borders.length < 2) return undefined

        let country1 = obj.getObjFromAlpha3(obj._cd[id].borders[0]).name
        let country2 = obj.getObjFromAlpha3(obj._cd[id].borders[1]).name

        if (!country1 || !country2) return undefined
        return `${country1} </span> and <span> ${country2}` // ToDo
    }

    getObjFromAlpha3(alpha) {

        return this._cd[this._cd._alpha3[alpha]]
    } 

    getClue(solutionType, id) {
        let goodClue = false
        let clue

        while (!goodClue) {
            let rnd = Math.floor(Math.random()*this.clueTemplates[solutionType].length)
            let clueObj = this.clueTemplates[solutionType][rnd]

            clue = clueObj[0]
            let clueFuncs = clueObj[1]
        
            goodClue = true

            clueFuncs.forEach( (clueResult) => {
                let cr = clueResult(this, id)
                
                if (!cr) goodClue = false

                let result = `<span>${cr}</span>`
                clue = clue.replace(/[{].*?[}]/, result)
            })    
            
        }

        return clue
    }    
}

class PuzzleItems {
    constructor(countryData) {
        this._cd = countryData
        this._possibleItems = []
    }

    addIfValid(text, countryId, countryField) {
        /* Tries to add one words to the word list */
        let textNorm = normalize(text)
        
        if (!textNorm) return false
        if (textNorm.length > 10) return false
    
        let dataItem = {}
        dataItem.text = textNorm
        dataItem.countryId = countryId
        dataItem.countryField = countryField        
        
        this._possibleItems.push(dataItem)
        return true
    }
    
    addAllValid() {
        /* Adds all valid words to the word list */

        this._cd._alpha3 = {}

        for (let i = 0; i < this._cd.length; i++) {
            this.addIfValid(this._cd[i].name, i, 'country')
            this.addIfValid(this._cd[i].capital, i, 'capital')
            this.addIfValid(this._cd[i].alpha3Code, i, 'code')                

            this._cd._alpha3[this._cd[i].alpha3Code] = i
    
            let curr = this._cd[i].currencies[0].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/\w+$/g)
            if (curr) this.addIfValid(curr[0], i, 'currency')         
        }
    }

}

class Puzzle {
    constructor(countryData) {
        this.crossWordData = null
        this.clear()
        
        this._piObj = new PuzzleItems(countryData)
        this._piObj.addAllValid()
        this._pi = this._piObj._possibleItems
    }

    clear() {
        /* Clears the whole crossword */
        this.crossWordData = Array(SIZE*SIZE).fill(EMPTY)
    }

    save() {
        this._cwdata_backup = [...this.crossWordData]
    }

    restore() {
        this.crossWordData = [...this._cwdata_backup]
    }

    setLetter(x, y, ch) {
        /* Sets one letter at coords x,y */
        if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return false
    
        if (this.getLetter(x, y) != EMPTY && this.getLetter(x, y) != ch) return false
        this.crossWordData[x + y*SIZE] = ch
        return true
    }
    
    getLetter(x, y) {
        /* Gets one letter from coords x,y */
        if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return EMPTY
        return this.crossWordData[x + y*SIZE]        
    }

    addWord(word, x, y, horizontal) {
        /** 
         * Tries to add a word at positions x,y in a given direction. 
         * 
         * Returns a score (0 for fail), rating the position
         * */ 
        

        let vertical = !horizontal
        let tempCrossWord = [...this.crossWordData]
        let wordScore = 0        
        
        if (horizontal) {
            if (this.getLetter(x-1, y) != EMPTY || this.getLetter(x + word.length, y) != EMPTY) return 0
        } else 
        {
            if (this.getLetter(x, y-1) != EMPTY || this.getLetter(x, y + word.length) != EMPTY) return 0
        }
    
        for (let i = 0; i < word.length; i++) {
            let added
    
            // Empty, check neighbors
            let x2 = x + i*horizontal
            let y2 = y + i*vertical
    
            if (this.getLetter(x2, y2) != word[i]) {
                if (this.getLetter(x2 - vertical, y2 - horizontal) != EMPTY || 
                    this.getLetter(x2 + vertical, y2 + horizontal) != EMPTY) 
                {
                    this.crossWordData = [...tempCrossWord]
                    return 0
                }                
            } else { wordScore +=2 }
    
            added = this.setLetter(x2, y2, word[i])        
            
            if (!added) {
                // Undo, try something else
                this.crossWordData = [...tempCrossWord]
                return 0
            }
            
            wordScore += .5
        }
            
        return wordScore
    }
    
    drawOnDocument() {
        /* Draw letters from crossWordData on document */

        let cw = document.getElementById("crossword").querySelectorAll("div")
    
        for (let i = 0; i < SIZE*SIZE; i++) {
            let letterItem = cw[i]
            let letter = this.crossWordData[i]
    
            if (letter == EMPTY) { letterItem.style.background = "#000" }
            else { letterItem.innerHTML = letter }
        }
    }
    
    randomizeWords() {
        let puzzleWords = []
        let puzzleData = {}

        for (let i = 0; i < USABLE_WORDS; i++) {
            let newWord = false
    
            while (!newWord) {
                let randomId = Math.floor(Math.random() * this._pi.length)
    
                let randomData = this._pi[randomId]            
                let wordItem = randomData.text
        
                if (!(puzzleWords.includes(wordItem))) {
                    puzzleWords.push(wordItem)
                    newWord = true  
                    puzzleData[wordItem] = randomData
                }  else {
                    // console.log(`Already in list: ${wordItem}`)
                }           
            }        
        }    
    
        this.puzzleWords = puzzleWords.sort((a,b) => a.length < b.length)    
        this.puzzleData = puzzleData
    }

    create() {        
        let score = 0
    
        let puzzleScore  = 1
        let solutions = {}
    
        // Get 40 random words
        this.randomizeWords()

        // First word is long one, and will be put in row index 8.

        let firstWord = this.puzzleWords[Math.floor(Math.random()*5)]
        this.addWord(firstWord, 1, 8, true)
        solutions[firstWord] = {x: 1, y: 8, dir: 1}
    
        // Add 9 other words
        for (let randomId = 0; randomId < 9; randomId++) {        
            let wordId = 0
            if (randomId < 2) wordId = 5 + randomId
            else if (randomId < 5) wordId = 13 + randomId
            else wordId = 31 + randomId
            
            let placedScore = 0
            let bestPlace = 0        
            let bestCrossWord      
            let bestX = -1
            let bestY = -1
            let bestDir = -1
    
            bestCrossWord = this.crossWordData
                            
            for (let x = 0; x < SIZE-3; x++) {
                for (let y = 0; y < SIZE-3; y++) {
                    for (let dir = 0; dir < 2; dir++) {
                        this.save()
    
                        placedScore = this.addWord(this.puzzleWords[wordId], x, y, dir)
                        if (placedScore > bestPlace) {
                            bestPlace = placedScore
                            bestCrossWord = [...this.crossWordData]    
                            bestX = x
                            bestY = y      
                            bestDir = dir      
                        } 
                        
                        this.restore()                                
                    }        
                }
            }
                
                    
            if (bestPlace > 0) {            
                puzzleScore += bestPlace
                solutions[this.puzzleWords[wordId]] = {x: bestX, y: bestY, dir: bestDir}
                // console.log(`Added ${puzzleWords[i]} at ${bestX}, ${bestY}, score ${bestPlace}`)
            }
    
            this.crossWordData = [...bestCrossWord]
        }
          
        return [puzzleScore, solutions]
    
    }

    createBest(tries) {
        let bestScore = 0
        let bestPuzzle = []
        let bestCW
        let bestSolution

        this.coords = new Set()
    
        for (let i = 0; i < tries; i++) {
            let [tempScore, solutions] = this.create()
            console.log(`Puzzle ${i} - score: ${tempScore}`)
    
            if (tempScore > bestScore) {
                bestScore = tempScore
                bestPuzzle = {...this.puzzleData}
                bestCW = [...this.crossWordData]
                bestSolution = {...solutions}
            }
        }
        
        this.puzzleData = bestPuzzle
        this.crossWordData = [...bestCW]
        this.solution = bestSolution

        console.log(`Best score: ${bestScore}, lines: ${bestSolution.length}`)

        
        for (const k in bestSolution) {
            let index = bestSolution[k].x + bestSolution[k].y*SIZE
                    
            this.coords.add(index)
        }

        this.coords = [...this.coords].sort((a, b) => a-b)
    }
}

function normalize(str) {
    /* Remove/change special characters */
    if (!str) return undefined

    let normStr = str.toUpperCase()
    normStr = normStr.replace(/(,.*$)|([(].*$)/gi, '')
    normStr = normStr.replace(/[ \-,.']+/gi, '')
    normStr = normStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    return normStr
}



function createView() {
    /* Renders divs (letter containers) on document */

    let parent = document.getElementById("crossword")
    for (let i = 0; i < SIZE*SIZE; i++) {
        let child = document.createElement("div")        
        parent.appendChild(child)

        if (i % SIZE == SIZE-1) {
            let br = document.createElement("br")
            parent.appendChild(br)
        }
    }
}



function startGame(countryData) {
    
    clues = new Clues(countryData)
    puzzle = new Puzzle(countryData)
    
    createView()
    
    puzzle.createBest(PUZZLE_TRIES)

    puzzle.drawOnDocument()    
    

    /* Clue box */
    let clueDiv = document.getElementById("clue-div")
    let clueText= ""
    for (const k in puzzle.solution) {
        clueText += "<p>" + clues.getClue(puzzle.puzzleData[k].countryField, puzzle.puzzleData[k].countryId) + "</p>"
    }   
    clueDiv.innerHTML = clueText

    let cw = document.getElementById("crossword").querySelectorAll("div")
    for (let i = 0; i < puzzle.coords.length; i++) {
        let index = puzzle.coords[i]
        cw[index].innerHTML = "<span>"+(i+1)+"</span>"+cw[index].innerHTML
    }

    
    // for (let i = 0; i < )
}
