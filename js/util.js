/**
 *
 * @public
 * @module util
 * @description Houses app-wide utility methods.
 *
 */
import $ from "jquery/dist/jquery.min";
import Hammer from "hammerjs";


import dom from "./dom";


import Controller from "properjs-controller";
import ScrollController from "properjs-scrollcontroller";
import ResizeController from "properjs-resizecontroller";
import ImageLoader from "properjs-imageloader";


/**
 *
 * @description Add pixel units when inline styling
 * @method px
 * @param {string} str The value to pixel-ify
 * @memberof util
 * @returns {string}
 *
 */
const px = function ( str ) {
    return `${str}px`;
};


/**
 *
 * @description Apply a translate3d transform
 * @method translate3d
 * @param {object} el The element to transform
 * @param {string|number} x The x value
 * @param {string|number} y The y value
 * @param {string|number} z The z value
 * @memberof util
 *
 */
const translate3d = function ( el, x, y, z ) {
    el.style[ Hammer.prefixed( el.style, "transform" ) ] = `translate3d( ${x}, ${y}, ${z} )`;
};


/**
 *
 * @description Single app instanceof [Controller]{@link https://github.com/ProperJS/Controller} for arbitrary event emitting
 * @member emitter
 * @memberof util
 *
 */
const emitter = new Controller();


/**
 *
 * @description Single app instanceof [ScrollController]{@link https://github.com/ProperJS/ScrollController}
 * @member scroller
 * @memberof util
 *
 */
const scroller = new ScrollController();


/**
 *
 * @description Single app instanceof [ResizeController]{@link https://github.com/ProperJS/ResizeController}
 * @member resizer
 * @memberof util
 *
 */
const resizer = new ResizeController();


/**
 *
 * @description Module onImageLoadHander method, handles event
 * @method isElementLoadable
 * @param {object} el The DOMElement to check the offset of
 * @memberof util
 * @returns {boolean}
 *
 */
const isElementLoadable = function ( el ) {
    const bounds = el.getBoundingClientRect();

    return ( bounds.top < (window.innerHeight * 2) );
};


/**
 *
 * @description Module isElementInViewport method, handles element boundaries
 * @method isElementInViewport
 * @param {object} el The DOMElement to check the offsets of
 * @memberof util
 * @returns {boolean}
 *
 */
const isElementInViewport = function ( el ) {
    const bounds = el.getBoundingClientRect();

    return ( bounds.top < window.innerHeight && bounds.bottom > 0 );
};


/**
 *
 * @description Get nearest value from an array of numbers given a control number
 * @method closestValue
 * @param {number} num The control Number
 * @param {object} arr The array to check
 * @param {boolean} isUp Optional flag to force an increased size condition
 * @memberof util
 * @returns {number}
 *
 */
const closestValue = function ( num, arr, isUp ) {
    let curr = arr[ 0 ];
    let diff = Math.abs( num - curr );
    let newdiff = null;
    let val = arr.length;
    let cond = null;

    for ( val; val--; ) {
        newdiff = Math.abs( num - arr[ val ] );

        cond = isUp ? (arr[ val ] > num && newdiff < diff) : (newdiff < diff);

        if ( cond ) {
            diff = newdiff;
            curr = arr[ val ];
        }
    }

    return curr;
};


/**
 *
 * @description Fresh query to lazyload images on page
 * @method loadImages
 * @param {object} images Optional collection of images to load
 * @param {function} handler Optional handler for load conditions
 * @memberof util
 * @returns {instance}
 *
 */
const loadImages = function ( images, handler ) {
    let $img = null;
    let data = null;
    let variant = null;
    //let variants = null;
    let i = images.length;
    //let width = Math.min( window.innerWidth, config.sqsMaxImgWidth );
    //const imgMap = function ( size ) {
    //    return parseInt( size, 10 );
    //};

    // Normalize the handler
    handler = (handler || isElementLoadable);

    // Normalize the images
    images = (images || $( ".js-lazy-image" ));

    // Get the right size image from Squarespace
    // http://developers.squarespace.com/using-the-imageloader/
    // Depending on the original upload size, we have these variants
    // {original, 1500w, 1000w, 750w, 500w, 300w, 100w}
    for ( i = images.length; i--; ) {
        $img = images.eq( i );
        data = $img.data();

        if ( data.variants ) {
            //variants = String( data.variants ).split( "," ).map( imgMap );
            //variant = (variants[ 0 ] + "w");
            variant = "original";

            $img.attr( "data-img-src", `${data.imgSrc}?format=${variant}` );
        }
    }

    return new ImageLoader({
        elements: images,
        property: "data-img-src",
        transitionDelay: 0

    // Default handle method. Can be overriden.
    }).on( "data", handler );
};


/**
 *
 * @public
 * @method loadScript
 * @memberof util
 * @param {object} data The script data
 * @param {function} callback Optional callback to fire
 * @description Method performs actual script loading.
 *
 */
const loadScript = function ( data, callback ) {
    const script = document.createElement( "script" );

    script.async = true;
    script.src = data.src;

    dom.body[ 0 ].appendChild( script );

    script.onload = script.onreadystatechange = function () {
        if ( !this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
            // Script is loaded status
            script.__jsLoaded = true;

            // Kill memory leakage ( old-school but meh )
            script.onload = script.onreadystatechange = null;

            // Supply module with loaded script node
            data.node = script;

            // Fire dependency callback AND supplied callback
            if ( typeof data.callback === "function" ) {
                setTimeout( () => {
                    data.callback();

                    if ( typeof callback === "function" ) {
                        callback();
                    }

                }, 100 );
            }
        }
    };
};


/**
 *
 * @description Toggle on/off scrollability
 * @method toggleMouseWheel
 * @param {boolean} enable Flag to enable/disable
 * @memberof util
 *
 */
const toggleMouseWheel = function ( enable ) {
    if ( enable ) {
        dom.doc.off( "DOMMouseScroll mousewheel" );

    } else {
        dom.doc.on( "DOMMouseScroll mousewheel", ( e ) => {
            e.preventDefault();
            return false;
        });
    }
};


/**
 *
 * @description Toggle on/off touch movement
 * @method toggleTouchMove
 * @param {boolean} enable Flag to enable/disable
 * @memberof util
 *
 */
const toggleTouchMove = function ( enable ) {
    if ( enable ) {
        dom.doc.off( "touchmove" );

    } else {
        dom.doc.on( "touchmove", ( e ) => {
            e.preventDefault();
            return false;
        });
    }
};


/**
 * @description Resize arbitary width x height region to fit inside another region.
 * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 * @url: http://opensourcehacker.com/2011/12/01/calculate-aspect-ratio-conserving-resize-for-images-in-javascript/
 * @method calculateAspectRatioFit
 * @memberof util
 * @param {Number} srcWidth Source area width
 * @param {Number} srcHeight Source area height
 * @param {Number} maxWidth Fittable area maximum available width
 * @param {Number} maxHeight Fittable area maximum available height
 * @returns {object}
 *
 */
const calculateAspectRatioFit = function ( srcWidth, srcHeight, maxWidth, maxHeight ) {
    const ratio = Math.min( (maxWidth / srcWidth), (maxHeight / srcHeight) );

    return {
        width: srcWidth * ratio,
        height: srcHeight * ratio
    };
};


/**
 *
 * @description Get the applied transition duration from CSS
 * @method getTransitionDuration
 * @param {object} el The DOMElement
 * @memberof util
 * @returns {number}
 *
 */
const getTransitionDuration = function ( el ) {
    let ret = 0;
    let duration = null;
    let isSeconds = false;
    let multiplyBy = 1000;

    if ( el ) {
        duration = getComputedStyle( el )[ Hammer.prefixed( el.style, "transition-duration" ) ];
        isSeconds = duration.indexOf( "ms" ) === -1;
        multiplyBy = isSeconds ? 1000 : 1;

        ret = parseFloat( duration ) * multiplyBy;
    }

    return ret;
};


/**
 *
 * @description Get the applied transform values from CSS
 * @method getTransformValues
 * @param {object} el The DOMElement
 * @memberof util
 * @returns {object}
 *
 */
const getTransformValues = function ( el ) {
    if ( !el ) {
        return null;
    }

    const transform = getComputedStyle( el )[ Hammer.prefixed( el.style, "transform" ) ];
    const values = transform.replace( /matrix|3d|\(|\)|\s/g, "" ).split( "," );
    const ret = {};

    // No Transform
    if ( values[ 0 ] === "none" ) {
        ret.x = 0;
        ret.y = 0;
        ret.z = 0;

    // Matrix 3D
    } else if ( values.length === 16 ) {
        ret.x = parseFloat( values[ 12 ] );
        ret.y = parseFloat( values[ 13 ] );
        ret.z = parseFloat( values[ 14 ] );

    } else {
        ret.x = parseFloat( values[ 4 ] );
        ret.y = parseFloat( values[ 5 ] );
        ret.z = 0;
    }

    return ret;
};


/**
 *
 * @description Get the numeric values from CSS style
 * @method getNumericStyleValue
 * @param {object} el The DOMElement
 * @param {string} style The style to lookup
 * @memberof util
 * @returns {number}
 *
 */
const getNumericStyleValue = function ( el, style ) {
    if ( el ) {
        return parseFloat( getComputedStyle( el )[ style ] );
    }
};


/**
 *
 * @description All true all the time
 * @method noop
 * @memberof util
 * @returns {boolean}
 *
 */
const noop = function () {
    return true;
};


/**
 *
 * @description Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 * @method shuffle
 * @param {object} arr The array to shuffle
 * @memberof util
 * @returns {array}
 *
 */
const shuffle = function ( arr ) {
    let i = arr.length - 1;
    let j = 0;
    let temp = arr[ i ];

    for ( i; i > 0; i-- ) {
        j = Math.floor( Math.random() * (i + 1) );
        temp = arr[ i ];

        arr[ i ] = arr[ j ];
        arr[ j ] = temp;
    }

    return arr;
};


/**
 *
 * @description Split an array into smaller arrays
 * @method splitArray
 * @param {object} arr The array to split
 * @param {number} num The number of splits
 * @memberof util
 * @returns {array}
 *
 */
const splitArray = function ( arr, num ) {
    let sec = null;
    let i = 0;
    const out = [];

    for ( i; i < num; i++ ) {
        sec = arr.splice( 0, num );

        if ( sec.length ) {
            out.push( sec );
        }
    }

    return out;
};


/**
 *
 * @description Determine whether we are in Squarespace /config land or not.
 * @method isConfig
 * @memberof util
 * @returns {boolean}
 *
 */
const isConfig = function () {
    return (window.parent.location.pathname.indexOf( "/config" ) !== -1);
};



/******************************************************************************
 * Export
*******************************************************************************/
export default {
    // Classes
    emitter,
    scroller,
    resizer,

    // Loading
    loadImages,
    loadScript,
    isElementLoadable,
    isElementInViewport,

    // Disabling
    toggleMouseWheel,
    toggleTouchMove,

    // Random
    px,
    noop,
    shuffle,
    splitArray,
    translate3d,
    calculateAspectRatioFit,
    getTransitionDuration,
    getTransformValues,
    getNumericStyleValue,
    closestValue,

    // Condition
    isConfig
};