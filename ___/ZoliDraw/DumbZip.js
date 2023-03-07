/*************************************************
/*
/* dUMb:zip (c) 2017 Zoltan Szoke
/*
/*************************************************/

function DumbZip() {
		
}

DumbZip.dumbHeader="dUMb:";

DumbZip.testDumb=function(s) {
	return (s.substr(0,DumbZip.dumbHeader.length)==DumbZip.dumbHeader);
}

DumbZip.unzipS16=function(sIn) {
	var i=1;
	sIn=sIn.slice(DumbZip.dumbHeader.length);
	var sOut=sIn.substr(0,1); 		
	
	const repeatLast=(mf, mo, incr)=> {
		
		for (var j=0; j<mf; j++) {
			sOut+=sOut.substr(-mo, 1);
		}		
		i+=incr;
	}
	
	while (i<sIn.length) {	
		var ch=sIn.substr(i,1);
				
		switch (true) {
			case ch=='a': 	repeatLast(2,2,1);
							break;
			case ch=='b': 	repeatLast(3,3,1);
							break;
			case ch=='c':	repeatLast(3,parseInt(sIn.substr(i+1,1),36), 2);
							break;						
			case (ch>='d' && ch <='z'):	
							var ch2=sIn.substr(i+1,1);
							if (ch2>='A' && ch2<='Z') {
								repeatLast(parseInt(ch,36)-10,parseInt(sIn.substr(i+1,1),36)-10, 2)
							}
							else {
								repeatLast(parseInt(ch,36)-10,parseInt(sIn.substr(i+1,2),36)+26, 3);
								}
							break;
			case ch=='_': 	//xRRO
							var rep=parseInt(sIn.substr(i+1,2),36);
							var ofs=parseInt(sIn.substr(i+3,1),36);
							repeatLast(rep, ofs, 4);
							break;
			case ch=='-': 	//xRROO
							var rep=parseInt(sIn.substr(i+1,2),36);
							var ofs=parseInt(sIn.substr(i+3,2),36);
							repeatLast(rep, ofs, 5);
							break;							
			case ch=='#': 	//xRROOO
							var rep=parseInt(sIn.substr(i+1,2),36);
							var ofs=parseInt(sIn.substr(i+3,3),36);
							repeatLast(rep, ofs, 6);
							break;
			case ch=='^': 	//xROOO
							var rep=parseInt(sIn.substr(i+1,1),36);
							var ofs=parseInt(sIn.substr(i+2,3),36);
							repeatLast(rep, ofs, 5);
							break;
			case (ch>='A' && ch <='F') || (ch>='0' && ch<='9'):	 
							sOut+=ch;
							i++;
							break;
			default: 		alert('Error in dUMb file: '+i+' ch:'+ch);
							i=sIn.length;
							break;
		}
	}
	return sOut;	
}

DumbZip.zipS16=function(sIn) {
	
	var maxReturn = 36*36*36-1; /* Maximum characters to go back */
	var maxCount = 36*36-1; /* a: repeat last 2 chars. b: repeat last 3 chars. c: repeat 3 chars, go back maximum 36 chars. d...: repeat 4 chars, go back maximum 36*36 chars.) */
	
	var i=1;
	var sOut=sIn.substring(0,1);
	var j=0;
	
	while (i<sIn.length) {		
		var maxFound=0;
		var maxWhere=0;
		
		var findCount=2;
		var foundMatch=true;
		
		while (foundMatch) {
			var searchString = sIn.substr(i,findCount);
			var validString=sIn.substr(0, i + findCount -1);
			var last=validString.lastIndexOf(searchString);
			
			if ((last==-1) || (i + findCount > sIn.length) || (maxReturn<i-last) ) {
				foundMatch=false; 
			}
			else {	
				maxFound=findCount;
				maxWhere=last;
				findCount++;
			}
		}
		
		if (maxFound==0) {
			sOut+=sIn.substr(i,1);
			i++;
		}
		else {			
			var mf=maxFound;
			var mo=(i-maxWhere);
			var compr=false;
			
			if ((mo==2) && (mf==2) && (!compr) ) {
				sOut+="a";
				i+=2;
				compr=true;
				};
			if ((mo==3) && (mf==3) && (!compr) ) {
				sOut+="b";
				i+=3;
				compr=true;
				};
			if ((mf==3) && (mo!=3) && (mo<36) && (!compr) ) {
				sOut+="c"+Number(mo).toString(36);
				i+=3;
				compr=true;
			}
			
			if ((mf>3) && (mf<26 ) && (mo<26) && (!compr) ) {
				//RO
				sOut+=Number(mf+10).toString(36)+(Number(mo+10).toString(36)).toUpperCase();
				i+=mf;
				compr=true;
			}
			
			if ((mf>3) && (mf<26 ) && (mo>=26) && (mo<=36*36+26-1) && (!compr) ) {	
				//ROO
				sOut+=Number(mf+10).toString(36)+("0"+Number(mo-26).toString(36)).slice(-2);
				i+=mf;
				compr=true;
			}						
			
			if ((mf>=26) && (mo<36) && (!compr) ) {
				//_RRO
				if (mf>maxCount) {mf=maxCount};	
				sOut+='_'+(('0'+Number(mf).toString(36)).slice(-2)+(Number(mo).toString(36))).toUpperCase();
				i+=mf;
				compr=true;
			}
			
			if ((mf>=26) && (mo>=36) && (mo<36*36-1) && (!compr)) {
				if (mf>maxCount) {mf=maxCount};	
				//-RROO
				sOut+='-'+(('0'+Number(mf).toString(36)).slice(-2)+('0'+Number(mo).toString(36)).slice(-2)).toUpperCase();
				i+=mf;
				compr=true;
			}
			
			
			if ((mf>=26) && (mo>=36*36-1) && (mo<36*36*36-1) && (!compr) ) {
				//#RROOO
				if (mf>maxCount) {mf=maxCount};				
				sOut+='#'+(('0'+Number(mf).toString(36)).slice(-2)+('00'+Number(mo).toString(36)).slice(-3)).toUpperCase();				
				i+=mf;
				compr=true;
			}					
			
			if ((mf>3) && (mf<36 ) && (mo>=36*36) && (mo<=36*36*36-1) && (!compr) ) {				
				//^ROOO
				sOut+='^'+(Number(mf).toString(36)+("00"+Number(mo).toString(36)).slice(-3)).toUpperCase();
				i+=mf;
				compr=true;
			}
			
			//(maxCount==findCount) || (maxReturn<i-last) 
			if (compr==false) {
				sOut+=sIn.substr(i,1);
				i++;	
			}
		}		
	}
	
	sOut=DumbZip.dumbHeader+sOut;
	//alert(sOut);
	/* alert(DumbZip.unzipS16(sOut)) */
	if (sIn!=DumbZip.unzipS16(sOut)) alert("Error in coding!!!"); 
	//alert(""+sIn.length+"->"+sOut.length);
	return sOut;
}	

DumbZip.arrayToS16=function(a) {
	var s='';
	
	for (var i=0; i<a.length; i++) {
		s+=("0"+Number(a[i]).toString(16).toUpperCase()).slice(-2);
	}	
	return s;
}

DumbZip.s16ToArray=function(s) {
	var a=[];
	
	for (var i=0; i<s.length; i+=2) {
		a[i/2]=parseInt(s.substr(i,2),16);
	}	
	return a;
}
