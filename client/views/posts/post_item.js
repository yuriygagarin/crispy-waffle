var POST_HEIGHT = 80;
var Positions = new Meteor.Collection(null);

Template.postItem.helpers({
  domain: function () {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  ownPost: function () {
    return this.userId === Meteor.userId();
  },
  commentsCount: function () {
    return this.commentsCount;
  },
  buttonClass: function () {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvote';
    } else {
      return 'btn-default disabled';
    }
  },
  attributes: function() {
    var post = _.extend({}, Positions.findOne({postId: this._id}), this);
    var newPosition = post._rank * POST_HEIGHT;
    var attributes = {};
    if (_.isUndefined(post.position)) {
      attributes.class = 'post invisible';
    } else {
      var offset = post.position - newPosition;
      attributes.style = "top: " + offset + "px";
      if (offset === 0)
        attributes.class = "post animate";
    }
    Meteor.setTimeout(function() {
      Positions.upsert({postId: post._id}, {$set: {position: newPosition}});
    });
    return attributes;
  }
});

Template.postItem.events({
  'click .upvote': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});