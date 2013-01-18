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
        this.language = jQuery(channel).find('language:first').text();
        this.updated = jQuery(channel).find('lastBuildDate:first').text();

        this.items = new Array();

        var feed = this;

        jQuery('item', xml).each( function() {

            var item = new JFeedItem();

            item.title = jQuery(this).find('title').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).text();
            item.description = jQuery(this).find('description').eq(0).text();

            if (jQuery.browser.webkit) {
                item.content = jQuery(this).find('encoded').eq(0).text();
            }
            else {
                item.content = jQuery(this).find('content\\:encoded').eq(0).text();
            }

            item.updated = jQuery(this).find('pubDate').eq(0).text();
            item.id = jQuery(this).find('guid').eq(0).text();
            item.enclosure = jQuery(this).find('enclosure').attr('url');

            feed.items.push(item);
        });
    }
};

