import dom from "../dom";
import * as util from "../util";
import * as config from "../config";


import Hammered from "properjs-hammered";


let _isActive = false;
const $_jsItems = dom.nav.find( ".js-menu-nav-item" );
const _hammers = {};
const _transTime = util.getTransitionDuration( dom.nav[ 0 ] );


/**
 *
 * @public
 * @module nav
 * @description Handles opening / closing the main nav menu.
 *
 */
const nav = {
    /**
     *
     * @public
     * @method init
     * @memberof nav
     * @description Initializes navmenu interactions.
     *
     */
    init () {
        _hammers.icon = new Hammered( dom.header[ 0 ], config.hammerDefaults );
        _hammers.icon.on( "tap", ".js-controller--nav", onTapNavIcon );

        _hammers.menu = new Hammered( dom.nav[ 0 ], config.hammerDefaults );
        _hammers.menu.on( "tap", ".js-menu-nav", onTapNavIcon );

        dom.nav.detach();

        console.log( "nav initialized" );
    },


    /**
     *
     * @public
     * @method open
     * @memberof nav
     * @description Opens the navmenu.
     *
     */
    open () {
        dom.html.addClass( "is-clipped is-navmenu-open" );
        dom.body.append( dom.nav );

        setTimeout( () => dom.nav.addClass( "is-active" ), 0 );
    },


    /**
     *
     * @public
     * @method close
     * @memberof nav
     * @description Closes the navmenu.
     *
     */
    close () {
        dom.nav.removeClass( "is-active" );
        dom.html.removeClass( "is-clipped" );

        setTimeout( () => {
            dom.html.removeClass( "is-navmenu-open" );
            dom.nav.detach();

        }, _transTime );
    },


    /**
     *
     * @public
     * @method toggleActive
     * @param {string} collection The type to activate
     * @memberof nav
     * @description Toggle the active nav menu item by collection type.
     *
     */
    toggleActive ( collection ) {
        const $navi = $_jsItems.filter( `.menu-nav__a--${collection}` );

        if ( $navi.length ) {
            $_jsItems.removeClass( "is-active" );
            $navi[ 0 ].className += " is-active";
        }
    }
};


/**
 *
 * @private
 * @method onTapNavIcon
 * @param {object} e The Event object
 * @memberof nav
 * @description Handles list icon event.
 *
 */
const onTapNavIcon = function ( e ) {
    _isActive = !_isActive;

    // Its a nav menu item
    if ( e.target.className.indexOf( "js-menu-nav-item" ) !== -1 ) {
        $_jsItems.removeClass( "is-active" );
        e.target.className += " is-active";
    }

    // Its dos logos
    if ( e.target.className.indexOf( "-logo" ) !== -1 ) {
        $_jsItems.removeClass( "is-active" );
    }

    if ( _isActive ) {
        nav.open();

    } else {
        nav.close();
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default nav;