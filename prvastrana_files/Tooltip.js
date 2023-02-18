// DEPS:	Util.js

/**
 * Tooltip
 * version	1.1
 * author	Aleksandar Vilimonovic [avmusa@ekoklubzeljin.org.yu]
 */

function Tooltip(objOrId, content, random)
{
	if(objOrId == null)
		throw("Refered object cannot be NULL.");
	var refObj = null;
	if(typeof(objOrId) == "object")
		refObj = objOrId;
	else if(typeof(objOrId) != "string")
		throw("ID's type must be STRING (since it is not an object).");
	else
	{
		refObj = document.getElementById(objOrId);
		if(refObj == null)
			throw("Refered object is NULL.");
	}

	this.id = "_tooltip_" + (random ? Math.random() : objOrId);
	this.refObj = refObj;
	this.container = null;

	this.init(content);
}

Tooltip.prototype = {
	init : function(content)
	{
		var tt = this;

		with(document)
		{
			var c = createElement("div");
			if (this.refObj.id != null && this.refObj.id.indexOf("prozivkaVreme-") == 0)
				c.id = "_tooltip_" + this.refObj.id;
			else
				c.id = this.id;
			
			if(typeof(content) == "object")
				c.appendChild(content);
			else
				c.innerHTML = content;
				
			Util.setCss(c, {
							position: "absolute",
							border: "1px solid",
							backgroundColor: "#CCCCFF",
							padding: 2,
							display: "none",
							fontSize: "10px",
							maxWidth: "400px",
							fontFamily: "Verdana,Arial"
							
					   });
			this.container = c;
			body.appendChild(this.container);

			// Add onMouseOver etc actions for referred element
			addEvent(this.refObj, "mouseover", function(e) { tt.show(e); });
			addEvent(this.refObj, "mouseout", function(e) { tt.hide(e); });
			addEvent(this.refObj, 'mousemove', function(e) { tt.move(e); });

			addEvent(document.getElementsByTagName('body')[0], 'contextmenu', function(e) { tt.hide(e); });
			addEvent(window, 'scroll', function(e) { tt.hide(e); });
			addEvent(window, 'click',  function(e) { tt.hide(e); });
		}
	},

	show: function(e)
	{
		if(!this.container.disabled)
		{
			this.container.style.display = "";
			this.move(e);
		}
	},

	hide: function(e)
	{
		this.container.style.display = "none";
	},
	
	disable: function(e)
	{
		this.container.disabled = true;
		this.hide(e);
	},
	
	enable: function(e)
	{
		this.container.disabled = false;
	},	

    move: function(e)
    {
		if(this.container.disabled)
			return;
		
		var x, y, scrollX, scrollY;

		// Get mouse position
		if (e.pageY)
		{
			x = e.pageX;
			y = e.pageY;

			if (document.documentElement && document.documentElement.scrollTop)
			{
				scrollX = document.documentElement.scrollLeft;
				scrollY = document.documentElement.scrollTop;
			}
			else if (document.body)
			{
				scrollX = document.body.scrollLeft;
				scrollY = document.body.scrollTop;
			}
			else
				scrollX = scrollY = 0;
		}
		else if (window.event && document.documentElement && document.documentElement.scrollTop)
		{
			scrollX = document.documentElement.scrollLeft;
			scrollY = document.documentElement.scrollTop;

			x = window.event.clientX + scrollX;
			y = window.event.clientY + scrollY;
		}
		else if (window.event && document.body)
		{
			scrollX = document.body.scrollLeft;
			scrollY = document.body.scrollTop;

			x = window.event.clientX + scrollX;
			y = window.event.clientY + scrollY;
		}
		else
		{
			x = 640;
			y = 480;
			scrollX = scrollY = 0;
		}

		// Get window dimensions
		var vis_width, vis_height;

		if (self.innerHeight)
		{
			vis_width = self.innerWidth;
			vis_height = self.innerHeight;
		}
		else if (document.documentElement.clientHeight)
		{
			vis_width = document.documentElement.clientWidth;
			vis_height = document.documentElement.clientHeight;
		}
		else if (document.body.clientHeight)
		{
			vis_width = document.body.clientWidth;
			vis_height = document.body.clientHeight;
		}
		else
		{
			vis_width = 640;
			vis_height = 480;
		}

		// Set new tooltype position
		var tt = this;

		if (isMSIE())
		{
			tt.container.style.width = 'auto';

			if (tt.container.offsetWidth > 400)
				tt.container.style.width = 400 + 'px';
		}

		var left = ((vis_width / 2) < x - scrollX)
				? (x - tt.container.offsetWidth)
				: (x + 12);

		if (left < 0)
			left = 0;

		var top = ((vis_height / 2) < y - scrollY)
			? (y - tt.container.offsetHeight - 10)
			: (y + 10);

		if (top < 0)
			top = 0;

		tt.container.style.left = left + 'px';
		tt.container.style.top = top + 'px';
	}
}
