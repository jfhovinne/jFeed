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
            
            last = jQuery(this)
            item.title = jQuery(this).find('title').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).text();
            item.description = jQuery(this).find('content').eq(0).text();
            item.updated = jQuery(this).find('updated').eq(0).text();
            item.id = jQuery(this).find('id').eq(0).text();
            var point = jQuery(this).find('[nodeName="georss:point"]').eq(0).text();
            if (point.length > 0) {
              point = point.split(" ");
              item.geometry = { type: "Point", coordinates: [point[1], point[0]] };
            }
            feed.items.push(item);
        });
    }
};

