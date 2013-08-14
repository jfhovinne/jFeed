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

            var t = jQuery(this);

            item.title = t.find('title').eq(0).text();

            /*
             * RFC 4287 - 4.2.7.2: take first encountered 'link' node
             *                     to be of the 'alternate' type.
             */
            t.find('link').each(function() {
               var rel = $(this).attr('rel');
               if ((rel == 'alternate') || !rel) {
                  item.link = $(this).attr('href');
                  return false;
               }
               return true;
            });

            item.description = t.find('content').eq(0).text();
            item.updated = t.find('updated').eq(0).text();
            item.id = t.find('id').eq(0).text();
            item.author = t.find('author name').eq(0).text();

            var point = t.find('[nodeName="georss:point"]').eq(0).text();
            if (point.length > 0) {
              point = point.split(" ");
              item.coordinates = [point[1], point[0]];
            }

            feed.items.push(item);
        });
    }
};

