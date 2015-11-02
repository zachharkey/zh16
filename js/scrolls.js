import dom from "./dom";
import detect from "./detect";
import * as util from "./util";


let _timeout = null;
let _isNones = false;
const _idleout = 300;


/**
 *
 * @public
 * @module scrolls
 * @description Handles app-wide emission of various scroll detection events.
 *
 */
const scrolls = {
    /**
     *
     * @public
     * @method init
     * @memberof scrolls
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "scrolls initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof scrolls
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive: util.noop,


    /**
     *
     * @public
     * @method onload
     * @memberof scrolls
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        util.scroller.on( "scroll", onScroller );
        util.scroller.on( "scrollup", onScrollerUp );
        util.scroller.on( "scrolldown", onScrollerDown );
        util.emitter.on( "app--do-scroll", onScroller );

        onScroller();

        this.topout();
    },


    /**
     *
     * @public
     * @method scrolls
     * @memberof preload
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        this.teardown();
    },


    /**
     *
     * @public
     * @method topout
     * @param {number} top Optionally, the scroll position to apply
     * @memberof preload
     * @description Method set scroll position to argument value or sero.
     *
     */
    topout ( top ) {
        top = top || 0;

        window.scrollTo( 0, top );
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof scrolls
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        util.scroller.off( "scroll", onScroller );
        util.scroller.off( "scrollup", onScrollerUp );
        util.scroller.off( "scrolldown", onScrollerDown );
        util.emitter.off( "app--do-scroll", onScroller );
    },


    /**
     *
     * @public
     * @method clearStates
     * @memberof scrolls
     * @description Method removes all applied classNames from this module
     *
     */
    clearStates () {
        dom.html.removeClass( "is-scrolling-up is-scrolling-down is-scrolling" );
    }
};


/**
 *
 * @private
 * @method suppressEvents
 * @param {number} scrollPos The current scrollY position
 * @memberof scrolls
 * @description Method applies className to disable events while scrolling
 *
 */
const suppressEvents = function ( scrollPos ) {
    if ( detect.isTouch() ) {
        return;
    }

    try {
        clearTimeout( _timeout );

    } catch ( error ) {
        console.log( error );
    }

    if ( !_isNones ) {
        _isNones = true;

        dom.html.addClass( "is-scrolling" );

        util.emitter.fire( "app--scroll-start" );
    }

    _timeout = setTimeout( () => {
        if ( scrollPos === util.scroller.getScrollY() ) {
            _isNones = false;

            dom.html.removeClass( "is-scrolling" );

            util.emitter.fire( "app--scroll-end" );
        }

    }, _idleout );
};


/**
 *
 * @private
 * @method onScrollerUp
 * @memberof scrolls
 * @description Method handles upward scroll event
 *
 */
const onScrollerUp = function () {
    if ( util.scroller.getScrollY() <= 0 || detect.isTouch() ) {
        return;
    }

    const scrollPos = util.scroller.getScrollY();

    util.emitter.fire( "app--scroll-up", scrollPos );

    dom.html.removeClass( "is-scrolling-down" ).addClass( "is-scrolling-up" );
};


/**
 *
 * @private
 * @method onScrollerDown
 * @memberof scrolls
 * @description Method handles downward scroll event
 *
 */
const onScrollerDown = function () {
    if ( util.scroller.getScrollY() <= 0 || detect.isTouch() ) {
        return;
    }

    const scrollPos = util.scroller.getScrollY();

    util.emitter.fire( "app--scroll-down", scrollPos );

    dom.html.removeClass( "is-scrolling-up" ).addClass( "is-scrolling-down" );
};


/**
 *
 * @private
 * @method onScroller
 * @memberof scrolls
 * @description Method handles regular scroll event via [ScrollController]{@link https://github.com/ProperJS/ScrollController}
 *
 */
const onScroller = function () {
    const scrollPos = util.scroller.getScrollY();

    suppressEvents( scrollPos );

    util.emitter.fire( "app--scroll", scrollPos );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default scrolls;