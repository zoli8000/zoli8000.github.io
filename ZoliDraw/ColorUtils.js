/*************************************************
/*
/* Color utils - 2017 Zoltan Szoke
/*
/*************************************************/

function getRGB_r(c) { return (c & 0xFF0000) >> 16}; // { return ~~(c / 0x10000) };
function getRGB_g(c) { return (c & 0xFF00) >> 8 }; // { return ~~((c & 0xFF00)/0x100) };
function getRGB_b(c) { return (c & 0xFF) };

function calcCompDistP(a, b) {var c=a-b; return c*c };

function calcColorDistance(a, b) {
	return Math.sqrt( 
		Math.pow(getRGB_r(a)-getRGB_r(b),2) + 				
		Math.pow(getRGB_g(a)-getRGB_g(b),2) +
		Math.pow(getRGB_b(a)-getRGB_b(b),2) 				
		)
}

function avgColorComponent(a, b, f) {
	avgErr+=Math.sqrt(Math.max(a,b)**2-Math.min(a,b)**2);
	return ~~Math.sqrt(Math.pow((~~a),2)*f+Math.pow((~~b),2)*(1-f));
}

function avgColor(a, b, f) {
	return (avgColorComponent(getRGB_r(a),getRGB_r(b),f)*0x10000 + avgColorComponent(getRGB_g(a),getRGB_g(b),f)*0x100 +  avgColorComponent(getRGB_b(a),getRGB_b(b),f));
}

function saturationChange(r, g, b, l) {
	
	var avg = (r+g+b)/3;	
	r = Math.max(Math.min(-avg * l + r * (1+l),255),0);
	g = Math.max(Math.min(-avg * l + g * (1+l),255),0);
	b = Math.max(Math.min(-avg * l + b * (1+l),255),0);
		
	return r*0x10000 + g*0x100+ b;
}

