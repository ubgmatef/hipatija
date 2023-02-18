function el(id)
{
	return document.getElementById(id);
}

function findPosX(obj)
{
	var curleft = 0;
	if (obj.offsetParent)
	{
		curleft += obj.offsetWidth;
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft;
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function findPosY(obj)
{
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}

function showMenu(parentId, id)
{
	var p = el(parentId);
	if(p == null) return;

	var s = el(id);
	if(s == null) return;

	var bHeight = document.body.offsetHeight;
	if(isMSIE())
		bHeight += document.body.scrollTop;

	var posP = new Position(p);

	s.style.display = "block";
	var posS = new Position(s);

	posS.top = posP.top;
	if(posS.top + posS.height > bHeight)
		posS.top -= posS.top + posS.height - bHeight;
	
	setCssLook(s, {top: posS.top, left: posP.left + posP.width});
}

function hideMenu(id)
{
	var m = el(id);
	if(m == null) return;
	m.style.display = "none";
}
