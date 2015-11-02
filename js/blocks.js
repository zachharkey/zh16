import dom from "./dom";
import api from "./api";
import * as util from "./util";


let $_jsBlocks = null;


/**
 *
 * @public
 * @module blocks
 * @description A nice description of what this module does...
 *
 */
const blocks = {
    /**
     *
     * @public
     * @method init
     * @memberof blocks
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "blocks initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof blocks
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
     * @memberof blocks
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        if ( util.isConfig() ) {
            $_jsBlocks.addClass( "is-active" );

        } else {
            util.emitter.on( "app--scroll", loopBlocks );

            activateStyles( $_jsBlocks );
        }
    },


    /**
     *
     * @public
     * @method unload
     * @memberof blocks
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
     * @memberof blocks
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsBlocks = null;

        util.emitter.off( "app--scroll", loopBlocks );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof blocks
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsBlocks = dom.page.find( ".sqs-block-content" );

        return ( $_jsBlocks.length );
    }
};


/**
 *
 * @private
 * @method activateStyles
 * @param {jQuery} $blocks The blocks to parse styles from
 * @memberof blocks
 * @description Activate style info for CMS blocks.
 *
 */
const activateStyles = function ( $blocks ) {
    let i = $blocks.length;
    let $block = null;
    let $styles = null;

    for ( i; i--; ) {
        $block = $blocks.eq( i );
        $styles = $block.closest( ".js-kop-part" ).find( ".js-kop-styles" );

        // Separate the cases by block-type
        if ( $block.parent().is( ".sqs-block-html, .sqs-block-collectionlink" ) ) {
            parseHtmlStyles( $block, $styles );

        } else if ( $block.parent().is( ".sqs-block-code" ) ) {
            parseCodeStyles( $block, $styles );

        } else if ( $block.parent().is( ".sqs-block-quote" ) ) {
            parseQuoteStyles( $block, $styles );
        }
    }
};


/**
 *
 * @private
 * @method getFontStyles
 * @param {element} el The element to parse font styles from
 * @memberof blocks
 * @description Parse font styles from an element.
 * @returns {string}
 *
 */
const getFontStyles = function ( el ) {
    const ret = ["<span>"];
    const gcs = getComputedStyle( el );
    const ff = gcs[ "font-family" ].replace( /'|"/g, "" );
    const fs = gcs[ "font-size" ];
    const lh = gcs[ "line-height" ];

    ret.push( ff );
    ret.push( "<br />" );
    ret.push( `${fs} / ${lh}` );
    ret.push( "</span>" );

    return ret.join( "" );
};


/**
 *
 * @private
 * @method parseHtmlStyles
 * @param {jQuery} $block The block to read nodes from
 * @param {jQuery} $styles The container for style information
 * @memberof blocks
 * @description Parse styles from a CMS block's content.
 *
 * Text Blocks: sqs-block-html
 * block > p > strong
 * block > h1 > strong
 * block > h2 > strong
 * block > h3 > strong
 * block > a
 *
 */
const parseHtmlStyles = function ( $block, $styles ) {
    const $p = $block.find( "> p" );
    const $a = $block.find( "> a" );
    const $h = $block.find( "> h1, > h2, > h3" );
    let styles = [];
    let $ps = null;
    let $hs = null;

    // Order of operations
    if ( $p.length ) {
        $ps = $p.find( "> strong" );

        styles = styles.concat( getFontStyles( $p[ 0 ] ) );

        if ( $ps.length ) {
            styles = [].concat( getFontStyles( $ps[ 0 ] ) );
        }

    } else if ( $a.length ) {
        styles = styles.concat( getFontStyles( $a[ 0 ] ) );

    } else if ( $h.length ) {
        $hs = $h.find( "> strong" );

        styles = styles.concat( getFontStyles( $h[ 0 ] ) );

        if ( $hs.length ) {
            styles = styles.concat( getFontStyles( $hs[ 0 ] ) );
        }
    }

    $styles[ 0 ].innerHTML = styles.join( "" );
};


/**
 *
 * @private
 * @method parseCodeStyles
 * @param {jQuery} $block The block to read nodes from
 * @param {jQuery} $styles The container for style information
 * @memberof blocks
 * @description Parse styles from a CMS block's content.
 *
 * Code Blocks: sqs-block-code
 * block > .meta
 * block > .title + .meta
 * block > .caption
 * block > .caption > span.meta__cap
 *
 */
const parseCodeStyles = function ( $block, $styles ) {
    const $t = $block.find( "> .title" );
    const $tm = $block.find( "> .title + .meta" );
    const $tem = $block.find( "> .title > .em" );
    const $m = $block.find( "> .meta" );
    const $c = $block.find( "> .caption" );
    const $cm = $block.find( "> .caption > .meta__cap" );
    let styles = [];

    // Order of operations
    if ( $tm.length ) {
        styles = styles.concat( getFontStyles( $t[ 0 ] ) );

        if ( $tem.length ) {
            styles = styles.concat( getFontStyles( $tem[ 0 ] ) );
        }

        styles = styles.concat( getFontStyles( $tm[ 0 ] ) );

    } else if ( $cm.length ) {
        styles = styles.concat( getFontStyles( $cm[ 0 ] ) );
        styles = styles.concat( getFontStyles( $c[ 0 ] ) );

    } else if ( $m.length ) {
        styles = styles.concat( getFontStyles( $m[ 0 ] ) );

    } else if ( $c.length ) {
        styles = styles.concat( getFontStyles( $c[ 0 ] ) );
    }

    $styles[ 0 ].innerHTML = styles.join( "" );
};


/**
 *
 * @private
 * @method parseCodeStyles
 * @param {jQuery} $block The block to read nodes from
 * @param {jQuery} $styles The container for style information
 * @memberof blocks
 * @description Parse styles from a CMS block's content.
 *
 * Quote Blocks: sqs-block-quote
 * block > .bq > blockquote.bq__quote
 * block > .bq > figcaption.bq__source
 *
 */
const parseQuoteStyles = function ( $block, $styles ) {
    const $bq = $block.find( "> .bq > .bq__quote" );
    const $fc = $block.find( "> .bq > .bq__source" );
    let styles = [];

    // Order of operations
    if ( $bq.length ) {
        styles = styles.concat( getFontStyles( $bq[ 0 ] ) );
    }

    if ( $fc.length ) {
        styles = styles.concat( getFontStyles( $fc[ 0 ] ) );
    }

    $styles[ 0 ].innerHTML = styles.join( "" );
};


/**
 *
 * @private
 * @method activateLinks
 * @param {jQuery} $block The block of content to link up
 * @memberof blocks
 * @description Activate cool style for internal links in CMS content.
 *
 */
const activateLinks = function ( $block ) {
    const $links = $block.find( "> p > a" );
    const handler = function ( data ) {
        if ( data ) {
            this.attr( "data-title", (data.item ? data.item.title : data.collection.title) );
        }
    };
    let i = $links.length;
    let $link = null;

    for ( i; i--; ) {
        $link = $links.eq( i );

        // Only activate internal links to other site content
        if ( $link[ 0 ].hostname === location.hostname ) {
            api.collection( $link[ 0 ].href.replace( location.origin, "" ) ).done( handler.bind( $link ) );
        }
    }
};


/**
 *
 * @private
 * @method loopGridItems
 * @memberof blocks
 * @description Iterate and toggle sqs-block-content transitions.
 *
 */
const loopBlocks = function () {
    let $block = null;
    let i = $_jsBlocks.length;

    for ( i; i--; ) {
        $block = $_jsBlocks.eq( i );

        if ( util.isElementInViewport( $block[ 0 ] ) ) {
            $block.addClass( "is-active" );

            if ( !$block.data( "linked" ) ) {
                $block.data( "linked", true );

                activateLinks( $block );
            }

        } else {
            $block.removeClass( "is-active" );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default blocks;