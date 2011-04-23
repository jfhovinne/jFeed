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
        failure: null

    }, options);

    if (options.url) {

        $.ajax({
            type: 'GET',
            url: options.url,
            data: options.data,
            cache: options.cache,
            dataType: (jQuery.browser.msie) ? "text" : "xml",
            success: function(xml) {
                var feed = new JFeed(xml);
                if (jQuery.isFunction(options.success)) options.success(feed);
            },
            error: function (xhr, msg, e) {
                if (jQuery.isFunction(options.failure)) options.failure(msg, e);
            }
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

        if (jQuery.browser.msie) {
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.loadXML(xml);
            xml = xmlDoc;
        }

        if (jQuery('channel', xml).length == 1) {

            this.type = 'rss';
            var feedClass = new JRss(xml);

        } else if (jQuery('feed', xml).length == 1) {
          var activityStream = jQuery('feed:first', xml).attr('xmlns:activity');
          if (activityStream && activityStream === "http://activitystrea.ms/spec/1.0/") {
            this.type = 'activityStream';
            var feedClass = new JActivityStream(xml, this); 
          } else {
            this.type = 'atom';
            var feedClass = new JAtom(xml); 
          }
        }

        if (feedClass) jQuery.extend(this, feedClass);
    },
    
    grab: function(attr, scope, text) {
      text = typeof(text) === "undefined" ? true : text;
      var node = scope.find(attr).eq(0);
      if (text) {
        return node.text();
      } else {
        // returns the first jquery node instead of the text
        return node;
      }
    }
};

