(function($) {
	 var value = 0;
	 $(document.body).append("<div class='zoomDiv'><div class='wai'><img class='bigimg' src=''/></div></div><div class='zoomMask'></div>");
	 $(".zoomDiv").css({"z-index":"9999","position":"absolute","top":"0px","left":"0px","width":"500px","height":"500px","background":"#ffffff","border":"1px solid #CCCCCC","display":"none","text-align":"center","overflow":"hidden"});
	 $(".zoomMask").css({"position":"absolute","cursor":"move","z-index":"9999"});
	//  $('#rotLeft').click(function(){
    //             value += 90;
	// 			console.log('111')
    //             // $("#rotImg").rotate({animateTo:parseInt(value)});
    //             // $(".bigimg").rotate({animateTo:parseInt(value)});
    //           });
    //   $('#rotRight').click(function(){
	// 	        value -= 90;
	// 	        // $("#rotImg").rotate({animateTo:parseInt(value)});
	// 	        // $(".bigimg").rotate({animateTo:parseInt(value)});
    //   });
	$.fn.imagezoom = function(options) {
		var settings = {
			xzoom: 310,
			yzoom: 310,
			offset: 10,
			position: "BTR",
			preload: 1,
			xwidth:80,
			xheight:80
		};
		if (options) {
			$.extend(settings, options);
		}
		var noalt = '';
		var self = this;
		// var bigimage = $(this).attr("src");
		// var ImgObj=new Image();
		//     ImgObj.src= bigimage;
		//      if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)){
		     	
		//      }else{
		//      	return false;
		//      }
		$(this).bind("mousemove", function(ev) {
			var imageLeft = $(this).offset().left;
			var imageTop = $(this).offset().top;
			var imageWidth = $(this).get(0).offsetWidth;
			var imageHeight = $(this).get(0).offsetHeight;
			var boxLeft = $(this).parent().offset().left;
			var boxTop = $(this).parent().offset().top;
			var boxWidth = $(this).parent().width();
			var boxHeight = $(this).parent().height();
			var length=$("div.zoomDiv").get().length;
			$("div.zoomMask").css("display","");
			$("div.zoomDiv").css("display","");
			noalt = $(this).attr("alt");
			var bigimage = $(this).attr("src");
			$(this).attr("alt", '');
			// if (length == 0) {
				$(".bigimg").attr("src",bigimage);
				// $(document.body).append("<div class='zoomDiv'><img class='bigimg' src='" + bigimage + "'/></div><div class='zoomMask'>&nbsp;</div>");
			// }
			if (settings.position == "BTR") {
				if (boxLeft + boxWidth + settings.offset + settings.xzoom > screen.width) {
					leftpos = boxLeft - settings.offset - settings.xzoom;
				} else {
					leftpos = boxLeft + boxWidth + settings.offset;
				}
			} else {
				leftpos = imageLeft - settings.xzoom - settings.offset;
				if (leftpos < 0) {
					leftpos = imageLeft + imageWidth + settings.offset;
				}
			}
			$("div.zoomDiv").css({
				top: boxTop,
				left: leftpos
			});
			$("div.zoomDiv").width(settings.xzoom);
			$("div.zoomDiv").height(settings.yzoom);
			$("div.zoomDiv").show();
			// $(this).css('cursor', 'crosshair');
			$(document.body).mousemove(function(e) {
				var i=$("#rotImg")[0].style.transform.substring($("#rotImg")[0].style.transform.indexOf("(") + 1, $("#rotImg")[0].style.transform.indexOf("d"))
				if(!(i%180==0)){
					mouse = new MouseEvent(e);
					if (mouse.x < imageLeft || mouse.x > imageLeft + imageWidth || mouse.y < imageTop || mouse.y > imageTop + imageHeight) {
						mouseOutImage();
						return;
					}
					var bigwidth = $(".bigimg").get(0).offsetWidth;
					var bigheight = $(".bigimg").get(0).offsetHeight;
					var scaley = 'x';
					var scalex = 'y';
					if (isNaN(scalex) | isNaN(scaley)) {
						var scalex = (bigwidth / imageWidth);
						var scaley = (bigheight / imageHeight);
						if(bigwidth<200 || bigheight<200){
							$("div.zoomMask").width(settings.xwidth);
							$("div.zoomMask").height(settings.xheight);
						}
						else{
							$("div.zoomMask").width((settings.xzoom) / scaley);
							$("div.zoomMask").height((settings.yzoom) / scalex);
							$("div.zoomMask").css('visibility', 'visible');
						}
						
					};
					$(".wai").css({"width":$(".bigimg").get(0).height,"height":$(".bigimg").get(0).width,"overflow":"hidden"})
					$(".bigimg").css({"position":"absolute","top":($(".bigimg").get(0).width-$(".bigimg").get(0).height)/2+"px","left":-($(".bigimg").get(0).width-$(".bigimg").get(0).height)/2+"px"})
					xpos = mouse.x - $("div.zoomMask").width() / 2;
					ypos = mouse.y - $("div.zoomMask").height() / 2;
					xposs = mouse.x - $("div.zoomMask").width() / 2 - imageLeft;
					yposs = mouse.y - $("div.zoomMask").height() / 2 - imageTop;
					xpos = (mouse.x - $("div.zoomMask").width() / 2 < imageLeft) ? imageLeft : (mouse.x + $("div.zoomMask").width() / 2 > imageWidth + imageLeft) ? (imageWidth + imageLeft - $("div.zoomMask").width()) : xpos;
					ypos = (mouse.y - $("div.zoomMask").height() / 2 < imageTop) ? imageTop : (mouse.y + $("div.zoomMask").height() / 2 > imageHeight + imageTop) ? (imageHeight + imageTop - $("div.zoomMask").height()) : ypos;
					$("div.zoomMask").css({
						top: ypos,
						left: xpos
					});
					$("div.zoomDiv").get(0).scrollLeft = xposs * scaley;
					$("div.zoomDiv").get(0).scrollTop = yposs * scalex;
				}
				else{
					mouse = new MouseEvent(e);
					if (mouse.x < imageLeft || mouse.x > imageLeft + imageWidth || mouse.y < imageTop || mouse.y > imageTop + imageHeight) {
						mouseOutImage();
						return;
					}
					var bigwidth = $(".bigimg").get(0).offsetWidth;
					var bigheight = $(".bigimg").get(0).offsetHeight;
					var scaley = 'x';
					var scalex = 'y';
					if (isNaN(scalex) | isNaN(scaley)) {
						var scalex = (bigwidth / imageWidth);
						var scaley = (bigheight / imageHeight);
						if(bigwidth<200 || bigheight<200){
							$("div.zoomMask").width(settings.xwidth);
							$("div.zoomMask").height(settings.xheight);
						}
						else{
							$("div.zoomMask").width((settings.xzoom) / scalex);
							$("div.zoomMask").height((settings.yzoom) / scaley);
							$("div.zoomMask").css('visibility', 'visible');
						}
						
					};
					$(".wai").css({"width":"","height":"","overflow":"visible"})
					$(".bigimg").css({"position":"relative","top":0,"left":0})
					xpos = mouse.x - $("div.zoomMask").width() / 2;
					ypos = mouse.y - $("div.zoomMask").height() / 2;
					xposs = mouse.x - $("div.zoomMask").width() / 2 - imageLeft;
					yposs = mouse.y - $("div.zoomMask").height() / 2 - imageTop;
					xpos = (mouse.x - $("div.zoomMask").width() / 2 < imageLeft) ? imageLeft : (mouse.x + $("div.zoomMask").width() / 2 > imageWidth + imageLeft) ? (imageWidth + imageLeft - $("div.zoomMask").width()) : xpos;
					ypos = (mouse.y - $("div.zoomMask").height() / 2 < imageTop) ? imageTop : (mouse.y + $("div.zoomMask").height() / 2 > imageHeight + imageTop) ? (imageHeight + imageTop - $("div.zoomMask").height()) : ypos;
					$("div.zoomMask").css({
						top: ypos,
						left: xpos
					});
					$("div.zoomDiv").get(0).scrollLeft = xposs * scalex;
					$("div.zoomDiv").get(0).scrollTop = yposs * scaley;
				}
			});
		});

		function mouseOutImage() {
			$(self).attr("alt", noalt);
			$(document.body).unbind("mousemove");
			$("div.zoomMask").css("display","none");
			$("div.zoomDiv").css("display","none");
			// $("div.zoomMask").remove();
			// $("div.zoomDiv").remove();
		}
		count = 0;
		// if (settings.preload) {
		// 	$('body').append("<div style='display:none;' class='jqPreload" + count + "'></div>");
		// 	$(this).each(function() {
		// 		var imagetopreload = $(this).attr("rel");
		// 		var content = jQuery('div.jqPreload' + count + '').html();
		// 		jQuery('div.jqPreload' + count + '').html(content + '<img src=\"' + imagetopreload + '\">');
		// 	});
		// }
	}
})(jQuery);

function MouseEvent(e) {
	this.x = e.pageX;
	this.y = e.pageY;
}