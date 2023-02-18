var INNER_POPUP_ID = "editAreaId";
var INNER_POPUP_TINT_ID = 'innerPopupTintId';
var INNER_IFRAME_ID = 'innerIframeId';
var ESCAPE_KEY_CODE = 27;
var CLOSE_BTN_ID = 'closeBtnId';

// Funkcija tzdragg: Coded by TheZillion [thezillion.wordpress.com]
var tzdragg = function(){
	return {
		move : function(divid,xpos,ypos){
        			var a = document.getElementById(divid);
					a.style.left = xpos + 'px';
					a.style.top = ypos + 'px';
				},
		startMoving : function(evt){
						evt = evt || window.event;
						var posX = evt.clientX,
							posY = evt.clientY,
							a = document.getElementById(INNER_POPUP_ID),
							divTop = a.style.top,
							divLeft = a.style.left;
							divTop = divTop.replace('px','');
							divLeft = divLeft.replace('px','');
						var diffX = posX - divLeft,
							diffY = posY - divTop;
						document.onmousemove = function(evt){
								evt = evt || window.event;
								var posX = evt.clientX,
									posY = evt.clientY,
									aX = posX - diffX,
									aY = posY - diffY;
								tzdragg.move(INNER_POPUP_ID,aX,aY);
        					}
                   },
		stopMoving : function(){
						var a = document.createElement('script');
						document.onmousemove = function(){}
					}
				}
			}();

function check(form, cbName, val)
{
	if(form == null)
		return false;
	var cb = form[cbName];
	if(cb == null)
		return false;
	cb.checked = val;
	return true;
}
//##########################################################
function allCheckboxes(formName, checked)
{
	var form = document.forms[formName];
	if(form == null)
		return false;
	var fields = form.getElementsByTagName("input");
	for(var i = 0; i < fields.length; i++)
		if(fields[i].type.toLowerCase() == "checkbox")
			fields[i].checked = checked;
	return true;
}

function checkAll(formName)
{
	return allCheckboxes(formName, true);
}

function clearAll(formName)
{
	return allCheckboxes(formName, false);
}

function invertCheck(formName)
{
	var form = document.forms[formName];
	if(form == null)
		return false;
	var fields = form.getElementsByTagName("input");
	for(var i = 0; i < fields.length; i++)
		if(fields[i].type.toLowerCase() == "checkbox")
			fields[i].checked = (fields[i].checked ? false : true);
	return true;
}
//##########################################################
//##########################################################
function edit(path, aWidth, aHeight)
{
	edit(path, aWidth, aHeight, false);
	addInnerPopupListener();
}
function edit(path, aWidth, aHeight, modal)
{
	innerPopup(path, aWidth, aHeight, modal);
	addInnerPopupListener();
}

// Koristi se i iz JSP-ova
function closeInnerPopup(doc)
{
	if (doc == undefined)
		doc = document;

	var tint = doc.getElementById(INNER_POPUP_TINT_ID);

	if (tint != null)
		doc.body.removeChild(tint);

	var cont = doc.getElementById(INNER_POPUP_ID);

	if (cont != null)
		doc.body.removeChild(cont);
}

//##########################################################
/*
 * Creates INNER POPUP within current window
 * `path` - path of document to be loaded
 * `aWidth` - desired width of the popup
 * `aHeight` - desired height of the popup
 *
 * when main windows reloads, popup is destroyed
 */
function innerPopup(path, aWidth, aHeight, modal)
{
	closeInnerPopup(document);

	with(document)
	{
		var visibleWidth, visibleHeight;

		// popup position and scrolling
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

		if (aWidth + 30 > visibleWidth)
			aWidth = visibleWidth - 30;

		if (aHeight + 30 > visibleHeight)
			aHeight = visibleHeight - 30;

		if (aWidth <= 0)
			aWidth = 1;

		if (aHeight <= 0)
			aHeight = 1;

		// main content element that wraps other
		var cont = createElement("div");
		cont.id = INNER_POPUP_ID;
			setCssLook(cont, {
					border: "3px solid"
					, backgroundColor: "#FFFFFF"
					, width: aWidth
					, height: (aHeight+=20) // increase by header's height
					, zIndex: 1000
				});

		if(!isMSIE() || isMSIE11()) // browser dependent
		{
			cont.onmousedown = tzdragg.startMoving;
			cont.onmouseup = tzdragg.stopMoving;
		}
	
		// table container
		var t = createElement("table");
			setCssLook(t, {
					   		borderCollapse: "collapse"
							, width: "100%"
						   , height: "100%"
						   , padding: 0
					   });
		// table header	
		var thd = createElement("thead");
		var tr = createElement("tr");
			setCssLook(tr, {
					   		height: "20px" 					// HEADER'S HEIGHT
							, backgroundColor: "#CCCCCC"
				   });
		td = createElement("td");
			setCssLook(td, {
					textAlign: "right"
					, verticalAlign: "middle"
					, padding: "0 3px"
				  });
		// close button within header
		var closeBtn = createElement("a");
			closeBtn.id = CLOSE_BTN_ID;
			closeBtn.innerHTML = "затвори &times;";
			closeBtn.href = "javascript: ;";
			setCssLook(closeBtn, {
					   		textDecoration: "none"
							, color: "#000000"
							, fontWeight: "bold"
							, textAlign: "center"
					   });

			// ako je dijalog modalni, ova funkcija ce biti zamenjena drugom (nize u kodu)
			closeBtn.onclick = function(e)
			{
				if (window && window.parent && typeof(window.parent.prePopupRemove) == "function")
					window.parent.prePopupRemove(window);
				
				body.removeChild(cont);
				return(false);
			}
		td.appendChild(closeBtn);
		tr.appendChild(td);
		thd.appendChild(tr);
		t.appendChild(thd);
		
		// popup position and scrolling
		if(isMSIE() && !isMSIE11()) // browser dependent ;-)
		{
			setCssLook(cont, {
						position: "absolute"
					});
			setPosition(cont, (visibleWidth - aWidth)/2, (visibleHeight - aHeight)/2);
	
			window.onscroll = function(e)
			{
				setPosition(cont, (visibleWidth - aWidth)/2, (visibleHeight - aHeight)/2);
			}
		}
		else
		{
			setCssLook(cont, {
						position: "fixed"
						, left: (visibleWidth - aWidth)/2
						, top: (visibleHeight - aHeight)/2
					});
		}
		
		// table body
		var tbd = createElement("tbody");
		tr = createElement("tr");
		td = createElement("td");
			setCssLook(td, {
					   		padding: 5
					   });
		// loads document refered by `path`
		var ifr = createElement("iframe");
			ifr.id = INNER_IFRAME_ID;
			ifr.name = INNER_IFRAME_ID;	// postavlja se ime frejma, da bi mogao PostParamLink da se otvori u njemu
			//##################
			ifr.src = path;
			//##################
			ifr.frameBorder = 0;
			setCssLook(ifr, {
					   width: "100%"
					   , height: "100%"
					  });
		
		td.appendChild(ifr);
		tr.appendChild(td);
		tbd.appendChild(tr);
		t.appendChild(tbd);
		
		cont.appendChild(t);
		body.appendChild(cont);
				
		// Creating a tinting div behind content div
		if (modal)
		{
			var tint = createElement("div");
			tint.id = INNER_POPUP_TINT_ID;
			setCssLook(tint, {
				display: "block", 
				backgroundColor: "black",
				width: body.scrollWidth, 
				height: body.scrollHeight, 
				position: "absolute", 
				left: 0, 
				top: 0, 
				zIndex: cont.style.zIndex - 1
				}
			);
				
			var opacity = 25;

			if (isMSIE())
			{
				if (isMSIE11())
					tint.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
				tint.style.filter = "alpha(opacity=" + opacity + ")";
			}
			else
			{
				tint.style.MozOpacity = opacity / 100.0; // For old version of FF
				tint.style.opacity = opacity / 100.0; // Works at least in FF and Opera
			}
			
			closeBtn.onclick = function (e)
			{
				 if (window && window.parent && typeof(window.parent.prePopupRemove) == "function")
					 window.parent.prePopupRemove(window);
				 
				body.removeChild(cont);
				body.removeChild(tint);
			}
			
			body.appendChild(tint);
			return(false);
		}
	}
}

function addInnerPopupListener()
{
    var iframe = document.getElementById(INNER_IFRAME_ID);
    var iframeDoc = isMSIE() ? iframe.contentWindow.document : iframe.contentWindow;
    
    // kod Opere se ne moze dodati dogadja na iframe, stoga kad je fokusiran edit prozor esc ne radi
    if (document.addEventListener)
    {
	document.addEventListener('keydown', esc, false);
	iframeDoc.addEventListener('keydown', esc, false);
    }
    else if (document.attachEvent)
    {
	document.attachEvent('onkeydown', esc);
	iframeDoc.attachEvent('onkeydown', esc);
    }
    else
    {
	document.onkeydown = esc;
	iframeDoc.onkeydown = esc;
    }
}

function esc(e)
{
    var e = e || window.event; 
    var div = document.getElementById(INNER_POPUP_ID);
    var ifr = document.getElementById(INNER_IFRAME_ID);
    var cb = document.getElementById(CLOSE_BTN_ID);
    var isWithoutForms = $(ifr).contents().find('form').length == 0; 
    var isEscape = (e.keyCode || e.which) == ESCAPE_KEY_CODE;
    
    if (isEscape && isWithoutForms)
	closeInnerPopup(document);

}

// UTIL FUNCTIONS
//##########################################################
// sets CSS for element, using DOM
if(typeof(setCssLook) == "undefined")
{
	function setCssLook(obj, style)
	{
		if(obj == null)
			return false;
		for(var el in style)
		{
			try
			{
				obj.style[el] = style[el]; // if style can be applied
			}
			catch(e)
			{}
		}
	}
}
//##########################################################
// sets position of element
if(typeof(setPosition) == "undefined")
{
	function setPosition(el, aLeft, aTop)
	{
		with(document)
		{
			aTop += body.scrollTop;
			aLeft += body.scrollLeft;
			setCssLook(el, {
						left: aLeft+"px",
						top: aTop+"px"
					});
		}
	}
}
