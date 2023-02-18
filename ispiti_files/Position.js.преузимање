// DEPS: 
/**
 * Position
 * version	1.0
 * author	Aleksandar Vilimonovic [avmusa@ekoklubzeljin.org.yu]
 */
// `id` is either an object or object's id whose position and size we look for
function Position(id)
{
	if(id == null)
		throw("Object's ID cannot be NULL.");
	if(typeof(id) == "object")
		this.obj = id;
	else if(typeof(id) != "string")
		throw("ID's type must be STRING (since it is not an object).");
	else
	{
		this.obj = document.getElementById(id);
		if(this.obj == null)
			throw("Desired object is NULL.");
	}
	this.left	= 	null;
	this.top	=	null;
	this.width	=	null;
	this.height	=	null;
	
	this.init();
}

Position.prototype = {
	init: function()
	{
		var el = this.obj;
		// width
		if(el.offsetWidth)
			this.width += el.offsetWidth;
		else if(el.width)
			this.width += el.width;
		// height
		if(el.offsetHeight)
			this.height += el.offsetHeight;
		else if(el.height)
			this.height += el.height;
		// offset
		if(el.offsetParent)
			while (el.offsetParent)
			{
				this.left += el.offsetLeft;
				this.top += el.offsetTop;
				el = el.offsetParent;
			}
		else
		{
			if(el.x) this.left += el.x;
			if(el.y) this.top += el.y;
		}	
	},
	
	update: function()
	{
		this.init();
	},
	
	toString: function()
	{
		return "["+this.obj.id+"] left: "+this.left+", top: "+this.top+", width: "+this.width+", height: "+this.height;
	}
}
