/* ToDo
	Feketénél rossz javaslatok: fekete után barna */

var selectedFont = EGAF8x16Font;

const toolArrow = 0;
const toolPicker = 1;

var screenArray=[];  	/* a kép pontjai és színei*/			

var pixelContext;		/* canvas context for pixel paint */
var pixel;				/* pixel image header */
var pixelData=[];		/* image data */

var imageContext;		/* canvas context for assisting image */		
var imMap;				/* assist image header */
var imMapData=[];		/* image data */
var imWidth;
var imHeight;

var gridContext;		/* canvas context for grid */

var font;				/* font image header */
var fontData=[];		/* font image data */
var cMap;

var paintBgc;
var paintFgc;

var img;
var avgErr;

var xCoord;
var yCoord;

var xSize;
var ySize;

var selectedTool = toolArrow;

var numMenu;

var numChars=[];

var logoAnsi='dUMb:04DBeEC4B2c41fE6kEEcoc4eI1EeQc46EB2eE2c4E2cksE2Ac8qE02DBc8f022AB23c4A3csc4315FmEB3B21BDFmEB1gC93kE39B21c49eYhE01DBc8nUfE5kEDcgfEeMuE4gECccjEi7ahEi82h86k02-1R8W6Acwe7615F1ADgE2eE5E1A6090B198gE1F5FgEDC_164g0qf16e1ee7mc8Du7uc4e925e96-438Wf8ae7iEh7iA5Ek72k62F15EF560CFDB0_1V4F45F4FDfE6CB24FfQCeEq9ef96g9a119DF-2F8W-11QO4m7qEi7mk7es5i27m5euEi2mi6usE60g16mEg0yF460-14ACm8uiiqeii1DDFu82-218WCB2g7qDfm2i2yq3qg5u5En5iC-1268e6mqE-1WIWtEF0F20gEDF1F1Eg522fu6f8i-208WegeCDF6^4144fg6s56q7u-2J6W_1V4270C5Ffk2CB20CDCfEh8i0FFo8i5DF-1G8W8egmCeaqe7uF8w7ufoy0g7u27-4A8KhgqC20e7mq6in6ul8i^C118e6q5Clg6-0R8Wg7y5FF1w6yexigwi1-0RXC_0W4exikE-2G8OF05epe706DCC6s6et86hqqkw2^C10Se76#0S1HC1C27uxqowe22#0S170uEF45EfEC60gE^9198fiu-2HHG62060276Ec8EDCECB1Cc8^41IOw82e9i#0Q1A4^41T4m8am82^41AGygqspqDF^41GGiE-15EO85F8^610W^510SccBF75FF82C3e1m3eMf0a-1NHGD60F5E065F26B2EeECB1rE4B26e7utgq-0R90Dh8aEm8614DDcs^91OCx82jiaqE-0WG8e9i52B28^42GO8c8e5q6B1FCc44B1785DF860^42GKfE^42G6c83F60e8u-1CHGepimgqp7yf82e8y06fte6F0#191S4g8a4DEf6a7^619O-0W1K4FDDc4foe4F10m82^C18G6^424WlEgy2DCe82fE3k2ae7ueEiQk7yDE4Bh8igQfi2eiqhEBeIeiaeYfgq1DCeE682016DF8EsEeheg7yDF08DC07D5e1a-18KGr86920eQ#0Y1WGaifmk82kgqe56icmede^92I4FDEf5yi86ea2822fh2eE4c48^629Ki7ue86c4Djhi^42Z0FB287B170gE38B2iE01DE^82PWeE8e5i7DEE8cc^41O8cg61B1e82eIey68FA9eY96-0YFWmE9eEm86^71RGF9A9-0ZHWf82qpi8F5EE5g82^41D4^D2R0t86faeipyl4mi7uqh2iUe62e7qi86iI18ge27c4ebueIe56fc28DFe7ieE08DDeIcwe32fMeEF8-0Y70yh2-17ZKj82epi^C1OSe6ym7umEh86Di86^A1A8k86iUjgqhq6lE1e5me1afgm8DD^417K^51GC8eoygmii8a1ckf5m6DEfpi8DEi7muEica-11HS^71QK^C18G4C201Cf8avs2^41YSj0iewm^C18C82e86B8EDEr86^52086048DE^818C^91QSlh2cw^5124e1ae7mp82egyfk28F10fguc4foi^B17K^93GOhEeq2^615K^61GCipieqe^412Seh6-1C8W1F27e1uC110^M1Z4^52XK^429Ox82epqiE^6348F41^516Ofyuhq2fm6e7e^517Keuq27^61H4f9e^516Sfh26^51H8F871fY^417SB8B13F5eM^41QSCF8^81B0c88DEe8263B1fba^C1G8^432W6DCf7u1^517KEeheF8j3qDeyae7yckgu2ewyckeE#0S18OF^42X4F5Efgu1F8#0T3PC1601C^53NGFF87E^415O^C1ES#1X2E07g1i^8284es6F7^A3I4sE100E2c45F0E6c8DFfb2^C1P0^81GCF^42UO#121XS-0ZZ0eEfs294B1^G2PW#0S3Y8fheh8emhi#1Y3WCD6^81QW#0Z38WD00c8lgmccCgEg8ie7y^61P4eia5FF0-0SB0-0Z4Gfgmk7yD^C3FGkE2#10474ghieqmc8ehm1#162GG#0Q1AKermeru^C2YW^518K^K3ECe7eopeiEepeE^D3O0-1LHGi7ue5q^53YS5DC^D3PC-1J8W^52KGhxm1EDCfEF2f8i-24IK^7474pf227ggy60e7me2yf7qEnp6-1H8Kk7qD^53FO^747CC#144FW-1G8W^C4OWEehqh8m^747Oj3a-1GIS^81AW^B30WD0120f86eEeMh7uF0#1A3SGm7m^816W^54Z05^546Og7u#1B4OS-1S8W0EDcp^E56OCAB21ADCgE^6540iriq92iE^F21W^84PCe3mg86^63DGCuxmm1aq22e2m^C4XK0^B56S#1W4XO-2C8W^85OC^C5OG^45NSeE12DCjEl96j9aA^62KO^414G4e8u1^73LC^72LCiE^42FBi6y_194#275FG-1S8W#0R5OGn86lE2^75XCoY^75XCeE^52GQeE^6284sE^J5XCt7m^42Z4^42W4-2O8W^51Q8';

const currentCh = function() { return screenArray[(yCoord*xSize+xCoord)*2+1] };
const currentBg = function() { return ~~(screenArray[(yCoord*xSize+xCoord)*2]/16) };
const currentFg = function() { return (screenArray[(yCoord*xSize+xCoord)*2]%16) };

const getScreenValue = function(x, y) { 
	if ((x<0) || (y<0) || (x>=xSize) || (y>=ySize)) { return -1;}
	return screenArray[(y*xSize+x)*2]*256+ screenArray[(y*xSize+x)*2+1];
}

const setScreenValue = function(x, y, n) { 	
	screenArray[(y*xSize+x)*2]=~~(n/256);
	screenArray[(y*xSize+x)*2+1]=n%256;
}

function getContexts() {			
	pixelContext = $('#p-pixel')[0].getContext('2d');
	imageContext = $('#p-image')[0].getContext('2d');
	gridContext = $('#p-grid')[0].getContext('2d');
	
	pixelContext.width=imWidth;
	pixelContext.height=imHeight;
	
	gridContext.width=imWidth;
	gridContext.height=imHeight;
}

function drawMapping() {			
	pixel = pixelContext.getImageData(0, 0, imWidth, imHeight);
	pixelContext.clearRect(0, 0, imWidth, imHeight);
	pixelData = pixel.data;
	
	imMap = imageContext.getImageData(0, 0, imWidth, imHeight);
	imageContext.clearRect(0, 0, imWidth, imHeight);
	imMapData = imMap.data;
	
	for (var i=0; i<selectedFont.colorMap.length*2; i++) {
		var it=selectedFont.colorMap[~~(i/2)];
		selectedFont.drawAnsiChar((i%80), (~~(i/80)), it[mEn.ch], it[mEn.bgc], it[mEn.fgc], imWidth, pixelData);
		selectedFont.drawAnsiChar((i%80), (~~(i/80)), 32, [it[mEn.colR], it[mEn.colG], it[mEn.colB]], 0, imWidth, imMapData);
	}
				
	pixelContext.putImageData(pixel, 0, 0);
	imageContext.putImageData(imMap, 0, 0);

}
function cacheImageBlock(x, y) {
	var a=[];
	var ac=0;
	
	for (var yc=0; yc<selectedFont.fontHeight; yc++) {
		for (var xc=0; xc<selectedFont.fontWidth; xc++) {		
			var ind=(x*selectedFont.fontWidth+xc)*4+(y*selectedFont.fontHeight+yc)*imWidth*4;
			a[ac++]=imMapData[ind++];
			a[ac++]=imMapData[ind++];
			a[ac++]=imMapData[ind++];
			ind++;
		}
	}	
	return a;
}

function getColorResults(cB, itemsF=0, itemsT=1) {	
	var pixelR=0;
	var pixelG=0;
	var pixelB=0;
	var errArr=[];				
	var i=0;
	
	while (i<cB.length) {
		pixelR+=Math.pow(cB[i++],2);
		pixelG+=Math.pow(cB[i++],2);
		pixelB+=Math.pow(cB[i++],2);		
	}

	pixelR=Math.sqrt(pixelR/(selectedFont.fontSize));
	pixelG=Math.sqrt(pixelG/(selectedFont.fontSize));
	pixelB=Math.sqrt(pixelB/(selectedFont.fontSize));
	
	$("#imageinf").html("#"+pixelR+","+pixelG+","+pixelB);
	maxErr=999999999;
	var errArr=[];			
	var itCount=0;	
	
	for (var i=itemsF; i<=itemsT; i++)
	{
		errArr[i]=[];
		errArr[i][0]=maxErr;				
		errArr[i][1]=0;
		errArr[i][2]=0;
		errArr[i][3]=0;
		errArr[i][4]=0;
		errArr[i][5]=0;
	}
	
	for (var i=0; i<cMap.length; i++) {
		var it=cMap[i];		
		var curErr=~~(Math.sqrt(  Math.pow(it[mEn.colR]-pixelR,2) +   Math.pow(it[mEn.colG]-pixelG,2)  +  Math.pow(it[mEn.colB]-pixelB,2))											  
					* it[mEn.errormulti]);
		
		if ((curErr<maxErr) || (itCount<itemsT-itemsF)){
			//minErr=curErr;
			errArr[itemsT][0]=curErr;
			errArr[itemsT][1]=it[mEn.ch];
			errArr[itemsT][2]=it[mEn.bgc];
			errArr[itemsT][3]=it[mEn.fgc];			
			errArr[itemsT][4]=i;
			errArr[itemsT][5]=it[mEn.ch]+it[mEn.bgc]*16*256+it[mEn.fgc]*256;
			//errArr[itemsT][6]=""+~~(100*Math.pow(1-(curErr/3/selectedFont.fontWidth/selectedFont.fontHeight/255),2))+" %";
			errArr[itemsT][6]=""+(curErr/selectedFont.fontWidth/selectedFont.fontHeight)+" ";
			errArr.sort(function(a,b) {return a[0]-b[0]});
			itCount++;
			maxErr=errArr[itemsT][0];
			}
	}
	
	for (var i=itemsF; i<=itemsT; i++) {
		curErr=0;
		var c=cMap[errArr[i][4]];
		var col=[c[mEn.colR], c[mEn.colG], c[mEn.colB]];	
		
		/*for (var xc=0; xc<selectedFont.fontWidth; xc++) {
			for (var yc=0; yc<selectedFont.fontHeight; yc++) {					
				var ind=(x*selectedFont.fontWidth+xc)*4+(y*selectedFont.fontHeight+yc)*imWidth*4;					
				actC=imMapData[ind]*0x10000+imMapData[ind+1]*0x100+imMapData[ind+2];				
				curErr+=calcColorDistance(actC, col);								
			}
		}*/
		
		var cInd=0;
		var curErrT=0;
		for (var xc=0; xc<cB.length; xc++) {
			var actC=cB[xc];
			curErrT+=calcCompDistP(actC, col[cInd++]);
			if (cInd>2) {
				cInd=0;
				curErr+=~~(Math.sqrt(curErrT));
				curErrT=0;
			};
		}
		
		errArr[i][0]=~~curErr;	 /* Real error */		
	}
	
	errArr.sort(function(a,b) {return a[0]-b[0]});
	return errArr;
}
function getBestColors(cB) {
	var minDiff=999999999;
	var colA=0;
	var colB=0;
	
	for (var c1=0; c1<15; c1++) {
		var col1=[cMap[c1][mEn.colR], cMap[c1][mEn.colG], cMap[c1][mEn.colB]];
		for (var c2=c1+1; c2<16; c2++) {
			var col2=[cMap[c2][mEn.colR], cMap[c2][mEn.colG], cMap[c2][mEn.colB]];
			currDiff=0;	
			/*			
			for (var xc=0; xc<selectedFont.fontWidth; xc++) {
				for (var yc=0; yc<selectedFont.fontHeight; yc++) {							
					var ind=(x*selectedFont.fontWidth+xc)*4+(y*selectedFont.fontHeight+yc)*imWidth*4;					
					//actC=imMapData[ind]*0x10000+imMapData[ind+1]*0x100+imMapData[ind+2];
					actC=saturationChange(imMapData[ind], imMapData[ind+1], imMapData[ind+2], 0);
					x1=calcColorDistance(actC, cMap[c1]);
					x2=calcColorDistance(actC, cMap[c2]);
					currDiff+=Math.min(x1, x2);				
				}
			} */
									
			var cInd=0;
			var x1=0;
			var x2=0;
			
			
			for (var xc=0; xc<cB.length; xc++) {
				var actC=cB[xc];				
				x1+=calcCompDistP(actC, col1[cInd]);
				x2+=calcCompDistP(actC, col2[cInd++]);				
				
				if (cInd>2) {
					cInd=0;
					currDiff+=~~(Math.sqrt(Math.min(x1, x2)));					
					x1=0;
					x2=0;
				};
			}
			if (currDiff<minDiff) {
				minDiff=currDiff;
				colA=c1;
				colB=c2;
			}
			
		}
	}
	return [colA, colB];
}

function getPixelResults(cB, itemsF=0, itemsT=1) {	
	minErr=999999999;
	var itCount=0;
	var errArr=[];			
	
	for (var i=itemsF; i<=itemsT; i++)
	{
		errArr[i]=[];
		errArr[i][0]=minErr;				
		errArr[i][1]=0;
		errArr[i][2]=0;
		errArr[i][3]=0;
	}
	
	//console.time('Find colors');
	

	//console.timeEnd('Find colors'); 
	var getBest=getBestColors(cB);
	var colA=getBest[0];
	var colB=getBest[1];
	
	//console.time('Find pattern'); 
	var minErr=999999999;	
	var maxErr=minErr;

	//var charSize=selectedFont.fontWidth*selectedFont.fontHeight;
	var valids=selectedFont.getValidChars(selectedFont.selectedValids);
	
	for (var c1=0; c1<2; c1++) {
		if (c1==0) {colA_=colA; colB_=colB} else {colA_=colB; colB_=colA;}
		for (var c2ind=1; c2ind<valids.length; c2ind++) {
			var c2=valids[c2ind];			
			var chrS=c2*selectedFont.fontSize; 
			var fontPix=-1;
			var fontInd=0;
			var cInd=0;
			
			var col1=[cMap[colA_][mEn.colR], cMap[colA_][mEn.colG], cMap[colA_][mEn.colB]];
			var col2=[cMap[colB_][mEn.colR], cMap[colB_][mEn.colG], cMap[colB_][mEn.colB]];
			
			var currDiff=0;
			var currDiffT=0;
			
			for (var xc=0; xc<cB.length; xc++) {
				if (fontPix==-1) {
					fontPix=selectedFont.fontArray[chrS+fontInd++];
					if (fontPix==0) {c=col1} else {c=col2};					
				};
	
				var actC=cB[xc];
				var fontC=c[cInd++];
				currDiffT+=calcCompDistP(actC, fontC);
				
				if  (cInd>2) {
					cInd=0;
					currDiff+=~~(Math.sqrt(currDiffT));
					currDiffT=0;
					fontPix=-1;
				}
				
				
			}
			/* for (var xc=0; xc<selectedFont.fontWidth; xc++) {
				for (var yc=0; yc<selectedFont.fontHeight; yc++) {
					if (dens==false) {
						var ind=(x*selectedFont.fontWidth+xc)*4+(y*selectedFont.fontHeight+yc)*imWidth*4;							
						//actC=imMapData[ind]*0x10000+imMapData[ind+1]*0x100+imMapData[ind+2];
						actC=saturationChange(imMapData[ind], imMapData[ind+1], imMapData[ind+2], 0);
						var chrS=c2*charSize+yc*selectedFont.fontWidth+xc; 
						if (selectedFont.fontArray[chrS]==0) {c=cA} else {c=cB}
						curErr+=calcColorDistance(cMap[c], actC);
					}
				}
			}
			*/
			
			
			if ((currDiff<maxErr) || (itCount<itemsT-itemsF)){
				minErr=currDiff;
				errArr[itemsT][0]=currDiff;
				errArr[itemsT][1]=c2;
				errArr[itemsT][2]=colA_;
				errArr[itemsT][3]=colB_;
				errArr[itemsT][5]=c2+colA_*16*256+colB_*256;
				errArr[itemsT][6]=""+~~(100*Math.pow(1-(currDiff/3/selectedFont.fontWidth/selectedFont.fontHeight/255),2))+" %";
				errArr.sort(function(a,b) {return a[0]-b[0]});
				itCount++;
				maxErr=errArr[itemsT][0];
			}
		}
	}
	//console.timeEnd('Find pattern'); 
	return errArr;
}



function getNeighbors(x, y, itemsF=0, itemsT=1) {
	var cMap=selectedFont.colorList;
	var colors=[];
	var neCount=0;
	var offsArr=[[-1,-1,'&#x1f884'],[0,-1,'&#x1f881'],[1,-1,'&#x1f885'],[-1,0,'&#x1f880;'],[1,0,'&#x1f882'],[-1,1,'&#x1f887'],[0,1,'&#x1f883'],[1,1,'&#x1f886']];
	var errArr=[];
	
	for (var i=0; i<9; i++) {
		colors[i]=[];
		colors[i][0]=0;
		colors[i][1]=0;
		colors[i][2]='NA';
	}
	
	for (var i=0; i<offsArr.length; i++) {		
		var c = getScreenValue(x+offsArr[i][0], y+offsArr[i][1]);		
		
		if (c>=0) {
			var colorFound=false;
			neCount++;
			for (var j=0; j<i; j++) {
				if (colors[j][0]==c) {
					colors[j][1]++;
					colors[j][2]+=offsArr[i][2];
					colorFound=true;
					break;
				}				
			}		
			if (colorFound==false) {
				colors[i][0]=c;
				colors[i][1]=1;				
				colors[i][2]=offsArr[i][2];
			}				
		};		
	}
	
	colors.sort(function(a,b) {return b[1]-a[1]});
	
	var iCount=0;
	for (var i=itemsF; i<=itemsT; i++) {
		errArr[i]=[];
		errArr[i][0]=colors[iCount][1]/neCount;				
		errArr[i][1]=~~(colors[iCount][0]%256);
		errArr[i][2]=~~((colors[iCount][0]/256)/16);
		errArr[i][3]=(~~(colors[iCount][0]/256)%16);
		errArr[i][4]=" "+colors[iCount][2];
		errArr[i][5]=colors[iCount][0];
		errArr[i][6]="<b>"+errArr[i][4]+"</b>"
		iCount++;
	}	
	
	return errArr;
}



function magnifyAll(p) {		
	$("paint-area").css({"transform":"scale("+p+","+p+")"});						
	$("p-pixel,#p-image,#p-grid,#cursor").css({"transform":"scale("+p+","+p+")"});						
}


function convertImage() {
	var cMap=selectedFont.getColorMap();
	selectedFont.createDenseMap(3,3);
	
	pixel = pixelContext.getImageData(0, 0, imWidth, imHeight);
	pixelData = pixel.data;
	
	imMap = imageContext.getImageData(0, 0, imWidth, imHeight);
	imMapData = imMap.data;
	
	for (var x=0; x<xSize; x++){
		for (var y=0; y<ySize; y++) {
			var cB=cacheImageBlock(x, y);
			var c1=getColorResults(cB)[0];
			var c2=getPixelResults(cB)[0];
			var bestR=(c1[0]<c2[0]) ? c1 : c2;			
						
			var ch=bestR[1];
			var bgc=bestR[2];
			var fgc=bestR[3];			
			
			screenArray[(y*xSize+x)*2]=bgc*16+fgc;
			screenArray[(y*xSize+x)*2+1]=ch;			
		}		
	}
	
	drawScreen();

}


function drawScreen() {	
	pixel = pixelContext.getImageData(0, 0, imWidth, imHeight);
	pixelData = pixel.data;
	
	for (var x=0; x<xSize; x++){
		for (var y=0; y<ySize; y++) {									
			var ch=screenArray[(y*xSize+x)*2+1];
			var c=screenArray[(y*xSize+x)*2];
			var bgc=~~(c/16);
			var fgc=c%16;			
						
			selectedFont.drawAnsiChar(x, y, ch, bgc, fgc, imWidth, pixelData);		
			
		}		
	}
	
	pixelContext.putImageData(pixel, 0, 0);	
	
}

function initParams(f, x, y) {
	// alert(DumbZip.unzipS16(logoAnsi));
	selectedFont = f;
	//selectedFont = C64SMALLFont;
	/* PixelFont.imageToStr16('\8x16.gif', 8*64, 16*4, 8, 16);   */
	/* PixelFont.imageToStr16('\c64_small.png', 8*16, 8*16, 8, 8);    */
	
	xSize=x;
	ySize=y; /* ToDo: mindenhol erre lecserélni */		
		
	xCoord=0;
	yCoord=0;			
	
	imWidth = xSize*selectedFont.fontWidth;
	imHeight = ySize*selectedFont.fontHeight;
	
	//$("p-pixel","p-image","p-grid")

	
	//.width(imWidth).height(imHeight);
	
		
}

function showAscii(e, d) {
	var $cm=$("#ascii-map");
	if ($cm.find("li").length==0) {
		for (var i=0; i<256; i++) {
			var $b=$("<li><canvas></canvas></li>")
			$cm.append($b);
		}
	}			
}

function chooseColor(e, d) {
	var offs=$('#inf-BFC').offset();
	var x = (e.pageX - offs.left)/$('#inf-BFC').width();
	var y = (e.pageY - offs.top)/$('#inf-BFC').height();
	if (d==0) { $("#color-map").css({display:"block"})} 
		else { $("#color-map").css({display:"none"})} 
	
	if (x+y<1) {
		
		//showPaintColors((paintBgc+1)%16,paintFgc)
		}
	else {
		//showPaintColors(paintBgc,(paintFgc+1)%16)
		}		
}

function showPaintColors(a, b) {
	var $cm=$("#color-map");
	if ($cm.find("li").length==0) {
		for (var i=0; i<16; i++) {
			var $b=$("<li> </li>").css({"background-color":"rgba("+cMap[i][mEn.colR]+","+cMap[i][mEn.colG]+","+cMap[i][mEn.colB]+",255)"});
			$cm.append($b);
		}
	}
	
	var c=$('#inf-BFC')[0].getContext('2d');
	var w=c.canvas.width;
	var h=c.canvas.height;
	
	var col=cMap[a];
	var col1="rgba("+col[mEn.colR]+","+col[mEn.colG]+","+col[mEn.colB]+",255)";
	var col=cMap[b];
	var col2="rgba("+col[mEn.colR]+","+col[mEn.colG]+","+col[mEn.colB]+",255)";	
		
	paintBgc=a;
	paintFgc=b;
	
	c.fillStyle=col1;
	c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(w, 0);
    c.lineTo(0, h);
    c.fill();
	
	c.fillStyle=col2;
	c.beginPath();
    c.moveTo(w, 0);    
    c.lineTo(0, h);
	c.lineTo(w, h);
    c.fill();
}

function moveCursor(){
	$('#cursor').css({"left":""+xCoord*selectedFont.fontWidth+"px", "top": ""+yCoord*selectedFont.fontHeight+"px"});
	
	var canvasC = document.getElementById('inf-cur');
	var contextC = canvasC.getContext('2d');
	var currIm = contextC.getImageData(0, 0, selectedFont.fontWidth, selectedFont.fontHeight);
	var currData = currIm.data;				
	selectedFont.drawAnsiChar(0, 0, currentCh(), currentBg(),  currentFg() ,8, currData);
	contextC.putImageData(currIm, 0, 0);
	
	var canvasC = document.getElementById('inf-img');
	var contextC = canvasC.getContext('2d');
	
	var currIm = imageContext.getImageData(xCoord*selectedFont.fontWidth, yCoord*selectedFont.fontHeight, selectedFont.fontWidth, selectedFont.fontHeight);
	var currData = currIm.data;				
	
	contextC.putImageData(currIm, 0, 0);
	
	var cB=cacheImageBlock(xCoord, yCoord);
	
	var currIm = contextC.getImageData(0, 0, selectedFont.fontWidth, selectedFont.fontHeight);
	var currData = currIm.data;				
	
	function putMatches(ob, a) {
		for (var i=0; i<9; i++) {
			var $r=$(ob+' > ul.rec-list > li:nth-child('+(i+1)+')');
			var canvasC = $r.find('canvas:first')[0];
			var contextC = canvasC.getContext('2d');
			var colR=a[i];			
			
			$r.find('p:first').html(colR[6]);		
			selectedFont.drawAnsiChar(0, 0, colR[1], colR[2], colR[3], 8, currData);
			numChars[i+1]=colR[5];
			contextC.putImageData(currIm, 0, 0);
		}
	}
	
	putMatches('#info-col', getColorResults(cB, 0, 8));
	putMatches('#info-pat', getPixelResults(cB, 0, 8));
	putMatches('#info-nbr', getNeighbors(xCoord, yCoord, 0, 8));	

};

function setNumMenu() {
	var numNames=["info-col","info-pat","info-nbr"];
	var i=0;
	for (n of numNames) {
		var $a=$("#"+n+" ul.rec-list");
		if ($a.height()!=numMenu[i]*73) $a.animate({"height": ""+numMenu[i]*73+"px"},500);
		/*switch (numMenu[i]) {
			case 0: if ($a.css("display")!="none") { $a.animate({"height": "0px"}, 500); }
					break;
			case 1: if ($a.css("display")=="none") { $a.animate({"height": "70px"}, 500)} else {$a.animate({"height": "70px"}, 500)}
					break;
			case 2: if ($a.css("display")=="none") { $a.animate({"height": "145px"}, 500)} else {$a.animate({"height": "145px"}, 500)}
					break;
			case 3: if ($a.css("display")=="none") { $a.animate({"height": "220px"}, 500)} else {$a.animate({"height": "220px"}, 500)}
					break;
		}*/
		i++;
	}
}
function copyAnsiToImg() {
	imMap = pixelContext.getImageData(0, 0, imWidth, imHeight);
	imMapData = imMap.data;	
	imageContext.putImageData(imMap, 0, 0);

};

function createMenu() {
	let img=$("#menupng")[0], w=40, h=40;
	magnp.getContext("2d").drawImage(img,128,0,64,64,0,0,w,h);
	magnm.getContext("2d").drawImage(img,192,0,64,64,0,0,w,h);
	grid.getContext("2d").drawImage(img,0,0,64,64,0,0,w,h);
	arrow.getContext("2d").drawImage(img,256,0,64,64,0,0,w,h);
	picker.getContext("2d").drawImage(img,64,64,64,64,0,0,w,h);
	dot.getContext("2d").drawImage(img,64,0,64,64,0,0,w,h);
	line.getContext("2d").drawImage(img,0,64,64,64,0,0,w,h);
}

/*------------------------------------------*/
function startDraw() {
/*------------------------------------------*/
	numMenu=[0,0,2];
	setNumMenu();
	initParams(EGAF8x16Font, 80, 25);
	//initParams(C64SMALLFont, 40, 25);
	getContexts();
	drawGrid();
	prepareFont();	
	importAnsi(logoAnsi);
	showPaintColors(0,15);
	copyAnsiToImg();
	createMenu();
	
	$(document).keydown(function(e) { keyHandler(e) });		
	$('#inf-BFC').mousedown(function(e) { chooseColor(e, 0) });
	$('#inf-BFC').mouseup(function(e) { chooseColor(e, 1) });
	$('#paint-area').click(function(e) { clickedOn(e)});
	moveCursor();
}

function keyHandler(e) {
	switch (true) {
		case (e.keyCode==38):
				yCoord--;
				if (yCoord<0) {yCoord=0} else {moveCursor()};
				break;
		case (e.keyCode==40):
				yCoord++;
				if (yCoord>24) {yCoord=24} else {moveCursor()};;							
				break;
		case (e.keyCode==39):
				xCoord++;
				if (xCoord>79) {xCoord=79} else {moveCursor()};							
				break;
		case (e.keyCode==37):
				xCoord--;
				if (xCoord<0) {xCoord=0} else {moveCursor()};							
				break;		
		case ((e.key>='1') && (e.key<='9')):
				var n=numChars[e.keyCode-48];				
				setScreenValue(xCoord, yCoord, n);
				drawScreen();
				break;		
		default: 
				break;
	};
}

function prepareFont() {
	cMap=selectedFont.getColorMap();
	
	if (($("#valid-sel > li").length)==0) {
		for (var i=0; i<selectedFont.validChars.length; i++) {
			var n=selectedFont.validChars[i][0];			
			$('#valid-sel').append($('<option>', { n:n }).text(n));		
		};
		
		$("#valid-sel").change(function() {
			selectedFont.showFont("font-canv", $("#valid-sel").val()); 
		});
	};
	
	$("#valid-sel").change();
}

function switchGrid() {
	$("#p-grid").css("opacity", 0.5-$("#p-grid").css("opacity"))
}

function clickedOn(e) {
	var x = e.pageX - $('#paint-area').offset().left;
	var y = e.pageY - $('#paint-area').offset().top;
	
	switch (selectedTool)
	{
		case toolArrow:
			xCoord = ~~(x / selectedFont.fontWidth);
			yCoord = ~~(y / selectedFont.fontHeight);
			moveCursor();
			break;
		case toolPicker:
			break;
		default:
			break;
	}
	//alert (e.clientX+" "+e.clientY);
}

function drawGrid(){	
	var context = document.getElementById('p-grid').getContext('2d');
	
	context.strokeStyle = "hsla(0,0%,50%,0.8)";
	context.fillStyle = "white";
	
	context.beginPath();
	context.lineWidth = 1;	
	
	for (var x = 0; x <= imWidth; x += selectedFont.fontWidth) {
		context.moveTo(x+0.5, 0);
		context.lineTo(x+0.5, imHeight);
	}

	for (var x = 0.5; x <= imHeight; x += selectedFont.fontHeight) {
		context.moveTo(0.5, x);
		context.lineTo(imWidth, x);
	}
	
	context.stroke();	
	$("#p-grid").css("opacity", 0.5)	
}

function openImage(t){
	var input = t;
	var url = $(t).val();
	var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) 
	 {
		var reader = new FileReader();
		var canvas = document.getElementById('p-image');
		var ctx = canvas.getContext('2d');
		
		img=new Image();

		img.onload=function(){
			canvas.width=imWidth;
			canvas.height=imHeight;
			ctx.drawImage(img,0,0,img.width,img.height,0,0,imWidth,imHeight);					
		}	
		
		reader.onload = function (e) {
			img.src=e.target.result;				  
		}
		reader.readAsDataURL(input.files[0]);
		
		
	}
	else
	{
	  $('#img').attr('src', '/assets/no_preview.png');
	}
  };
  
  function setToolSize(i, s) {
	if (s==3) {for (var j=0; j<3; j++) {numMenu[j]=0}}	  
	if (s==2) {for (var j=0; j<3; j++) {numMenu[j]=0}; numMenu[(i+1)%3]=1;}	  
	
	var totalLines=0;

	numMenu[i]=s;
	
	for (var j=0; j<3; j++){
		  totalLines+=numMenu[j];		  
	}	 
		
	if (totalLines>3) { 
		if (numMenu[(i+1)%3]>0) {numMenu[(i+1)%3]--} else {numMenu[(i-1)%3]--}
	}
	setNumMenu();
  }
  
  function exportAnsi() {
	var lenIn=screenArray.length*2;
	var s=DumbZip.arrayToS16(screenArray);
	var	outp=DumbZip.zipS16(s);
	var lenOut=outp.length;
	$("#ioText").val(outp);
	var copyText = document.getElementById("ioText");
	copyText.select();
	document.execCommand("Copy");
	alert ("Copied to clipboard. ("+lenIn+"->"+lenOut+" bytes)");	
	//alert (DumbZip.zipS16(s));
  }
  
  function importAnsi(inp='') {
	if (inp=='') {inp=window.prompt("Dump string","dUMb:");}
	
	var s=DumbZip.unzipS16(inp);
	var a=DumbZip.s16ToArray(s);
	screenArray=a;
	drawScreen();
  }
  
  function setLayerTransp(t){			
	var transp = $(t).val();			
	$("#p-image").css("opacity", transp/100);
	
	
  }