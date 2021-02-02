/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = '#menu_toggle',
    $SIDEBAR_MENU = '#sidebar-menu',
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = '.left_col',
    $RIGHT_COL = '.right_col',
    $NAV_MENU = '.nav_menu',
    $FOOTER = 'footer';

// TODO: This is some kind of easy fix, maybe we can improve this
var setContentHeight = function () {
    // reset height
    $(document).find($RIGHT_COL).css('min-height', $(window).height());

    var bodyHeight = $BODY.outerHeight(),
        footerHeight = $BODY.hasClass('footer_fixed') ? 0 : $(document).find($FOOTER).height(),
        leftColHeight = $(document).find($LEFT_COL).eq(1).height() + $SIDEBAR_FOOTER.height(),
        contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

    // normalize content
    contentHeight -= $(document).find($NAV_MENU).height() + footerHeight;
    $(document).find($RIGHT_COL).css('min-height', contentHeight);
};
// Sidebar
$(document).ready(function () {
    $(document).find($SIDEBAR_MENU).find('a').on('click', function (ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $(document).find($SIDEBAR_MENU).find('li').removeClass('active active-sm');
                $(document).find($SIDEBAR_MENU).find('li ul').slideUp();
            }

            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu
    $(document).on('click', $MENU_TOGGLE, function () {
        if ($BODY.hasClass('nav-md')) {
            $(document).find($SIDEBAR_MENU).find('li.active ul').hide();
            $(document).find($SIDEBAR_MENU).find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $(document).find($SIDEBAR_MENU).find('li.active-sm ul').show();
            $(document).find($SIDEBAR_MENU).find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();
    });

    // check active menu
    $(document).find($SIDEBAR_MENU).find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $(document).find($SIDEBAR_MENU).find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function () {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $(document).find('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: {preventDefault: true}
        });
    }
});
// /Sidebar

// Tooltip
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Accordion
$(document).ready(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

/**
 * Resize function without multiple trigger
 *
 * Usage:
 * $(window).smartresize(function(){
 *     // code here
 * });
 */
(function ($, sr) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };

})(jQuery, 'smartresize');