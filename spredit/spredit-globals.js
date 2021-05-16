"use strict";

var spr;                // Sprite collection
var sprAct;             // Active sprite
var sprActNo;           // Active sprite number

var sprXored;           // Active sprite xored status
var sprXorBase;         // Xor base sprite

var hatchPattern;       // Hatch pattern
var ctx;                // Canvas context

var drawColor;          // Drawing color
var moveState;          // Move or not

var comprData;          // Actual compressed data
var comprInfo;          // Actual compressed info
var command;            // Axtive command functions

var imgSprite;          // Image containing sprites (for I/O)

var clipb;              // Clipboard
var undoFn;             // Undo functions

// Options
var compr;              // Show compression data
var unused;             // Show unused blocks
var grid;               // Show grid
var multi;              // Multicolor
var dollarUse;          // Use $ for hex. If false, use decimal numbers.
var xoredUse;           // Use xored sprites if possible.

var stat;               // Stat block

var tool;               // Tool object to be used on canvas

var draw;
var repaint;

var sprColors;          // Sprite colors
// 12*6 blocks       

// C64 color codes
let colors = 
        [   "#000", "#FFF", "#954", "#8CC", "#95B", "#7B5", "#43A", "#DD7",
            "#963", "#650", "#B87", "#666", "#888", "#AE9", "#87D", "#BBB" ]