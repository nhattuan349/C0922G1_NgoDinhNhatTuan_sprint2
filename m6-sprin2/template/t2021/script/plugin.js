/*-- author:phongbv@hurama.com --*/
//jcarousel
(function($) {
    $.fn.jCarouselLite = function(o) {
        o = $.extend({
            btnPrev: null,
            btnNext: null,
            btnGo: null,
            mouseWheel: false,
            auto: null,
            hoverPause: false,
            speed: 200,
            easing: null,
            vertical: false,
            circular: true,
            visible: 3,
            start: 0,
            scroll: 1,
            beforeStart: null,
            afterEnd: null
        }, o || {});
        return this.each(function() {
            var running = false,
                animCss = o.vertical ? "top" : "left",
                sizeCss = o.vertical ? "height" : "width";
            var div = $(this),
                ul = $("ul", div),
                tLi = $("li", ul),
                tl = tLi.size(),
                v = o.visible;
            if (o.circular) {
                ul.prepend(tLi.slice(tl - v + 1).clone()).append(tLi.slice(0, o.scroll).clone());
                o.start += v - 1
            }
            var li = $("li", ul),
                itemLength = li.size(),
                curr = o.start;
            div.css("visibility", "visible");
            li.css({
                overflow: "hidden",
                float: o.vertical ? "none" : "left"
            });
            ul.css({
                margin: "0",
                padding: "0",
                position: "relative",
                "list-style-type": "none",
                "z-index": "1"
            });
            div.css({
                overflow: "hidden",
                position: "relative",
                "z-index": "2",
                left: "0px"
            });
            var liSize = o.vertical ? height(li) : width(li);
            var ulSize = liSize * itemLength;
            var divSize = liSize * v;
            li.css({
                width: li.width(),
                height: li.height()
            });
            ul.css(sizeCss, ulSize + "px").css(animCss, -(curr * liSize));
            div.css(sizeCss, divSize + "px");
            if (o.btnPrev) {
                $(o.btnPrev).click(function() {
                    return go(curr - o.scroll)
                });
                if (o.hoverPause) {
                    $(o.btnPrev).hover(function() {
                        stopAuto()
                    }, function() {
                        startAuto()
                    })
                }
            }
            if (o.btnNext) {
                $(o.btnNext).click(function() {
                    return go(curr + o.scroll)
                });
                if (o.hoverPause) {
                    $(o.btnNext).hover(function() {
                        stopAuto()
                    }, function() {
                        startAuto()
                    })
                }
            }
            if (o.btnGo) $.each(o.btnGo, function(i, val) {
                $(val).click(function() {
                    return go(o.circular ? o.visible + i : i)
                })
            });
            if (o.mouseWheel && div.mousewheel) div.mousewheel(function(e, d) {
                return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll)
            });
            var autoInterval;

            function startAuto() {
                stopAuto();
                autoInterval = setInterval(function() {
                    go(curr + o.scroll)
                }, o.auto + o.speed)
            };

            function stopAuto() {
                clearInterval(autoInterval)
            };
            if (o.auto) {
                if (o.hoverPause) {
                    div.hover(function() {
                        stopAuto()
                    }, function() {
                        startAuto()
                    })
                }
                startAuto()
            };

            function vis() {
                return li.slice(curr).slice(0, v)
            };

            function go(to) {
                if (!running) {
                    if (o.beforeStart) o.beforeStart.call(this, vis());
                    if (o.circular) {
                        if (to < 0) {
                            ul.css(animCss, -((curr + tl) * liSize) + "px");
                            curr = to + tl
                        } else if (to > itemLength - v) {
                            ul.css(animCss, -((curr - tl) * liSize) + "px");
                            curr = to - tl
                        } else curr = to
                    } else {
                        if (to < 0 || to > itemLength - v) return;
                        else curr = to
                    }
                    running = true;
                    ul.animate(animCss == "left" ? {
                        left: -(curr * liSize)
                    } : {
                        top: -(curr * liSize)
                    }, o.speed, o.easing, function() {
                        if (o.afterEnd) o.afterEnd.call(this, vis());
                        running = false
                    });
                    if (!o.circular) {
                        $(o.btnPrev + "," + o.btnNext).removeClass("disabled");
                        $((curr - o.scroll < 0 && o.btnPrev) || (curr + o.scroll > itemLength - v && o.btnNext) || []).addClass("disabled")
                    }
                }
                return false
            }
        })
    };

    function css(el, prop) {
        return parseInt($.css(el[0], prop)) || 0
    };

    function width(el) {
        return el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight')
    };

    function height(el) {
        return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom')
    }
})(jQuery);
//jcookie
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
            } else {
                date = options.expires
            }
            expires = '; expires=' + date.toUTCString()
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('')
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break
                }
            }
        }
        return cookieValue
    }
};
//lightbox.v1 with maxWidth-maxHeight
(function($) {
    $.fn.lightBox = function(settings) {
        settings = jQuery.extend({
            maxHeight: 700,
            maxWidth: 1000,
            overlayBgColor: '#000',
            overlayOpacity: 0.8,
            fixedNavigation: false,
            imageLoading: '/template/default/images/lightbox-ico-loading.gif',
            imageBtnPrev: '/template/default/images/lightbox-btn-prev.gif',
            imageBtnNext: '/template/default/images/lightbox-btn-next.gif',
            imageBtnClose: '/template/default/images/lightbox-btn-close.gif',
            imageBlank: '/template/default/images/lightbox-blank.gif',
            containerBorderSize: 10,
            containerResizeSpeed: 400,
            txtImage: 'Image',
            txtOf: 'of',
            keyToClose: 'c',
            keyToPrev: 'p',
            keyToNext: 'n',
            imageArray: [],
            activeImage: 0
        }, settings);
        var jQueryMatchedObj = this;

        function _initialize() {
            _start(this, jQueryMatchedObj);
            return false
        }

        function _start(objClicked, jQueryMatchedObj) {
            $('embed, object, select').css({
                'visibility': 'hidden'
            });
            _set_interface();
            settings.imageArray.length = 0;
            settings.activeImage = 0;
            if (jQueryMatchedObj.length == 1) {
                settings.imageArray.push(new Array(objClicked.getAttribute('href'), objClicked.getAttribute('title')))
            } else {
                for (var i = 0; i < jQueryMatchedObj.length; i++) {
                    settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'), jQueryMatchedObj[i].getAttribute('title')))
                }
            }
            while (settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href')) {
                settings.activeImage++
            }
            _set_image_to_view()
        }

        function _set_interface() {
            $('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>');
            var arrPageSizes = ___getPageSize();
            $('#jquery-overlay').css({
                backgroundColor: settings.overlayBgColor,
                opacity: settings.overlayOpacity,
                width: arrPageSizes[0],
                height: arrPageSizes[1]
            }).fadeIn();
            var arrPageScroll = ___getPageScroll();
            $('#jquery-lightbox').css({
                top: arrPageScroll[1] + (arrPageSizes[3] / 10),
                left: arrPageScroll[0]
            }).show();
            $('#jquery-overlay,#jquery-lightbox').click(function() {
                _finish()
            });
            $('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
                _finish();
                return false
            });
            $(window).resize(function() {
                var arrPageSizes = ___getPageSize();
                $('#jquery-overlay').css({
                    width: arrPageSizes[0],
                    height: arrPageSizes[1]
                });
                var arrPageScroll = ___getPageScroll();
                $('#jquery-lightbox').css({
                    top: arrPageScroll[1] + (arrPageSizes[3] / 10),
                    left: arrPageScroll[0]
                })
            })
        }

        function _set_image_to_view() {
            $('#lightbox-loading').show();
            if (settings.fixedNavigation) {
                $('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide()
            } else {
                $('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide()
            }
            var objImagePreloader = new Image();
            objImagePreloader.onload = function() {
                $('#lightbox-image').attr('src', settings.imageArray[settings.activeImage][0]);
                _resize_container_image_box(objImagePreloader.width, objImagePreloader.height);
                objImagePreloader.onload = function() {}
            };
            objImagePreloader.src = settings.imageArray[settings.activeImage][0]
        };

        function _resize_container_image_box(intImageWidth, intImageHeight) {
            if ((settings.maxWidth != null && settings.maxHeight != null) && (intImageWidth > settings.maxWidth || intImageHeight > settings.maxHeight)) {
                var isWider = intImageWidth > intImageHeight;
                var scale = isWider ? settings.maxWidth / intImageWidth : settings.maxHeight / intImageHeight;
                intImageWidth = intImageWidth * scale;
                intImageHeight = intImageHeight * scale
            }
            $('#lightbox-image').height(intImageHeight);
            $('#lightbox-image').width(intImageWidth);
            var intCurrentWidth = $('#lightbox-container-image-box').width();
            var intCurrentHeight = $('#lightbox-container-image-box').height();
            var intWidth = (intImageWidth + (settings.containerBorderSize * 2));
            var intHeight = (intImageHeight + (settings.containerBorderSize * 2));
            var intDiffW = intCurrentWidth - intWidth;
            var intDiffH = intCurrentHeight - intHeight;
            $('#lightbox-container-image-box').animate({
                width: intWidth,
                height: intHeight
            }, settings.containerResizeSpeed, function() {
                _show_image()
            });
            if ((intDiffW == 0) && (intDiffH == 0)) {
                if ($.browser.msie) {
                    ___pause(250)
                } else {
                    ___pause(100)
                }
            }
            $('#lightbox-container-image-data-box').css({
                width: intImageWidth
            });
            $('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({
                height: intImageHeight + (settings.containerBorderSize * 2)
            })
        };

        function _show_image() {
            $('#lightbox-loading').hide();
            $('#lightbox-image').fadeIn(function() {
                _show_image_data();
                _set_navigation()
            });
            _preload_neighbor_images()
        };

        function _show_image_data() {
            $('#lightbox-container-image-data-box').slideDown('fast');
            $('#lightbox-image-details-caption').hide();
            if (settings.imageArray[settings.activeImage][1]) {
                $('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show()
            }
            if (settings.imageArray.length > 1) {
                $('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + (settings.activeImage + 1) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show()
            }
        }

        function _set_navigation() {
            $('#lightbox-nav').show();
            $('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({
                'background': 'transparent url(' + settings.imageBlank + ') no-repeat'
            });
            if (settings.activeImage != 0) {
                if (settings.fixedNavigation) {
                    $('#lightbox-nav-btnPrev').css({
                        'background': 'url(' + settings.imageBtnPrev + ') left 15% no-repeat'
                    }).unbind().bind('click', function() {
                        settings.activeImage = settings.activeImage - 1;
                        _set_image_to_view();
                        return false
                    })
                } else {
                    $('#lightbox-nav-btnPrev').unbind().hover(function() {
                        $(this).css({
                            'background': 'url(' + settings.imageBtnPrev + ') left 15% no-repeat'
                        })
                    }, function() {
                        $(this).css({
                            'background': 'transparent url(' + settings.imageBlank + ') no-repeat'
                        })
                    }).show().bind('click', function() {
                        settings.activeImage = settings.activeImage - 1;
                        _set_image_to_view();
                        return false
                    })
                }
            }
            if (settings.activeImage != (settings.imageArray.length - 1)) {
                if (settings.fixedNavigation) {
                    $('#lightbox-nav-btnNext').css({
                        'background': 'url(' + settings.imageBtnNext + ') right 15% no-repeat'
                    }).unbind().bind('click', function() {
                        settings.activeImage = settings.activeImage + 1;
                        _set_image_to_view();
                        return false
                    })
                } else {
                    $('#lightbox-nav-btnNext').unbind().hover(function() {
                        $(this).css({
                            'background': 'url(' + settings.imageBtnNext + ') right 15% no-repeat'
                        })
                    }, function() {
                        $(this).css({
                            'background': 'transparent url(' + settings.imageBlank + ') no-repeat'
                        })
                    }).show().bind('click', function() {
                        settings.activeImage = settings.activeImage + 1;
                        _set_image_to_view();
                        return false
                    })
                }
            }
            _enable_keyboard_navigation()
        }

        function _enable_keyboard_navigation() {
            $(document).keydown(function(objEvent) {
                _keyboard_action(objEvent)
            })
        }

        function _disable_keyboard_navigation() {
            $(document).unbind()
        }

        function _keyboard_action(objEvent) {
            if (objEvent == null) {
                keycode = event.keyCode;
                escapeKey = 27
            } else {
                keycode = objEvent.keyCode;
                escapeKey = objEvent.DOM_VK_ESCAPE
            }
            key = String.fromCharCode(keycode).toLowerCase();
            if ((key == settings.keyToClose) || (key == 'x') || (keycode == escapeKey)) {
                _finish()
            }
            if ((key == settings.keyToPrev) || (keycode == 37)) {
                if (settings.activeImage != 0) {
                    settings.activeImage = settings.activeImage - 1;
                    _set_image_to_view();
                    _disable_keyboard_navigation()
                }
            }
            if ((key == settings.keyToNext) || (keycode == 39)) {
                if (settings.activeImage != (settings.imageArray.length - 1)) {
                    settings.activeImage = settings.activeImage + 1;
                    _set_image_to_view();
                    _disable_keyboard_navigation()
                }
            }
        }

        function _preload_neighbor_images() {
            if ((settings.imageArray.length - 1) > settings.activeImage) {
                objNext = new Image();
                objNext.src = settings.imageArray[settings.activeImage + 1][0]
            }
            if (settings.activeImage > 0) {
                objPrev = new Image();
                objPrev.src = settings.imageArray[settings.activeImage - 1][0]
            }
        }

        function _finish() {
            $('#jquery-lightbox').remove();
            $('#jquery-overlay').fadeOut(function() {
                $('#jquery-overlay').remove()
            });
            $('embed, object, select').css({
                'visibility': 'visible'
            })
        }

        function ___getPageSize() {
            var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY) {
                xScroll = window.innerWidth + window.scrollMaxX;
                yScroll = window.innerHeight + window.scrollMaxY
            } else if (document.body.scrollHeight > document.body.offsetHeight) {
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight
            } else {
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight
            }
            var windowWidth, windowHeight;
            if (self.innerHeight) {
                if (document.documentElement.clientWidth) {
                    windowWidth = document.documentElement.clientWidth
                } else {
                    windowWidth = self.innerWidth
                }
                windowHeight = self.innerHeight
            } else if (document.documentElement && document.documentElement.clientHeight) {
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight
            } else if (document.body) {
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight
            }
            if (yScroll < windowHeight) {
                pageHeight = windowHeight
            } else {
                pageHeight = yScroll
            }
            if (xScroll < windowWidth) {
                pageWidth = xScroll
            } else {
                pageWidth = windowWidth
            }
            arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
            return arrayPageSize
        };

        function ___getPageScroll() {
            var xScroll, yScroll;
            if (self.pageYOffset) {
                yScroll = self.pageYOffset;
                xScroll = self.pageXOffset
            } else if (document.documentElement && document.documentElement.scrollTop) {
                yScroll = document.documentElement.scrollTop;
                xScroll = document.documentElement.scrollLeft
            } else if (document.body) {
                yScroll = document.body.scrollTop;
                xScroll = document.body.scrollLeft
            }
            arrayPageScroll = new Array(xScroll, yScroll);
            return arrayPageScroll
        };

        function ___pause(ms) {
            var date = new Date();
            curDate = null;
            do {
                var curDate = new Date()
            } while (curDate - date < ms)
        };
        return this.unbind('click').click(_initialize)
    }
})(jQuery);
//columnize--------
(function($) {
    $.fn.columnize = function(options) {
        var defaults = {
            width: 400,
            columns: false,
            buildOnce: false,
            overflow: false,
            doneFunc: function() {},
            target: false,
            ignoreImageLoading: true,
            float: "left",
            lastNeverTallest: false
        };
        var options = $.extend(defaults, options);
        return this.each(function() {
            var $inBox = options.target ? $(options.target) : $(this);
            var maxHeight = $(this).height();
            var $cache = $('<div></div>');
            var lastWidth = 0;
            var columnizing = false;
            $cache.append($(this).children().clone(true));
            if (!options.ignoreImageLoading && !options.target) {
                if (!$inBox.data("imageLoaded")) {
                    $inBox.data("imageLoaded", true);
                    if ($(this).find("img").length > 0) {
                        var func = function($inBox, $cache) {
                            return function() {
                                if (!$inBox.data("firstImageLoaded")) {
                                    $inBox.data("firstImageLoaded", "true");
                                    $inBox.empty().append($cache.children().clone(true));
                                    $inBox.columnize(options)
                                }
                            }
                        }($(this), $cache);
                        $(this).find("img").one("load", func);
                        $(this).find("img").one("abort", func);
                        return
                    }
                }
            }
            $inBox.empty();
            columnizeIt();
            if (!options.buildOnce) {
                $(window).resize(function() {
                    if (!options.buildOnce && $.browser.msie) {
                        if ($inBox.data("timeout")) {
                            clearTimeout($inBox.data("timeout"))
                        }
                        $inBox.data("timeout", setTimeout(columnizeIt, 200))
                    } else if (!options.buildOnce) {
                        columnizeIt()
                    } else {}
                })
            }

            function columnize($putInHere, $pullOutHere, $parentColumn, height) {
                while ($parentColumn.height() < height && $pullOutHere[0].childNodes.length) {
                    $putInHere.append($pullOutHere[0].childNodes[0])
                }
                if ($putInHere[0].childNodes.length == 0) return;
                var kids = $putInHere[0].childNodes;
                var lastKid = kids[kids.length - 1];
                $putInHere[0].removeChild(lastKid);
                var $item = $(lastKid);
                if ($item[0].nodeType == 3) {
                    var oText = $item[0].nodeValue;
                    var counter2 = options.width / 18;
                    if (options.accuracy) counter2 = options.accuracy;
                    var columnText;
                    var latestTextNode = null;
                    while ($parentColumn.height() < height && oText.length) {
                        if (oText.indexOf(' ', counter2) != '-1') {
                            columnText = oText.substring(0, oText.indexOf(' ', counter2))
                        } else {
                            columnText = oText
                        }
                        latestTextNode = document.createTextNode(columnText);
                        $putInHere.append(latestTextNode);
                        if (oText.length > counter2) {
                            oText = oText.substring(oText.indexOf(' ', counter2))
                        } else {
                            oText = ""
                        }
                    }
                    if ($parentColumn.height() >= height && latestTextNode != null) {
                        $putInHere[0].removeChild(latestTextNode);
                        oText = latestTextNode.nodeValue + oText
                    }
                    if (oText.length) {
                        $item[0].nodeValue = oText
                    } else {
                        return false
                    }
                }
                if ($pullOutHere.children().length) {
                    $pullOutHere.prepend($item)
                } else {
                    $pullOutHere.append($item)
                }
                return $item[0].nodeType == 3
            }

            function split($putInHere, $pullOutHere, $parentColumn, height) {
                if ($pullOutHere.children().length) {
                    $cloneMe = $pullOutHere.children(":first");
                    $clone = $cloneMe.clone(true);
                    if ($clone.attr("nodeType") == 1 && !$clone.hasClass("dontend")) {
                        $putInHere.append($clone);
                        if ($clone.is("img") && $parentColumn.height() < height + 20) {
                            $cloneMe.remove()
                        } else if (!$cloneMe.hasClass("dontsplit") && $parentColumn.height() < height + 20) {
                            $cloneMe.remove()
                        } else if ($clone.is("img") || $cloneMe.hasClass("dontsplit")) {
                            $clone.remove()
                        } else {
                            $clone.empty();
                            if (!columnize($clone, $cloneMe, $parentColumn, height)) {
                                if ($cloneMe.children().length) {
                                    split($clone, $cloneMe, $parentColumn, height)
                                }
                            }
                            if ($clone.get(0).childNodes.length == 0) {
                                $clone.remove()
                            }
                        }
                    }
                }
            }

            function singleColumnizeIt() {
                if ($inBox.data("columnized") && $inBox.children().length == 1) {
                    return
                }
                $inBox.data("columnized", true);
                $inBox.data("columnizing", true);
                $inBox.empty();
                $inBox.append($("<div class='first last column' style='width:98%; padding: 3px; float: " + options.float + ";'></div>"));
                $col = $inBox.children().eq($inBox.children().length - 1);
                $destroyable = $cache.clone(true);
                if (options.overflow) {
                    targetHeight = options.overflow.height;
                    columnize($col, $destroyable, $col, targetHeight);
                    if (!$destroyable.children().find(":first-child").hasClass("dontend")) {
                        split($col, $destroyable, $col, targetHeight)
                    }
                    while (checkDontEndColumn($col.children(":last").length && $col.children(":last").get(0))) {
                        var $lastKid = $col.children(":last");
                        $lastKid.remove();
                        $destroyable.prepend($lastKid)
                    }
                    var html = "";
                    var div = document.createElement('DIV');
                    while ($destroyable[0].childNodes.length > 0) {
                        var kid = $destroyable[0].childNodes[0];
                        for (var i = 0; i < kid.attributes.length; i++) {
                            if (kid.attributes[i].nodeName.indexOf("jQuery") == 0) {
                                kid.removeAttribute(kid.attributes[i].nodeName)
                            }
                        }
                        div.innerHTML = "";
                        div.appendChild($destroyable[0].childNodes[0]);
                        html += div.innerHTML
                    }
                    var overflow = $(options.overflow.id)[0];
                    overflow.innerHTML = html
                } else {
                    $col.append($destroyable)
                }
                $inBox.data("columnizing", false);
                if (options.overflow) {
                    options.overflow.doneFunc()
                }
            }

            function checkDontEndColumn(dom) {
                if (dom.nodeType != 1) return false;
                if ($(dom).hasClass("dontend")) return true;
                if (dom.childNodes.length == 0) return false;
                return checkDontEndColumn(dom.childNodes[dom.childNodes.length - 1])
            }

            function columnizeIt() {
                if (lastWidth == $inBox.width()) return;
                lastWidth = $inBox.width();
                var numCols = Math.round($inBox.width() / options.width);
                if (options.columns) numCols = options.columns;
                if (numCols <= 1) {
                    return singleColumnizeIt()
                }
                if ($inBox.data("columnizing")) return;
                $inBox.data("columnized", true);
                $inBox.data("columnizing", true);
                $inBox.empty();
                $inBox.append($("<div style='width:" + (Math.round(100 / numCols) - 2) + "%; padding: 3px; float: " + options.float + ";'></div>"));
                $col = $inBox.children(":last");
                $col.append($cache.clone());
                maxHeight = $col.height();
                $inBox.empty();
                var targetHeight = maxHeight / numCols;
                var firstTime = true;
                var maxLoops = 3;
                var scrollHorizontally = false;
                if (options.overflow) {
                    maxLoops = 1;
                    targetHeight = options.overflow.height
                } else if (options.height && options.width) {
                    maxLoops = 1;
                    targetHeight = options.height;
                    scrollHorizontally = true
                }
                for (var loopCount = 0; loopCount < maxLoops; loopCount++) {
                    $inBox.empty();
                    var $destroyable;
                    try {
                        $destroyable = $cache.clone(true)
                    } catch (e) {
                        $destroyable = $cache.clone()
                    }
                    $destroyable.css("visibility", "hidden");
                    for (var i = 0; i < numCols; i++) {
                        var className = (i == 0) ? "first column" : "column";
                        var className = (i == numCols - 1) ? ("last " + className) : className;
                        $inBox.append($("<div class='" + className + "' style='width:" + (Math.round(100 / numCols) - 2) + "%; float: " + options.float + ";'></div>"))
                    }
                    var i = 0;
                    while (i < numCols - (options.overflow ? 0 : 1) || scrollHorizontally && $destroyable.children().length) {
                        if ($inBox.children().length <= i) {
                            $inBox.append($("<div class='" + className + "' style='width:" + (Math.round(100 / numCols) - 2) + "%; float: " + options.float + ";'></div>"))
                        }
                        var $col = $inBox.children().eq(i);
                        columnize($col, $destroyable, $col, targetHeight);
                        if (!$destroyable.children().find(":first-child").hasClass("dontend")) {
                            split($col, $destroyable, $col, targetHeight)
                        } else {}
                        while (checkDontEndColumn($col.children(":last").length && $col.children(":last").get(0))) {
                            var $lastKid = $col.children(":last");
                            $lastKid.remove();
                            $destroyable.prepend($lastKid)
                        }
                        i++
                    }
                    if (options.overflow && !scrollHorizontally) {
                        var IE6 = false /*@cc_on||@_jscript_version<5.7@*/ ;
                        var IE7 = (document.all) && (navigator.appVersion.indexOf("MSIE 7.") != -1);
                        if (IE6 || IE7) {
                            var html = "";
                            var div = document.createElement('DIV');
                            while ($destroyable[0].childNodes.length > 0) {
                                var kid = $destroyable[0].childNodes[0];
                                for (var i = 0; i < kid.attributes.length; i++) {
                                    if (kid.attributes[i].nodeName.indexOf("jQuery") == 0) {
                                        kid.removeAttribute(kid.attributes[i].nodeName)
                                    }
                                }
                                div.innerHTML = "";
                                div.appendChild($destroyable[0].childNodes[0]);
                                html += div.innerHTML
                            }
                            var overflow = $(options.overflow.id)[0];
                            overflow.innerHTML = html
                        } else {
                            $(options.overflow.id).empty().append($destroyable.children().clone(true))
                        }
                    } else if (!scrollHorizontally) {
                        $col = $inBox.children().eq($inBox.children().length - 1);
                        while ($destroyable.children().length) $col.append($destroyable.children(":first"));
                        var afterH = $col.height();
                        var diff = afterH - targetHeight;
                        var totalH = 0;
                        var min = 10000000;
                        var max = 0;
                        var lastIsMax = false;
                        $inBox.children().each(function($inBox) {
                            return function($item) {
                                var h = $inBox.children().eq($item).height();
                                lastIsMax = false;
                                totalH += h;
                                if (h > max) {
                                    max = h;
                                    lastIsMax = true
                                }
                                if (h < min) min = h
                            }
                        }($inBox));
                        var avgH = totalH / numCols;
                        if (options.lastNeverTallest && lastIsMax) {
                            targetHeight = targetHeight + 30;
                            if (loopCount == maxLoops - 1) maxLoops++
                        } else if (max - min > 30) {
                            targetHeight = avgH + 30
                        } else if (Math.abs(avgH - targetHeight) > 20) {
                            targetHeight = avgH
                        } else {
                            loopCount = maxLoops
                        }
                    } else {
                        $inBox.children().each(function(i) {
                            $col = $inBox.children().eq(i);
                            $col.width(options.width + "px");
                            if (i == 0) {
                                $col.addClass("first")
                            } else if (i == $inBox.children().length - 1) {
                                $col.addClass("last")
                            } else {
                                $col.removeClass("first");
                                $col.removeClass("last")
                            }
                        });
                        $inBox.width($inBox.children().length * options.width + "px")
                    }
                    $inBox.append($("<br style='clear:both;'>"))
                }
                $inBox.find('.column').find(':first.removeiffirst').remove();
                $inBox.find('.column').find(':last.removeiflast').remove();
                $inBox.data("columnizing", false);
                if (options.overflow) {
                    options.overflow.doneFunc()
                }
                options.doneFunc()
            }
        })
    }
})(jQuery);
//treeview----------
(function($) {
    $.extend($.fn, {
        swapClass: function(c1, c2) {
            var c1Elements = this.filter('.' + c1);
            this.filter('.' + c2).removeClass(c2).addClass(c1);
            c1Elements.removeClass(c1).addClass(c2);
            return this
        },
        replaceClass: function(c1, c2) {
            return this.filter('.' + c1).removeClass(c1).addClass(c2).end()
        },
        hoverClass: function(className) {
            className = className || "hover";
            return this.hover(function() {
                $(this).addClass(className)
            }, function() {
                $(this).removeClass(className)
            })
        },
        heightToggle: function(animated, callback) {
            animated ? this.animate({
                height: "toggle"
            }, animated, callback) : this.each(function() {
                jQuery(this)[jQuery(this).is(":hidden") ? "show" : "hide"]();
                if (callback) callback.apply(this, arguments)
            })
        },
        heightHide: function(animated, callback) {
            if (animated) {
                this.animate({
                    height: "hide"
                }, animated, callback)
            } else {
                this.hide();
                if (callback) this.each(callback)
            }
        },
        prepareBranches: function(settings) {
            if (!settings.prerendered) {
                this.filter(":last-child:not(ul)").addClass(CLASSES.last);
                this.filter((settings.collapsed ? "" : "." + CLASSES.closed) + ":not(." + CLASSES.open + ")").find(">ul").hide()
            }
            return this.filter(":has(>ul)")
        },
        applyClasses: function(settings, toggler) {
            this.filter(":has(>ul):not(:has(>a))").find(">span").click(function(event) {
                toggler.apply($(this).next())
            }).add($("a", this)).hoverClass();
            if (!settings.prerendered) {
                this.filter(":has(>ul:hidden)").addClass(CLASSES.expandable).replaceClass(CLASSES.last, CLASSES.lastExpandable);
                this.not(":has(>ul:hidden)").addClass(CLASSES.collapsable).replaceClass(CLASSES.last, CLASSES.lastCollapsable);
                this.prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea).each(function() {
                    var classes = "";
                    $.each($(this).parent().attr("class").split(" "), function() {
                        classes += this + "-hitarea "
                    });
                    $(this).addClass(classes)
                })
            }
            this.find("div." + CLASSES.hitarea).click(toggler)
        },
        treeview: function(settings) {
            settings = $.extend({
                cookieId: "treeview"
            }, settings);
            if (settings.add) {
                return this.trigger("add", [settings.add])
            }
            if (settings.toggle) {
                var callback = settings.toggle;
                settings.toggle = function() {
                    return callback.apply($(this).parent()[0], arguments)
                }
            }

            function treeController(tree, control) {
                function handler(filter) {
                    return function() {
                        toggler.apply($("div." + CLASSES.hitarea, tree).filter(function() {
                            return filter ? $(this).parent("." + filter).length : true
                        }));
                        return false
                    }
                }
                $("a:eq(0)", control).click(handler(CLASSES.collapsable));
                $("a:eq(1)", control).click(handler(CLASSES.expandable));
                $("a:eq(2)", control).click(handler())
            }

            function toggler() {
                $(this).parent().find(">.hitarea").swapClass(CLASSES.collapsableHitarea, CLASSES.expandableHitarea).swapClass(CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea).end().swapClass(CLASSES.collapsable, CLASSES.expandable).swapClass(CLASSES.lastCollapsable, CLASSES.lastExpandable).find(">ul").heightToggle(settings.animated, settings.toggle);
                if (settings.unique) {
                    $(this).parent().siblings().find(">.hitarea").replaceClass(CLASSES.collapsableHitarea, CLASSES.expandableHitarea).replaceClass(CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea).end().replaceClass(CLASSES.collapsable, CLASSES.expandable).replaceClass(CLASSES.lastCollapsable, CLASSES.lastExpandable).find(">ul").heightHide(settings.animated, settings.toggle)
                }
            }

            function serialize() {
                function binary(arg) {
                    return arg ? 1 : 0
                }
                var data = [];
                branches.each(function(i, e) {
                    data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0
                });
                $.cookie(settings.cookieId, data.join(""))
            }

            function deserialize() {
                var stored = $.cookie(settings.cookieId);
                if (stored) {
                    var data = stored.split("");
                    branches.each(function(i, e) {
                        $(e).find(">ul")[parseInt(data[i]) ? "show" : "hide"]()
                    })
                }
            }
            this.addClass("treeview");
            var branches = this.find("li").prepareBranches(settings);
            switch (settings.persist) {
                case "cookie":
                    var toggleCallback = settings.toggle;
                    settings.toggle = function() {
                        serialize();
                        if (toggleCallback) {
                            toggleCallback.apply(this, arguments)
                        }
                    };
                    deserialize();
                    break;
                case "location":
                    var current = this.find("a").filter(function() {
                        return this.href.toLowerCase() == location.href.toLowerCase()
                    });
                    if (current.length) {
                        current.addClass("selected").parents("ul, li").add(current.next()).show()
                    }
                    break
            }
            branches.applyClasses(settings, toggler);
            if (settings.control) {
                treeController(this, settings.control);
                $(settings.control).show()
            }
            return this.bind("add", function(event, branches) {
                $(branches).prev().removeClass(CLASSES.last).removeClass(CLASSES.lastCollapsable).removeClass(CLASSES.lastExpandable).find(">.hitarea").removeClass(CLASSES.lastCollapsableHitarea).removeClass(CLASSES.lastExpandableHitarea);
                $(branches).find("li").andSelf().prepareBranches(settings).applyClasses(settings, toggler)
            })
        }
    });
    var CLASSES = $.fn.treeview.classes = {
        open: "open",
        closed: "closed",
        expandable: "expandable",
        expandableHitarea: "expandable-hitarea",
        lastExpandableHitarea: "lastExpandable-hitarea",
        collapsable: "collapsable",
        collapsableHitarea: "collapsable-hitarea",
        lastCollapsableHitarea: "lastCollapsable-hitarea",
        lastCollapsable: "lastCollapsable",
        lastExpandable: "lastExpandable",
        last: "last",
        hitarea: "hitarea"
    };
    $.fn.Treeview = $.fn.treeview
})(jQuery);
//easing--------------------
//jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b}});
//superfish-----------------
(function($) {
    $.fn.superfish = function(op) {
        var sf = $.fn.superfish,
            c = sf.c,
            $arrow = $(['<span class="', c.arrowClass, '"> &#187;</span>'].join('')),
            over = function() {
                var $$ = $(this),
                    menu = getMenu($$);
                clearTimeout(menu.sfTimer);
                $$.showSuperfishUl().siblings().hideSuperfishUl()
            },
            out = function() {
                var $$ = $(this),
                    menu = getMenu($$),
                    o = sf.op;
                clearTimeout(menu.sfTimer);
                menu.sfTimer = setTimeout(function() {
                    o.retainPath = ($.inArray($$[0], o.$path) > -1);
                    $$.hideSuperfishUl();
                    if (o.$path.length && $$.parents(['li.', o.hoverClass].join('')).length < 1) {
                        over.call(o.$path)
                    }
                }, o.delay)
            },
            getMenu = function($menu) {
                var menu = $menu.parents(['ul.', c.menuClass, ':first'].join(''))[0];
                sf.op = sf.o[menu.serial];
                return menu
            },
            addArrow = function($a) {
                $a.addClass(c.anchorClass).append($arrow.clone())
            };
        return this.each(function() {
            var s = this.serial = sf.o.length;
            var o = $.extend({}, sf.defaults, op);
            o.$path = $('li.' + o.pathClass, this).slice(0, o.pathLevels).each(function() {
                $(this).addClass([o.hoverClass, c.bcClass].join(' ')).filter('li:has(ul)').removeClass(o.pathClass)
            });
            sf.o[s] = sf.op = o;
            $('li:has(ul)', this)[($.fn.hoverIntent && !o.disableHI) ? 'hoverIntent' : 'hover'](over, out).each(function() {
                if (o.autoArrows) addArrow($('>a:first-child', this))
            }).not('.' + c.bcClass).hideSuperfishUl();
            var $a = $('a', this);
            $a.each(function(i) {
                var $li = $a.eq(i).parents('li');
                $a.eq(i).focus(function() {
                    over.call($li)
                }).blur(function() {
                    out.call($li)
                })
            });
            o.onInit.call(this)
        }).each(function() {
            var menuClasses = [c.menuClass];
            if (sf.op.dropShadows && !($.browser.msie && $.browser.version < 7)) menuClasses.push(c.shadowClass);
            $(this).addClass(menuClasses.join(' '))
        })
    };
    var sf = $.fn.superfish;
    sf.o = [];
    sf.op = {};
    sf.IE7fix = function() {
        var o = sf.op;
        if ($.browser.msie && $.browser.version > 6 && o.dropShadows && o.animation.opacity != undefined) this.toggleClass(sf.c.shadowClass + '-off')
    };
    sf.c = {
        bcClass: 'sf-breadcrumb',
        menuClass: 'sf-js-enabled',
        anchorClass: 'sf-with-ul',
        arrowClass: 'sf-sub-indicator',
        shadowClass: 'sf-shadow'
    };
    sf.defaults = {
        hoverClass: 'sfHover',
        pathClass: 'overideThisToUse',
        pathLevels: 1,
        delay: 800,
        animation: {
            opacity: 'show'
        },
        speed: 'normal',
        autoArrows: true,
        dropShadows: true,
        disableHI: false,
        onInit: function() {},
        onBeforeShow: function() {},
        onShow: function() {},
        onHide: function() {}
    };
    $.fn.extend({
        hideSuperfishUl: function() {
            var o = sf.op,
                not = (o.retainPath === true) ? o.$path : '';
            o.retainPath = false;
            var $ul = $(['li.', o.hoverClass].join(''), this).add(this).not(not).removeClass(o.hoverClass).find('>ul').hide().css('visibility', 'hidden');
            o.onHide.call($ul);
            return this
        },
        showSuperfishUl: function() {
            var o = sf.op,
                sh = sf.c.shadowClass + '-off',
                $ul = this.addClass(o.hoverClass).find('>ul:hidden').css('visibility', 'visible');
            sf.IE7fix.call($ul);
            o.onBeforeShow.call($ul);
            $ul.animate(o.animation, o.speed, function() {
                sf.IE7fix.call($ul);
                o.onShow.call($ul)
            });
            return this
        }
    })
})(jQuery);
//hoverIntent----------
(function($) {
    $.fn.hoverIntent = function(f, g) {
        var cfg = {
            sensitivity: 7,
            interval: 100,
            timeout: 0
        };
        cfg = $.extend(cfg, g ? {
            over: f,
            out: g
        } : f);
        var cX, cY, pX, pY;
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY
        };
        var compare = function(ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
                $(ob).unbind("mousemove", track);
                ob.hoverIntent_s = 1;
                return cfg.over.apply(ob, [ev])
            } else {
                pX = cX;
                pY = cY;
                ob.hoverIntent_t = setTimeout(function() {
                    compare(ev, ob)
                }, cfg.interval)
            }
        };
        var delay = function(ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return cfg.out.apply(ob, [ev])
        };
        var handleHover = function(e) {
            var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
            while (p && p != this) {
                try {
                    p = p.parentNode
                } catch (e) {
                    p = this
                }
            }
            if (p == this) {
                return false
            }
            var ev = jQuery.extend({}, e);
            var ob = this;
            if (ob.hoverIntent_t) {
                ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t)
            }
            if (e.type == "mouseover") {
                pX = ev.pageX;
                pY = ev.pageY;
                $(ob).bind("mousemove", track);
                if (ob.hoverIntent_s != 1) {
                    ob.hoverIntent_t = setTimeout(function() {
                        compare(ev, ob)
                    }, cfg.interval)
                }
            } else {
                $(ob).unbind("mousemove", track);
                if (ob.hoverIntent_s == 1) {
                    ob.hoverIntent_t = setTimeout(function() {
                        delay(ev, ob)
                    }, cfg.timeout)
                }
            }
        };
        return this.mouseover(handleHover).mouseout(handleHover)
    }
})(jQuery);
//------------------tooltip----------------
/*(function($){jQuery.fn.tooltip=function(options){var defaults={offsetX:15,offsetY:20,fadeIn:'200',fadeOut:'100',dataAttr:'data',bordercolor:'#0000FF',bgcolor:'#FFF',fontcolor:'#696969',fontsize:'12px',folderurl:'NULL',filetype:'txt',height:'auto',width:'320',cursor:'cursor'};var options=$.extend(defaults,options);var $tooltip=$('<div id="divToolTip"></div>');return this.each(function(){$('body').append($tooltip);$tooltip.hide();var element=this;var id=$(element).attr('id');var filename=options.folderurl+id+'.'+options.filetype;var dialog_id='#divToolTip';$(this).hover(function(e){if(options.folderurl!="NULL"){$(dialog_id).load(filename)}else{if($('#'+options.dataAttr+'_'+id).length>0){$(dialog_id).html($('#'+options.dataAttr+'_'+id).html())}else{$(dialog_id).html(id)}}$(element).css({'cursor':options.cursor});if($(document).width()/2<e.pageX){$(dialog_id).css({'position':'absolute','border':'1px solid '+options.bordercolor,'background-color':options.bgcolor,'padding':'0','top':e.pageY+options.offsetY,'left':e.pageX-$(dialog_id).width()+options.offsetX,'color':options.fontcolor,'font-size':options.fontsize,'height':options.height,'width':options.width})}else{$(dialog_id).css({'position':'absolute','border':'1px solid '+options.bordercolor,'background-color':options.bgcolor,'padding':'0','top':e.pageY+options.offsetY,'left':e.pageX+options.offsetX,'color':options.fontcolor,'font-size':options.fontsize,'cursor':options.cursor,'height':options.height,'width':options.width})}$(dialog_id).stop(true,true).fadeIn(options.fadeIn)},function(){$(dialog_id).stop(true,true).fadeOut(options.fadeOut)}).mousemove(function(e){if($(document).width()/2<e.pageX){$(dialog_id).css({'top':e.pageY+options.offsetY,'left':e.pageX-$(dialog_id).width(),'height':options.height,'width':options.width})}else{$(dialog_id).css({'top':e.pageY+options.offsetY,'left':e.pageX+options.offsetX,'height':options.height,'width':options.width})}})})}})(jQuery);
 */
// easing
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d)
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    },
    easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
    }
});