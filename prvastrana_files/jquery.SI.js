jQuery.SI = {
	Form: {
		focusFirst: function(){
			for(var i = 0; i < document.forms.length; i++){
				for(var j = 0; j < document.forms[i].elements.length; j++){
					if(document.forms[i].elements[j].type != "hidden"
							&& (document.forms[i].className == null
								|| document.forms[i].className.indexOf("postParamLink") === -1))
					{
						document.forms[i].elements[j].focus();
						return;
					}
				}
			}
		},
		validate: function(form, additionalConditions){
			if(!form) return false;
			if(form.nodeName != "FORM") return false;
			
			var required = jQuery(".required", form);
			var first;
			jQuery(required).each(function(i){
				jQuery(required[i]).removeClass("invalid");
				if(!jQuery(required[i]).val())
				{
					jQuery(required[i]).addClass("invalid");
					if(!first)	first = required[i];
				}
			});
			
			if(first)
			{
				first.focus();
				return false;
			}
			
			if(additionalConditions && additionalConditions() == false)
				return false;
			
			return true;
		}
	}
};
