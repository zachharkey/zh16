import dom from "../dom";
import * as util from "../util";


let $_jsSliders = null;


/**
 *
 * @public
 * @module slider
 * @description Displays a draggable slider style gallery.
 *
 */
const slider = {
    /**
     *
     * @public
     * @member dependency
     * @memberof slider
     * @description Data for async dependency loading.
     *
     */
    dependency: {
        id: "gs-draggable",
        src: "/scripts/gs-draggable.js",
        loaded: false,
        callback () {
            this.loaded = true;
        }
    },


    /**
     *
     * @public
     * @method init
     * @memberof slider
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "gallery:slider initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof slider
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
     * @memberof slider
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        util.emitter.on( "app--scroll", onScroller );

        if ( !this.dependency.loaded ) {
            util.loadScript( this.dependency );
        }
    },


    /**
     *
     * @public
     * @method unload
     * @memberof slider
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
     * @memberof slider
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        stopSliders();

        $_jsSliders = null;

        util.emitter.off( "app--scroll", onScroller );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof slider
     * @description Method queries DOM for this modules node
     * @returns {number}
     *
     */
    getElements () {
        $_jsSliders = dom.page.find( ".js-gallery-slider" );

        return ( $_jsSliders.length );
    }
};


/**
 *
 * @private
 * @method stopSliders
 * @memberof slider
 * @description Stop a draggable slider gallery.
 *
 */
const stopSliders = function () {
    let $slider = null;
    let draggable = null;
    let i = $_jsSliders.length;

    for ( i; i--; ) {
        $slider = $_jsSliders.eq( i );

        draggable = $slider.data( "Draggable" );

        if ( draggable ) {
            draggable.kill();
        }

        $slider.removeData();
    }
};


/**
 *
 * @private
 * @method execSlider
 * @param {jQuery} $slider The slider gallery node
 * @memberof slider
 * @description Initialize a draggable slider gallery.
 *
 */
const execSlider = function ( $slider ) {
    let draggable = null;
    let startX = 0;
    let diffX = 0;
    const $images = $slider.find( ".js-gallery-image" );
    const $itemsWrap = $slider.find( ".js-gallery-items" );
    const $midImage = $images.eq( Math.ceil( ($images.length - 1) / 2 ) );

    $slider.addClass( "is-loaded" );

    util.loadImages( $images, util.noop ).on( "done", () => {
        sizeSliderImages( $images );

        util.translate3d( $itemsWrap[ 0 ], util.px( -($midImage[ 0 ].offsetLeft) + (window.innerWidth / 2) - ($midImage[ 0 ].clientWidth / 2) ), 0, 0 );

        draggable = Draggable.create(
            $itemsWrap[ 0 ],
            {
                type: "x",
                edgeResistance: 0.7,
                dragResistance: 0.5,
                bounds: $slider[ 0 ],
                throwProps: true,
                cursor: "grab",
                lockAxis: true,
                onDragStart () {
                    $slider.addClass( "is-dragging" );
                },
                onDragEnd () {
                    diffX = Math.abs( draggable.x - startX );

                    if ( diffX > 100 ) {
                        $slider.addClass( "is-dragged" );
                    }

                    $slider.removeClass( "is-dragging" );
                }
            }
        )[ 0 ];

        startX = draggable.x;

        $slider.data( "Draggable", draggable ).addClass( "is-draggable" );
    });
};


/**
 *
 * @private
 * @method sizeSliderImages
 * @param {jQuery} $images The slider images
 * @memberof slider
 * @description Size the images in the slider gallery.
 *
 */
const sizeSliderImages = function ( $images ) {
    let aspect = null;
    let i = $images.length;

    for ( i; i--; ) {
        // This gives a variance of image sizes that generally looks quite lovely.
        // I maybe, just maybe, might actually be a little proud of this moment here ;-P
        if ( $images[ i ].naturalWidth > $images[ i ].naturalHeight ) {
            aspect = ($images[ i ].naturalHeight / $images[ i ].naturalWidth) * 100;

        } else {
            aspect = ($images[ i ].naturalWidth / $images[ i ].naturalHeight) * 100;
        }

        $images[ i ].style.height = `${aspect}vh`;
    }
};


/**
 *
 * @private
 * @method onScroller
 * @memberof slider
 * @description Handle scroll event and init slider galleries.
 *
 */
const onScroller = function () {
    const $notLoaded = $_jsSliders.not( ".is-loaded" );
    let $slider = null;
    let i = $notLoaded.length;

    // Wait until draggable is ready
    if ( !slider.dependency.loaded ) {
        return;
    }

    // All sliders loaded
    if ( !$notLoaded.length ) {
        util.emitter.off( "app--scroll", onScroller );
    }

    for ( i; i--; ) {
        $slider = $_jsSliders.eq( i );

        if ( util.isElementLoadable( $slider[ i ] ) ) {
            execSlider( $slider );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default slider;