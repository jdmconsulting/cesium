/*global define*/
define([
        '../Core/DeveloperError'
    ], function (
            DeveloperError) {
    "use strict";

    /**
     * A credit contains data pertaining to how to display attributions/credits for certain content on the screen.
     *
     *  @param {String} [text=undefined] The text to be displayed on the screen if no imageUrl is specified.
     *  @param {String} [imageUrl=undefined] The source location for an image
     *  @param {String} [link=undefined] A URL location for which the credit will be hyperlinked
     *
     *  @alias Credit
     *  @constructor
     *
     *  @example
     *  //Create a credit with a tooltip, image and link
     *  var credit = new Credit('Cesium', '/images/cesium_logo.png', 'http://cesium.agi.com/');
     */

    var Credit = function(text, imageUrl, link) {
        var hasLink = (typeof link !== 'undefined');
        var hasImage = (typeof imageUrl !== 'undefined');
        var hasText = (typeof text !== 'undefined');
        if (!hasText && !hasImage && !hasLink) {
            throw new DeveloperError('text, imageUrl or link is required');
        }

        if (!hasText && !hasImage) {
            text = link;
        }

        this._text = text;

        this._imageUrl = imageUrl;

        this._link = link;

        this._hasLink = hasLink;

        this._hasImage = hasImage;
    };

    /**
     * Returns true if the credit has an imageUrl
     *
     * @returns {Boolean}
     */
    Credit.prototype.hasImage = function() {
        return this._hasImage;
    };

    /**
     * Returns true if the credit has a link
     *
     * @returns {Boolean}
     */
    Credit.prototype.hasLink = function() {
        return this._hasLink;
    };

    /**
     * Returns the credit text
     *
     * @returns {String}
     */
    Credit.prototype.getText = function() {
        return this._text;
    };

    /**
     * Returns the source location for the image.
     *
     * @returns {String}
     */
    Credit.prototype.getImageUrl = function() {
        return this._imageUrl;
    };

    /**
     * Returns a URL location for the credit hyperlink
     *
     * @returns {String}
     */
    Credit.prototype.getLink = function() {
        return this._link;
    };

    /**
     * Returns true if the credits are equal
     *
     * @memberof Credit
     *
     * @param {Credit} left The first credit
     * @param {Credit} left The second credit
     *
     * @return {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Credit.equals = function(left, right) {
        var leftUndefined = (typeof left === 'undefined');
        var rightUndefined = (typeof right === 'undefined');

        return ((left === right) ||
               ((leftUndefined && rightUndefined) ||
               (!leftUndefined && !rightUndefined)) &&
               ((left._text === right._text &&
               left._imageUrl === right._imageUrl &&
               left._link === right._link)));
    };

    /**
     * Returns true if the credits are equal
     *
     * @memberof Credit
     *
     * @param {Credit} credits The credit to compare to.
     *
     * @return {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Credit.prototype.equals = function(credit) {
        return Credit.equals(this, credit);
    };

    return Credit;
});