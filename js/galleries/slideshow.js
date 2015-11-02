import $ from "jquery/dist/jquery.min";


import dom from "../dom";
import * as util from "../util";
import * as config from "../config";


import Hammered from "properjs-hammered";


let $_jsSlideshows = null;


/**
 *
 * @public
 * @module slideshow
 * @description Displays a traditional carousel style gallery.
 *
 */
const slideshow = {
    /**
     *
     * @public
     * @method init
     * @memberof slideshow
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "gallery:slideshow initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof slideshow
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive () {
        return (this.getElements() > 0);
    },


    /**
     *
     * @public
     * @method onload
     * @memberof slideshow
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        util.emitter.on( "app--scroll", onScroller );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof slideshow
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        this.teardown();
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof slideshow
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        stopSlideshows();

        util.emitter.off( "app--scroll", onScroller );

        $_jsSlideshows = null;
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof slideshow
     * @description Method queries DOM for this modules node
     * @returns {number}
     *
     */
    getElements () {
        $_jsSlideshows = dom.page.find( ".js-gallery-slideshow" );

        return ( $_jsSlideshows.length );
    }
};


/**
 *
 * @private
 * @method stopSlideshows
 * @memberof slideshow
 * @description Stop a slideshow gallery.
 *
 */
const stopSlideshows = function () {
    let $slideshow = null;
    let data = null;
    let i = $_jsSlideshows.length;

    for ( i; i--; ) {
        $slideshow = $_jsSlideshows.eq( i );
        data = $slideshow.data();

        if ( data.hammered ) {
            data.hammered.off( "tap", onTapImage );

            $slideshow.removeData();
        }
    }
};


/**
 *
 * @private
 * @method execSlideshow
 * @param {jQuery} $slideshow The gallery node
 * @memberof slideshow
 * @description Init a slideshow gallery.
 *
 */
const execSlideshow = function ( $slideshow ) {
    const $images = $slideshow.find( ".js-gallery-image" );
    const $idx = $slideshow.find( ".js-gallery-idx" );
    const hammered = new Hammered( $slideshow[ 0 ], config.hammerDefaults );

    $slideshow.addClass( "is-loaded" );

    util.loadImages( $images, util.noop );

    $slideshow.data({
        index: 0,
        length: $images.length,
        timeout: null,
        duration: util.getTransitionDuration( $images[ 0 ] ),
        hammered,
        $images,
        $idx
    });

    $images.first().addClass( "is-active" );

    hammered.on( "tap", ".js-gallery-image", onTapImage );
};


/**
 *
 * @private
 * @method onScroller
 * @memberof slideshow
 * @description Handle scroll and init slideshows.
 *
 */
const onScroller = function () {
    const $notLoaded = $_jsSlideshows.not( ".is-loaded" );
    let $slideshow = null;
    let i = $notLoaded.length;

    // All carousels loaded
    if ( !$notLoaded.length ) {
        util.emitter.off( "app--scroll", onScroller );
    }

    for ( i; i--; ) {
        $slideshow = $_jsSlideshows.eq( i );

        if ( util.isElementLoadable( $slideshow[ i ] ) ) {
            execSlideshow( $slideshow );
        }
    }
};


/**
 *
 * @private
 * @method onTapImage
 * @memberof slideshow
 * @description Handle gallery image tap.
 *
 */
const onTapImage = function () {
    let $next = null;
    const $curr = $( this );
    const $slideshow = $curr.closest( ".js-gallery" );
    const data = $slideshow.data();

    try {
        clearTimeout( data.timeout );

        data.$images.removeClass( "is-entering is-exiting is-active" );

    } catch ( error ) {
        throw error;
    }

    if ( data.index === (data.length - 1) ) {
        data.index = 0;

    } else {
        data.index++;
    }

    data.$idx.text( `${data.index + 1} / ${data.length}` );

    $next = data.$images.eq( data.index );
    $curr.removeClass( "is-active" ).addClass( "is-exiting" );
    $next.addClass( "is-entering" );

    $slideshow.data({
        index: data.index,
        timeout: setTimeout( () => {
            $curr.removeClass( "is-exiting" );
            $next.removeClass( "is-entering" ).addClass( "is-active" );

        }, data.duration )
    });
};


/******************************************************************************
 * Export
*******************************************************************************/
export default slideshow;