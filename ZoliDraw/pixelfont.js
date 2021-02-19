var mEn = {bgc: 0, fgc: 1, ch: 2, errormulti: 3, colR: 4, colG: 5, colB: 6};

function PixelFont(name, colorList, rawFont, colorMapInfo, fontWidth, fontHeight, charCount, validChars=['All:00FF']) {			
	var name; 					/* Font name */
	var colorList;				/* List of colors */
	var fontArray;				/* Font array */
	var charCount;				/* Number of characters */
	var fontWidth;				/* Font width */
	var fontHeight;				/* Font height */
	var fontSize;				/* Font width * font height */
	var colorMap;	  			/* Color palette from patterns */
	var denseMap;				/* Density map */
	var validChars;				/* Valid character sets */
	var selectedValids;
	
	this.name=name;
	this.colorList=colorList;
	this.charCount=charCount;
	this.fontHeight=fontHeight;
	this.fontWidth=fontWidth;
	this.fontSize=fontHeight*fontWidth;
	this.colorMapInfo=colorMapInfo;
	this.fontArray=[];
	this.denseMap=[];
	this.loadHexFont(rawFont);	
	this.validChars=[];
	this.selectedValids="";
	
	for (var i=0; i<validChars.length; i++) {
		this.validChars[i]=[];
		var rawSt=validChars[i];
		var rName=rawSt.substr(0, rawSt.indexOf(':'));
		this.validChars[i][0]=rName;
		
		var j=rName.length+1;
		var chF='';
		var chT='';
		var chCount=1;
		while ( j<rawSt.length)
		{							
			if (chF=='') {chF=rawSt.substr(j,2); j+=2;}
			else if (rawSt.substr(j,1)!='.') {chT=rawSt.substr(j,2); j+=2;};
						
			if ((rawSt.substr(j,1)=='.') || (j>=rawSt.length)) {
				if (chT=='') {chT=chF};
				var iF=parseInt(chF, 16);
				var iT=parseInt(chT, 16);
				for (var k=iF; k<=iT; k++)
				{					
					this.validChars[i][chCount]=k;					
					chCount++;					
				}
				var chF='';
				var chT='';
				j++;
			}
			
		}
	}	
	
	this.generateColorMap();
};

PixelFont.prototype.getValidChars=function(s) { 
	for (var i=0; i<this.validChars.length; i++) {
		if (this.validChars[i][0]==s) {return this.validChars[i]}
	}
	return this.validChars[0];
}

PixelFont.prototype.getColors=function() { return this.colorList; }
PixelFont.prototype.getColorMap=function() { return this.colorMap; }

PixelFont.prototype.createDenseMap=function(xSize, ySize) { 
	var ind=0;
	for (var c=0; c<this.charCount; c++) {
		for (var chy=0; chy<this.fontHeight-ySize; chy++) {
			for (var chx=0; chx<this.fontWidth-xSize; chx++) {							
				var d=0;
				for (var x=0; x<xSize; x++) {
					for (var y=0; y<ySize; y++) {
						d+=((this.fontArray[c*this.fontWidth*this.fontHeight+(chy+y)*this.fontWidth+(chx+x)])>80);
					}
				}
				this.denseMap[ind]=d;
				ind++;
			}

		}
	}
}

PixelFont.prototype.drawAnsiChar=function(x, y, ch, bgc, fgc, imgW, pData ) {	
	for (var chx=0; chx<this.fontWidth; chx++) {
		for (var chy=0; chy<this.fontHeight; chy++) {
			var src=ch*(this.fontWidth*this.fontHeight)+(chy*this.fontWidth)+chx;  /*chy+Math.trunc(ch/64)*16)*512+((ch%64)*8+chx)+1; */
			
			var c=this.fontArray[src];
			var targ=(y*this.fontHeight+chy)*imgW*4+ (x*this.fontWidth+chx)*4;
			
			fgc_=(fgc instanceof Array) ? fgc[0]*0x10000+fgc[1]*0x100+fgc[2] : this.colorList[fgc];
			bgc_=(bgc instanceof Array) ? bgc[0]*0x10000+bgc[1]*0x100+bgc[2] : this.colorList[bgc];					
			col=(c==255) ? fgc_ : bgc_;								
			
			pData[targ]=col/0x10000;
			pData[targ+1]=(col & 0xFF00) / 0x100;
			pData[targ+2]=(col & 0xFF);
			pData[targ+3]=255;	
		}
	}
}		

PixelFont.prototype.showFont=function(destCanv, shValids='') {
	var canv=$("#"+destCanv)[0]
	var canvCont=canv.getContext('2d');
	var canvW=canv.width;
	var canvH=canv.height;
	var canvImage= canvCont.getImageData(0, 0, canvW, canvH);
	var canvData = canvImage.data;
	var xC=0;
	var yC=0;
	var bgc;
	var fgc;
	
	this.selectedValids=shValids;
	var valids=this.getValidChars(shValids);
	
	for (var i=0; i<this.charCount; i++) { 
			if (valids.includes(i)) {
				bgc=0;
				fgc=10;
			}
			else
			{
				bgc=0;
				fgc=8;
			}
			
			this.drawAnsiChar(xC, yC, i, bgc, fgc, canvW, canvData);
			xC+=1;
			if ((xC+1)*this.fontWidth>canvW) {
					xC=0;
					yC++;
			}
	}
	
	canvCont.putImageData(canvImage, 0, 0);
}	

PixelFont.prototype.loadHexFont=function(rawFont_) {
	var arCount=0;
	var rawFont;
	
	if (DumbZip.testDumb(rawFont_)) {
		rawFont=DumbZip.unzipS16(rawFont_);
	}
	else {
		rawFont=rawFont_;
	};
	
	for (var i=0; i<rawFont.length; i+=(this.fontWidth>8) ? 4 : 2) {		
		var hexd=parseInt(rawFont[i]+rawFont[i+1]+( (this.fontWidth>8) ? (rawFont[i+2]+rawFont[i+3]) : ''), 16);		/* Hexadecimal */
		
		for (var j=this.fontWidth-1; j>=0; j--) {					
			this.fontArray[arCount+j]=(hexd%2)*255;
			hexd=~~(hexd/2);											
		}
		arCount+=this.fontWidth;
		
	}
};

PixelFont.imageToStr16=function(src, picW, picH, chW, chH) {
							
	var imageObj = new Image();		
	imageObj.onload = function() {
		$("body").append('<canvas id="tmp-canvas" width="'+picW+'" height="'+picH+'"></canvas>');
		var context=$("#tmp-canvas")[0].getContext('2d');
		
		context.drawImage(this, 0, 0);
		font = context.getImageData(0, 0, picW, picH);
		fontData = font.data;
		
		var chs='';				
		var chNum=picW*picH/chW/chH;				
		
		for (var cH=0; cH<picH/chH; cH++) {					
			for (var cW=0; cW<picW/chW; cW++) {										
				for (var y=0; y<chH; y++) {
					chi=0;
					for (var x=0; x<chW; x++) {
						chi=(chi << 1)+ (fontData[((y+cH*chH)*picW+x+cW*chW)*4]>50);
					}
					chs+=("000"+(Number(chi).toString(16))).slice( (chW>8) ? -4: -2).toUpperCase();							
				}												
			}
		}		
		
		/* ### Memory leak - delete object!!! */
		
		alert(""+chW+"|"+chH+"|"+chNum+"|"+DumbZip.zipS16(chs));								
	};

	imageObj.src = src;			
}

PixelFont.prototype.addColorMapValueRGB=function(i, rgb_r, rgb_g, rgb_b, bg, fg, ch, errRate) {
	this.colorMap[i][mEn.colR]=rgb_r;
	this.colorMap[i][mEn.colG]=rgb_g;
	this.colorMap[i][mEn.colB]=rgb_b;
	this.colorMap[i][mEn.bgc]=bg;
	this.colorMap[i][mEn.fgc]=fg;
	this.colorMap[i][mEn.ch]=ch; 
	this.colorMap[i][mEn.errormulti]=1; //+errRate*avgErr;
}
PixelFont.prototype.addColorMapValue=function(i, col, bg, fg, ch, errRate) {
	this.addColorMapValueRGB(i, getRGB_r(col), getRGB_g(col), getRGB_b(col), bg, fg, ch, errRate);				
}

PixelFont.prototype.generateColorMap=function(colList, cArr) {
	/* [i max, j max, char, error multi], [...] */
	
	colList = this.getColors();
	cArr = this.colorMapInfo;
	ind = 0; /* Color map index */
	this.colorMap=[];
	
	for (m of cArr)
	{
		var iRate=m[0];
		var iMax=m[1];
		var jMax=m[2];
		var ch=m[3];
		var errm=m[4];
		
		for (var i=0; i<iMax; i++) {
			for (var j=0; j<jMax; j++) {
				this.colorMap[ind]=[];
				avgErr=0;
				this.addColorMapValue(ind, avgColor(colList[i], colList[j], iRate), j, i, ch, errm);	
				ind++;
			}
		}
	}

}

/* EGA 16 color font */
const EGAF8x16Font = new PixelFont (
						'EGAF8x16',
						[0x000000, 0x0000AA, 0x00AA00, 0x00AAAA, 0xAA0000, 0xAA00AA, 0xAA5500, 0xAAAAAA, 0x555555, 0x5555FF, 0x55FF55, 0x55FFFF, 0xFF5555, 0xFF55FF, 0xFFFF55, 0xFFFFFF],																		
						'dUMb:0zBkB7E81A581aBD99eI7Eo06FFDBFc1C3E7eIo06eB6CFEgC7C381r2210387Cz0483CaE7eC18eOs06e30e2ou06m1818mUe0qiBe2ri4oiBk0g3C6642a66m1wk0gC399BDe7cC3o121E0E1A3278ChB7n2ye1sgBe3og4on06F33c40gC70F0o917F63eEhCe7g6o6fe1kDBe883CDBo1y80C0E0Fa8FEc4ccCcklB2060E1E3EFc4e4ycg2s9we1oe4kq9400i5ggBgQo4mDe7zB7B1jCl04CC660386c8caC380ca7vco00igcz3qf3qohym06iCq84kCu5kg0c0CFE0v02fbw060FE6c8yBCfCo4ila58emi6C2v1yemeemgemiu14go0en8unazBlm6e64g74o7agcc24z11frog4ikIm8yecoC2C07C06a8cv7f2an762C6e8ye8cC68nfaeeaee676Dinal06gm4n0nr9re1qkCec0obkfSjCe0kt5m63CFFeqay8cuqqw0ew20ebwz0tp14sf9e7zh86oqujn6Dc2jneodi87pkqnpyCC6m1wC6o3yh0663fcmedvppwC1C3C6CCfmef94n12FEhlcx1238f2kcwfg7r06FEg2umcuq3qg0sw12j06eyof1a7r92k9mwcoo06rckj84hgitfeg9mo9sk11j0uh1as4me00upyk08DEfCCfogpuagege8ggCn92Cgru7hI66Foaueft2jmd2elsn12epymBCFn3qFEeuf6878erjcapg6p06c2Fojqj2uDf4m663Anh1h56k5go5iiyokCo4m1hikeChvan4me3pe587e3sf5sEo86hfxhCr5iC6EEFc2gp0s3qcw6F6cwECvaukjixlikbqh2yo86o12D6DE7e5uj3ul12hKo5ig12603fi0tnaEa5Az92jauy4mo02ex01oudk4gc2FEEE6r126C7C3ey6evip86ihpkdqpiuECegviyu2qyu3Civ0jCoyu0e73E070381eJ602o12kg6gCk12ioyusczBg4cfcre38uwmtva80C7ijqn2ee47aijmgdst12e8ug4lp061h566h1wq1yk12FEu12e6g64eikwiuh12k1xCeiukp8g4m6C7jvboiued4e24yhyf11j19gCgeun1ylrso1ym1sv1yg18CersgCud2Dj9weBx9yvmes12gs0prwp860C1njwDg86z9ye2ugrurdifh8Fklo61t3qk2sweek4kepat12lrsorqi06etceCwmunvaec9CFn24FECirsprq0Egcc7ffkffon06jWjKo4mi0ui1ae1coaoDt52oBisueCp3o03e692hoy2fimalayCfKz9yf64zp2h2oztij1yy066hw8y06e1w3z06m5mgocg5gkncj3qzuegdwy06j3qz12gokytieOe08y06i1yy06e3okckFEgcqq78y06gigeise7agri6reggb076367ED8a6n063EgshekohBl06m92wvak92u06m92u063078efcyhyi12ziuh2usqu7foce04m2qq2ue06o04pkmfbahh0fh2oque786460Fg06c2E6Fpfag0s7EgEo12F8f9u8C4CCDia0m5iE1Bht8jtiaDjtmidkzmehquziui12xaui06z9yhx2De7ejBo02C6E6F6FEDECpiufqoc23E007tikh92gson8smfcf5ic26fpwqhyj9cgqsc2wBFef0gCm85eC2C6Cf8e60DC86f8qh44p066CE9Ecsl18gd2i9seCmdij4s66CDer8ryqgBg02e0amW1144zEc455AAzEc4DD77zEc4keyzClCFz00g02s0636mCFnOeCqawz060z1yj1u0t1yzCs1yEz12k1yriwp0ar06q7axhtl5mzCeCFz1yg22r06p1yFz1sh1yqSq12z2uh2uz1sg1ur06p987z9ye0203z5i0cscwz1236F7u4mo5eFz12h2ur06p12r1yp2ur12obmz12i16z4mi2uzbqh0az5ggCzcmibqz2t0wcmrayz2qg5iz7afg2zg6jnez3pk3upigzBfBq86s07zCfCzZhCz2crB76DCD8fCC7lgucq8CfBDeI6fCCn4cEfU0mCrf8Eg0viCq04C66030183060Cty6007Eh3oc27r046jB7C6e16t5gzf207E183Cg123C187p2u386f68g5s6C3n12i04e00gCEn121Ee5c0C3Ei3u3s7be5iBeCq2qg2106g06F37Eq5g1Ce7wag68f8ep1y7ibijCsauqGspae7gg80qfkg5ie9pebse4yp11fYgcoe4jp06E1Bc2znwmCydig3ke1qsckkdkiGqboqc8zqux1um08skhkl9glr3CmauDf2uul8h4ecyfl8zv8gcomCz0drB',
						[ [1, 16, 1, 219, 0],[0.5, 16, 16, 177, 1.0/3/256*0.1],[0.75, 16, 16, 178, 1.0/3/256*0.2] ], /* Color patterns - see Color Utils */
						// [ [1, 16, 1, 219, 0],[0.5, 16, 16, 177, 1.0/3/256*0.1] ], /* Color patterns - see Color Utils */
						8, 16, 256,
						['All:00FF','Capitals:415A','Drawing:04.0709.1011.1623.2731.38.3A40.5B60.7B7F.A7.A9AA.AEE0.EFF0.F4FA.FE','Box:B3DA','Fill:B0B1.DBDF.FE']						
						);

/* Commodore 64 - small caption font */
const C64SMALLFont = new PixelFont (						
						'C64SMALL',
						[0x000000, 0xFFFFFF, 0x880000, 0xAAFFEE, 0xCC44CC, 0x00CC55, 0x0000AA, 0xEEEE77, 0xDD8855, 0x664400, 0xFF7777, 0x333333, 0x777777, 0xAAFF66, 0x0088FF, 0xBBBBBB],
						'dUMb:003C666Ec20623C0fBc863E6c4eOcq07e0c67j06eUah0mcbe0ki0mg1m7Ej06E183c4eCh06i0k6o1y6fQe0c3f0kj1yg0beCiLC786Cg0mg0il0m0667Fa6B63gQi1wg0mh62e2wh0mi5gh05p3qh06i2tg06f7eg6u187i5gh6ei2ci6ui2c18g0o636B7F3E3h1jg02e3gn0mE0Cg3s7cacweI03C30jCe04C12cqcm62FcgckjCg10e1sj3seQ030e7a3cai54jB6i8iia8m7yi3mFFgEeYecii6sf0m2cmf44664cwe583C3867c8Ffbpf0ejBf0ieCcmC7cceIeCeYi78FFk78e3og52o4hmSe7ki4or063g2yeHikm7jdyffih6ig9ifdde92h9yeQ1Ce6nf9260E1Eegogefeke7cui06f1yhg8eQcwf2si98gheiGjQEj1yj4sk4yiQf7cen8eoieWh64e3yi6g7g8mf2i7h5yia2i1kFc1i1shpuhd8jlchrog50fCg50focfBC78g6c6eWh7omQj9g06gnaCig4k2eekumqc1Eij66C3ghgC787h2mksdi2e6377grkeCfs067E7exyh1yioyh4mjrkl3qi04e4mh06i2eg4mek4ic4k46klwk1ymOf06f3iero77g3qkrmf52j0ig1i7evehiae5igYebagKe75emaiIm38f8ac1Cc1kI99CeoohIqrpFpCjYjBq0on10Flv7gCn2q3lwxhCirvj0e993366iIq0mh5aFc2jwcm4fk06n3i8ap0mokcj1ik92q0gn06j1iq5yEpC07oCu1sw8qh001ewkgkamb7jaupb3k3qp0ex0uFFC39991c2F9DC3g2kc89C19c4eOcqF8e0c98j06eUah0mcbe0ki0mg1m81j061E7Cc4eCh06i0k9o1y9fQe0cCf0kj1yg0beCiL38793g0mg0il0mF9980a949CgQi1wg0mh62e2wh0mi5gh05p3qh06i2tg06f7eg6uE78i5gh6ei2ci6ui2cE7g0o9C9480C1Ch1jg02e3gn0m1F3g3s8cacweIFC3CFjCe043EDcqcm9D0cgckjCg10e1sj3seQFCFe7aCcai54jB9i8iia8m7yi3m00gEeYecii6sf0mDcmf4499Bcwe58C3C798c8egnf04l2gf0ieCcm38cceIeCeYi7800k78e3og52o4hmSe7ki4or06Cg2yeHikm8jdyffih6ig9ifdde92h9yeQE3e6nf929F1E1egogefeke8cui06f1yhg8eQcwf2si98gheiGjQ1j1yj4sk4yiQf7cen8eoieWh64e3yi6g8g8mf2iexri52e16i1kkuugh8e3ugckjlchrog50fCg50focfB387g6c9eWh7omQj9gF9gna3ig4k2eekumqcE1ij693Cghg3878h2mksdi2e9C88grkeCfs09818exyh1yioyh4mjrkl3qi04e4mh06i2eg4mek4ic4k46klwk1ymOf06f3iero88g3qkrmf52j0ig1i8evehiae5igYebagKe75emaiIm38f8ac13c1kI663eoohIqrp0pCjYjBq0on100lv7gCn2qClwxhCirvj0e66CC99iIq0mh5a0c2jwcm4fk06n3i7ap0mokcj1ik92q0gn06j1iq5y1pCF8oCu1sw8qh00Eewkgkamb7jaupb3k3qp0ex0u',
						[[0, 1, 16, 32, 0], [0.5, 16, 16, 95, 1.0/3/256*0.2]],
						8, 8, 256);