function JActivityStream(xml, jFeed) {
    this._parse(xml, jFeed);
};

JActivityStream.prototype = {
    
  _parse: function(xml, jFeed) {
    
    var channel = jQuery(jQuery('feed', xml).eq(0));
    var feed = this;
    var grab = jFeed.grab;
    var baseIRI = 'http://activitystrea.ms/schema/1.0/';
    
    feed.version = '1.0';
    feed.title = channel.find('title').eq(0).text();
    feed.link = channel.find('link').eq(0).attr('href');
    feed.description = channel.find('subtitle').eq(0).text();
    feed.language = channel.attr('xml:lang');
    feed.updated = channel.find('updated').eq(0).text();
    feed.items = [];
    
    function clean(text) {
      return text.replace(baseIRI, '')
        .replace(/\n/g,'') // newlines
        .replace(/^[ \t]+/g,'') // leading whitespace
        .replace(/[ \t]+$/g,''); // trailing whitespace
    }
    
    jQuery('entry', xml).each( function() {
      
      var entry = jQuery(this);
      var item = {
        title: grab('title', entry),
        link: grab('link', entry, false).attr('href'),
        description: grab('content', entry),
        updated: grab('updated', entry),
        id: grab('id', entry),
        author: grab('author name', channel),
        verb: grab('[nodeName="activity:verb"]', entry)
      }
    
      var object = entry.find('[nodeName="activity:object"]');
      item.object = {
        id: grab('id', object),
        title: grab('title', object),
        link: grab('link', entry, false).attr('href'),
        published: grab('published', object),
        "object-type": clean(grab('[nodeName="activity:object-type"]', object)),
        source: {
          title: grab('source title', object),
          link: grab('source link', entry, false).attr('href')
        }
      } 
        
      feed.items.push(item);
    });
  }
};

