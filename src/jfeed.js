/* jFeed : jQuery feed parser plugin
 * Copyright (C) 2007 Jean-François Hovinne - http://www.hovinne.com/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 */

jQuery.getFeed = function(options) {

    options = jQuery.extend({

        url: null,
        data: null,
        cache: true,
        success: null,
        failure: null,
        error: null,
        global: true

    }, options);

    if (options.url) {
        
        if (jQuery.isFunction(options.failure) && jQuery.type(options.error)==='null') {
          // Handle legacy failure option
          options.error = function(xhr, msg, e){
            options.failure(msg, e);
          }
        } else if (jQuery.type(options.failure) === jQuery.type(options.error) === 'null') {
          // Default error behavior if failure & error both unspecified
          options.error = function(xhr, msg, e){
            window.console&&console.log('getFeed failed to load feed', xhr, msg, e);
          }
        }

        return $.ajax({
            type: 'GET',
            url: options.url,
            data: options.data,
            dataType: 'xml',
            cache: options.cache,
            success: function(xml) {
                var feed = new JFeed(xml);
                if (jQuery.isFunction(options.success)) options.success(feed);
            },
            error: options.error,
            global: options.global
        });
    }
};

function JFeed(xml) {
    if (xml) this.parse(xml);
}
;

JFeed.prototype = {

    type: '',
    version: '',
    title: '',
    link: '',
    description: '',
    parse: function(xml) {

        //xml = jQuery.parseXML(xml);

        if (jQuery('channel', xml).length == 1) {

            this.type = 'rss';
            var feedClass = new JRss(xml);

        } else if (jQuery('feed', xml).length == 1) {

            this.type = 'atom';
            var feedClass = new JAtom(xml);
        }

        if (feedClass) jQuery.extend(this, feedClass);
    }
};

