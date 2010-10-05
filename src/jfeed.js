/* jFeed : jQuery feed parser plugin
 * Copyright (C) 2007 Jean-François Hovinne - http://www.hovinne.com/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 */

jQuery.getFeed = function(options) {

    options = jQuery.extend({
    
        url: null,
        data: null,
        success: null
        
    }, options);

    if(options.url) {

        $.ajax({
            type: 'GET',
            url: options.url,
            data: options.data,
            dataType: 'xml',
            success: function(xml) {
                var feed = new JFeed(xml);
                if(jQuery.isFunction(options.success)) options.success(feed);
            }
        });
    }
};

function JFeed(xml) {
    if(xml) this.parse(xml);
};

JFeed.prototype = {

    type: '',
    version: '',
    title: '',
    link: '',
    description: '',
    parse: function(xml) {
        
        if(jQuery('channel', xml).length == 1) {
        
            this.type = 'rss';
            var feedClass = new JRss(xml);

        } else if(jQuery('feed', xml).length == 1) {
        
            this.type = 'atom';
            var feedClass = new JAtom(xml);
        }
        
        if(feedClass) jQuery.extend(this, feedClass);
    }
};

