/* global Avatars */

// This really needs to be done properly - build an avatar collection, allow
// user upload, and so on.

Avatars = {

  // The number of built in images.

  count: function () {
    return 42;
  },

  // An array of all built in images - ava<id>.png

  find: function () {
    var items = new Array();

    for (var id = 1; id <= this.count(); id += 1) 
      items.push({ _id: id, image: this.image(id) });
    
    return items;
  },

  // Generate an image file name, even if the avatar is undefined. The
  // id can be an actual file name.

  image: function (id) {
    var image = 'default.png';

    if ((typeof id === 'string') && id.match('[0-9]+'))
      id = +id;
    
    if ((typeof id === 'number') && (Math.floor(id) === id)) {
      if ((id > 0) && (id <= this.count()))
        image = 'ava' + id + '.png';
      else
        image = 'unknown.png';
    }
    else if (typeof id === 'string') {
      if (id.toLowerCase().endsWith('.png') || 
          id.toLowerCase().endsWith('.jpg'))
        image = id;
    }
    return (image.charAt(0) == '/') ? image: '/avatars/' + image;
  }
};
