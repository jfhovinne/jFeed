function JActivityStream(xml) {
    this._parse(xml);
};

JActivityStream.prototype = {
    
  _parse: function(xml) {

    var channel = jQuery(jQuery('feed', xml).eq(0));

    this.version = '1.0';
    this.title = channel.find('title').eq(0).text();
    this.link = channel.find('link').eq(0).attr('href');
    this.description = channel.find('subtitle').eq(0).text();
    this.language = channel.attr('xml:lang');
    this.updated = channel.find('updated').eq(0).text();
    
    this.items = new Array();
    
    var feed = this;
    
    jQuery('entry', xml).each( function() {
    
      var entry = jQuery(this);
      var baseIRI = 'http://activitystrea.ms/schema/1.0/';
      
      function clean(text) {
        return text.replace(baseIRI, '')
          .replace(/\n/g,'') // newlines
          .replace(/^[ \t]+/g,'') // leading whitespace
          .replace(/[ \t]+$/g,''); // trailing whitespace
      }
      
      function grab(attr, scope, text) {
        entry = scope ? scope : entry;
        text = typeof(text) === "undefined" ? true : text;
        var node = entry.find(attr).eq(0);
        if (text) {
          return clean(node.text());
        } else {
          // returns the first jquery node instead of the text
          return node;
        }
      }

      var item = {
        title: grab('title'),
        link: grab('link', false, false).attr('href'),
        description: grab('content'),
        updated: grab('updated'),
        id: grab('id'),
        author: grab('author name', channel),
        verb: grab('[nodeName="activity:verb"]')
      }
    
      var object = entry.find('[nodeName="activity:object"]');
      item.object = {
        id: grab('id', object),
        title: grab('title', object),
        link: grab('link', false, false).attr('href'),
        published: grab('published', object),
        "object-type": grab('[nodeName="activity:object-type"]', object),
        source: {
          title: grab('source title', object),
          link: grab('source link', false, false).attr('href')
        }
      } 
        
      feed.items.push(item);
    });
  }
};

