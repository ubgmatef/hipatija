/**
 * Util
 * author	Aleksandar Vilimonovic [avmusa@ekoklubzeljin.org.yu]
 *
 * designed as a class
 * exports as GLOBAL OBJECT Util
 * use Util's members as static objects
 */
var Util = {
	// sets CSS for element, using DOM
	setCss: function(obj, style){
		if(obj == null)
			throw("Target object does not exist.");
		if(style == null)
			throw("Style object does not exist. Try setting it manually.");
		for(var el in style){
			obj.style[el] = style[el];
		}
	},
	
	// set document's element position (depends on scrolling)
	// element must be absolutely positioned [style.position = "absolute"]
	setPosition: function(el, aLeft, aTop){
		with(document){
			aTop += body.scrollTop;
			aLeft += body.scrollLeft;
			this.setCss(el, {left: aLeft, top: aTop});
		}
	},

	// cheks if `array` contains `element`
	arrContains: function(array, element){
		for(var i = 0; i < array.length; i++)
			if(element == array[i])
				return true;
		return false;
	}
}
