import $ from "jquery/dist/jquery.min";


import dom from "../dom";
import * as util from "../util";


import Tween from "properjs-tween";
import Easing from "properjs-easing";


let _tween = null;
const $_jsBar = $( "<div />" ).addClass( "bar js-bar" );
const $_jsInner = $( "<div />" ).addClass( "bar__inner" ).appendTo( $_jsBar );
const _transTime = util.getTransitionDuration( $_jsBar[ 0 ] );


/**
 *
 * @public
 * @module bar
 * @description Performs a loader bar interaction.
 *
 */
const bar = {
    /**
     *
     * @public
     * @method load
     * @param {string} position The placement position for the load bar.
     * @memberof bar
     * @description Method starts load bar interaction.
     *
     */
    load ( position ) {
        dom.body.append( $_jsBar.addClass( `bar--${position}` ) );

        _tween = new Tween({
            from: 0,
            to: window.innerWidth,
            update: onUpdateBar,
            complete: onUpdateBar,
            ease: Easing.easeInOutQuad,
            delay: 0,
            duration: 10000
        });
    },


    /**
     *
     * @public
     * @method stop
     * @memberof bar
     * @description Method stops load bar interaction.
     * @returns {object}
     *
     */
    stop () {
        const def = new $.Deferred();

        _tween.stop();
        _tween = new Tween({
            from: $_jsInner[ 0 ].clientWidth,
            to: window.innerWidth,
            update: onUpdateBar,
            complete () {
                onCompleteBar( def );
            },
            ease: Easing.easeInOutCubic,
            delay: 0,
            duration: 400
        });

        return def;
    }
};


/**
 *
 * @private
 * @method onCompleteBar
 * @param {object} def Deferred object
 * @memberof bar
 * @description Handle the completion of the load bar.
 *
 */
const onCompleteBar = function ( def ) {
    $_jsBar.addClass( "is-done" );

    setTimeout( () => {
        $_jsBar.detach().removeClass( "bar--top bar--bottom is-done" );
        $_jsInner[ 0 ].style.width = 0;

        _tween = null;

        def.resolve();

    }, _transTime );
};


/**
 *
 * @private
 * @method onUpdateBar
 * @param {number} width The width value to assign
 * @memberof bar
 * @description Handle updating the load bar's width.
 *
 */
const onUpdateBar = function ( width ) {
    $_jsInner[ 0 ].style.width = util.px( width );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default bar;