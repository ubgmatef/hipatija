// DEPS:	Util.js

var WIDTH = 320;
var DURATION = 1000;
var REPORT_ID = "reportId";
var REPORT_TINT_ID = 'reportTintId';

function Report(messages)
{
	this.id = REPORT_ID;
	this.title = null;
	this.messages = new Array();
	for(var i = 0; i < messages.length; i++)
		this.messages.push(messages[i]);
	this.container = null;
	this.tint = null;
}

Report.prototype = {
	init: function()
	{
		with(document)
		{
			var obj = this;
			// remove old report
			var table = getElementById(this.id);

			if(table)
				table.parentNode.removeChild(table);

			table = createElement("table");

			Util.setCss(table, {
				fontFamily: "Verdana,Arial",
				fontSize: "12px",
				borderCollapse: "collapse",
				width: WIDTH,
				backgroundColor: "#CCCCCC",
				border: "2px solid #000000",
				zIndex: 1000
			});
			table.id = this.id;

			var thead, tbody, tr, td;

			thead = createElement("thead");
			Util.setCss(thead, {
				fontSize: "12px",
				//backgroundColor: "#004080",
				color: "#FFFFFF"});
			tr = createElement("tr");

			td = createElement("td");
			Util.setCss(td, {
				fontWeight: "bold",
				padding: "3px"
			});
			td.innerHTML = this.title ? this.title : "";
			tr.appendChild(td);

			td = createElement("td");
			Util.setCss(td, {
				width: "auto",
				textAlign: "right",
				verticalAlign: "middle"
			});

			var btn = createElement("a");
			btn.innerHTML = "затвори&#160;&times;";
			Util.setCss(btn, {
				textDecoration: "none",
				color: "#FFFFFF"
			});
			btn.href = "about:blank";
			btn.onclick = function(e)
			{
				var report = getElementById(obj.id);

				if(report)
					report.parentNode.removeChild(report);

				var containerTint = getElementById(REPORT_TINT_ID);

				if(containerTint)
					containerTint.parentNode.removeChild(containerTint);

				return(false);
			}

			td.appendChild(btn);
			tr.appendChild(td);

			thead.appendChild(tr);
			table.appendChild(thead);

			tbody = createElement("tbody");
			for(var i = 0; i < this.messages.length; i++)
			{
				tr = createElement("tr");
				td = createElement("td");
				Util.setCss(td, {
					padding: "1px",
					borderBottom: "1px solid #999999"
				});
				td.colSpan = 2;
				td.innerHTML = this.messages[i];
				tr.appendChild(td);
				tbody.appendChild(tr);
			}
			table.appendChild(tbody);

			var visibleWidth, visibleHeight;
			var aWidth = WIDTH;
			var aHeight = 20 * (this.messages.length + 1);

			if (isMSIE())
			{
				visibleWidth = body.clientWidth;
				visibleHeight = body.clientHeight;
			}
			else
			{
				visibleWidth = window.innerWidth;
				visibleHeight = window.innerHeight;
			}

			// Position and scrolling
			if(isMSIE())
			{
				Util.setCss(table, {
					position: "absolute",
					right: (visibleWidth - aWidth)/2 + body.scrollLeft,
					top: (visibleHeight - aHeight)/2 + body.scrollTop
				});

				window.onscroll = function(e)
				{
					Util.setCss(table, {
						top: body.scrollTop
					});
				}
			}
			else
			{
				Util.setCss(table, {
					position: "fixed",
					right: (visibleWidth - aWidth)/2,
					top: (visibleHeight - aHeight)/2
				});
			}

			this.container = table;

			var tint = getElementById(REPORT_TINT_ID);

			if(tint)
				tint.parentNode.removeChild(tint);

			// Creating a tinting div behind content div
			var tint = document.createElement("div");
			tint.id = REPORT_TINT_ID;
			Util.setCss(tint, {
				display: "block",
				backgroundColor: "black",
				width: Math.max(visibleWidth, body.scrollWidth),
				height: Math.max(visibleHeight, body.scrollHeight),
				position: "absolute",
				left: 0,
				top: 0,
				zIndex: table.style.zIndex - 1
			});

			var opacity = 70;

			if (isMSIE())
			{
				tint.style.filter = "alpha(opacity=" + opacity + ")";
			}
			else
			{
				tint.style.MozOpacity = opacity / 100.0; // For old version of FF
				tint.style.opacity = opacity / 100.0; // Works at least in FF and Opera
			}

			this.tint = tint;
		}
	},

	show: function()
	{
		if(this.container)
		{
			jQuery(document.body).append(this.container);

			var top = parseInt(this.container.style.top);

			if(isMSIE())
				top -= document.body.scrollTop;

			jQuery(this.container).animate({
				"top": "-=" + top + "px",
				"right": "-=" + this.container.style.right
			}, DURATION);
		}

		if(this.tint)
		{
			jQuery(document.body).append(this.tint);
			jQuery(this.tint).fadeOut(isMSIE() ? 350 : DURATION);
		}
	},

	destroy: function()
	{
		if(this.container)
			document.body.removeChild(this.container);

		if(this.tint)
			document.body.removeChild(this.tint);

		this.container = null;
		this.tint = null;
	}
}

// Predefined reports
function report()
{
	var r = new Report(arguments);
	r.title = "Custom Report";
	r.init();
	r.show();
	return r;
}

function reportError()
{
	var r = new Report(arguments);
	r.title = "<span style=\"font-weight: bold;\">ГРЕШКА</span>";
	r.init();
	r.show();
	return r;
}

// REPORT FORM VALIDATION ERROR
function reportEditFormValidation(messages)
{
	var r = new Report(messages);
	r.title = "<span style=\"font-weight: bold;\">Неисправна поља формулара</span>";
	r.init();
	r.show();
	return r;
}

// REPORT OBJECT PROPERTIES
function reportObjectProperties(obj)
{
	var props = new Array();

	if(!obj)
		props.push("Object is NULL");
	else
	{
		for(var p in obj)
			props.push(p + ": " +obj[p]);
	}

	var r = new Report(props);
	r.title = "Object Properties";
	r.init();
	r.show();
	return r;
}
