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
          };
        } else if (jQuery.type(options.failure) === jQuery.type(options.error) === 'null') {
          // Default error behavior if failure & error both unspecified
          options.error = function(xhr, msg, e){
            console.log('getFeed failed to load feed', xhr, msg, e);
          };
        }
        return $.ajax({
            type: 'GET',
            url: options.url,
            data: options.data,
            cache: options.cache,
            dataType: "xml",
            headers: options.headers,
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
    // enclosures: '',
    parse: function(xml) {

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
function JFeedItem() {};

JFeedItem.prototype = {

    title: '',
    link: '',
    description: '',
    enclosures: '',
    updated: '',
    id: ''
};
function JAtom(xml) {
    this._parse(xml);
};

JAtom.prototype = {

    _parse: function(xml) {

        var channel = jQuery('feed', xml).eq(0);

        this.version = '1.0';
        this.title = jQuery(channel).find('title:first').text();
        this.link = jQuery(channel).find('link:first').attr('href');
        this.description = jQuery(channel).find('subtitle:first').text();
        this.language = jQuery(channel).attr('xml:lang');
        this.updated = jQuery(channel).find('updated:first').text();

        this.items = new Array();

        var feed = this;

        jQuery('entry', xml).each( function() {

            var item = new JFeedItem();

            item.title = jQuery(this).find('title').eq(0).text();

            // Choosing a proper link
            var links = item.link = jQuery(this).find('link');
            if(links.length > 1){
              for (var i = 0; i < links.length; i++) {
                var link = $(links[i]);
                // if is not the replies, or the edit or the self choose it
                if((link.attr('rel') !== 'replies' && link.attr('rel') !== 'edit' && link.attr('rel') !== 'self') || i === links.length-1){
                  item.link = link.attr('href')
                }
              }
            }
            if(!item.link){
              item.link = jQuery(this).find('link').eq(0).attr('href');
            }

            item.description = jQuery(this).find('content').eq(0).text();
            item.updated = jQuery(this).find('updated').eq(0).text();
            item.id = jQuery(this).find('id').eq(0).text();

            feed.items.push(item);
        });
    }
};

function JRss(xml) {
    this._parse(xml);
};

JRss.prototype  = {

    _parse: function(xml) {

        if(jQuery('rss', xml).length == 0) this.version = '1.0';
        else this.version = jQuery('rss', xml).eq(0).attr('version');

        var channel = jQuery('channel', xml).eq(0);

        this.title = jQuery(channel).find('title:first').text();
        this.link = jQuery(channel).find('link:first').text();
        this.description = jQuery(channel).find('description:first').text();
        // this.enclosures = jQuery(channel).find('enclosure');
        this.language = jQuery(channel).find('language:first').text();
        this.updated = jQuery(channel).find('lastBuildDate:first').text();

        this.items = new Array();

        var feed = this;

        jQuery('item', xml).each( function(index) {

            var item = new JFeedItem();

            item.title = jQuery(this).find('title').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).text();
            item.description = jQuery(this).find('description').eq(0).text();
            if(item.description ===""){
              item.description = jQuery(this).find('encoded').eq(0).text();
            }

            // The plan:
            // Check ig there is media. If there is media get the thumbnail and get the list of medias.
            var medias = jQuery(this).find('[type^="image"],media\\:content,content,media\\:thumbnail,thumbnail');
            if(medias && medias.slice){
              for (var i = 0; i < medias.length; i++) {
                var url = medias[i].getAttribute('url');
                if((url && url.indexOf("thumb")!==-1) || $(medias[i]).is('media\\:thumbnail') || $(medias[i]).is('thumbnail')){
                  item.thumbnail = medias[i];
                  item.thumbnailUrl = url;
                }else{
                  item.media = medias[i];
                  item.mediaUrl = url;
                }
              }
            }

            item.content = jQuery(this).find('content').eq(0).text();
            item.enclosure = jQuery(this).find('enclosure').eq(0).text();
            item.updated = jQuery(this).find('pubDate').eq(0).text();
            item.id = jQuery(this).find('guid').eq(0).text();

            feed.items.push(item);
        });
    }
};
