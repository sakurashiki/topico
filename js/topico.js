/*********************************************
 * topico.js - https://github.com/qkwkw/topico
 * Copyright (c) 2015 Sakurashiki
 * Released under the MIT license
 */
if( !document.addEventListener ) {
	alert("Your browser it too old. It can't work.");
} else {
	var html     = document.querySelector("html"),
	    head     = document.querySelector("head"),
		position = html.getAttribute("tpc-position");

	// set default style
	var defaultStyle = document.createElement("STYLE");
	defaultStyle.textContent =
		".topico {"+
			"position : absolute;"+
			"width :30%;"+
			"z-index : 10000000;"+
		"}"+
		".topico_items{"+
			"width:100%;"+
			"clear:both;"+
			"padding:3% 0%;"+
			"border-bottom:1px dotted gray;"+
		"}"+
		".topico_img {"+
			"float:left;"+
			"width:20%;"+
			"margin-right:5%;"+
		"}"+
		"";
	if( position === "right" ) {
		defaultStyle.textContent += ".topico {right : 1%;}";
	} else {
		defaultStyle.textContent += ".topico {left : 1%;}";		
	}
	head.appendChild(defaultStyle);


	document.addEventListener("DOMContentLoaded",function(){

		var body               = document.querySelector("body"),
		    url                = html.getAttribute("tpc-jsonp-url"),
		    callbackMethodName = html.getAttribute("tpc-jsonp-methodname"),
		    pollingSpan        = parseInt(html.getAttribute("tpc-polling-span")),
		    animateDuration    = parseInt(html.getAttribute("tpc-animate-duration")),
		    hashTag            = html.getAttribute("tpc-hashtag"),
		    commentIds         = [],
		    animationFrame     = 0,
		    script             = undefined;

		// check parameters and throw errors.
		if( !url || !callbackMethodName ) {
			console.log("HTML Document does't have enough parameters.");
			return;
		}
		if( !pollingSpan ) {
			pollingSpan = 15000;
		}
		if ( !animateDuration ) {
			animateDuration = 60;
		}

		// initialize view block
		var views = body.querySelectorAll(".topico");
		if( !views.length ) {
			views = [];
			var view = document.createElement("DIV");
			view.setAttribute("class","topico");
			body.appendChild(view);
			views.push(view);
		};

		// insert new comment to views.
		var addComment = function( obj ) {
			for( var i=0, length = views.length; i<length ; i++ ) {
				// create outer frame.
				var outer = document.createElement("DIV");
				outer.setAttribute("class","topico_items");
				outer.setAttribute("tpc-animating","true");

				// set user image
				var img = new Image();
				img.setAttribute("class","topico_img");
				img.src = obj.user_img;
				outer.appendChild(img);

				// set user name
				var userId = document.createElement("DIV");
				userId.setAttribute("class","topico_user_id");
				userId.textContent = "@"+obj.user_id;
				outer.appendChild(userId);

				// set comment text
				var text = document.createElement("DIV");
				text.setAttribute("class","topico_text");
				var dengerText = obj.text;
				dengerText = dengerText.replace("<","&lt;");
				dengerText = dengerText.replace(">","&gt;");
				dengerText = dengerText.replace('"',"&quot;");
				dengerText = dengerText.replace("#"+hashTag,"");
				text.textContent = dengerText
				outer.appendChild(text);

				// shift element to array 'views[i]' by dom api.
				if( views[i].childNodes.length ) {
					views[i].insertBefore(outer,views[i].childNodes[0]);
				} else {
					views[i].appendChild(outer);
				}
					
			}
		};

		// move and animate comments
		var moveComments = function() {
			animationFrame++;
			if( animateDuration < animationFrame ) {
				for( var i=0, length_i = views.length; i<length_i ; i++ ) {
					var view = views[i];
					for( var j=0, length_j = view.childNodes.length; j<length_j ; j++ ) {
						var tweet = view.childNodes[j];
						if( tweet.getAttribute("tpc-animating") === "true" ) {
							tweet.setAttribute("tpc-animating","false");
							tweet.style.marginLeft= "0%";
							tweet.style.opacity= "1.0";
							tweet.style.transform= "scaleY(1.0)";
							tweet.style.WebkitTransform= "scaleY(1.0)";
						} else {
							break;
						}
					}
				}

				animationFrame = 0;
			} else {
				var range = 1.0*animationFrame/animateDuration;
				for( var i=0, length = views.length; i<length ; i++ ) {
					var view = views[i];
					for( var j=0, length_j = view.childNodes.length; j<length_j ; j++ ) {
						var tweet = view.childNodes[j];
						if( tweet.getAttribute("tpc-animating") === "true" ) {
							tweet.style.marginLeft = ((position==="right")?-1:+1)*250*Math.sin(Math.PI*(1-range)/2)+"%";
							var sinRange =Math.sin(Math.PI*(range)/2);
							tweet.style.opacity = sinRange;
							tweet.style.transform= "scaleY("+sinRange+")";
							tweet.style.WebkitTransform= "scaleY("+sinRange+")";
						} else {
							break;
						}
					}
				}
				setTimeout(moveComments,1000/60);
			}
		};

		// generate JSONP request
		var request = function() {
			script = document.createElement("SCRIPT");
			script.setAttribute("src",url);
			head.appendChild(script);		
		};

		// JSONP Method
		var callback = function(text) {
			head.removeChild(script);
			var obj = JSON.parse(text);
			var hasNewComment = false;
			// set comments
			for( var i=obj.length-1; 0<=i ; i-- ) {
				if( !commentIds[obj[i].id] ) {
					commentIds[obj[i].id] = true;
					addComment(obj[i]);
					hasNewComment = true;
				}
			}
			// do animating comment on views.
			if( hasNewComment ) {
				moveComments();
			}
			setTimeout(request,pollingSpan);
		};

		// Begin This Script
		window[callbackMethodName] = callback;
		request();
	},false);
}
