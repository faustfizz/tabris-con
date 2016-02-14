var PREVIEW_CATEGORIES = ["TOPIC", "THEME"];
var _ = require("lodash");

module.exports = function(conferenceData) {
  this.extractPreviewCategories = function() {
    var previewCategories = getTagsForCategories(PREVIEW_CATEGORIES)
      .map(function(tagToPreview) {
        return createCategory(tagToPreview, {sessionsLimit: 2});
      });
    var keynotes = {
      id: "KEYNOTES",
      title: "Keynotes",
      sessions: this.extractKeynotes().map(function(keynote) {
        return {
          id: keynote.id,
          title: keynote.title,
          image: keynote.image,
          text: keynote.description,
          startTimestamp: keynote.startTimestamp,
          endTimestamp: keynote.endTimestamp
        };
      })
    };
    previewCategories.push(keynotes);
    return previewCategories;
  };

  this.extractCategories = function() {
    var allCategories = _.map(conferenceData.sessionData.tags, "category");
    return getTagsForCategories(allCategories)
      .map(function(tagToPreview) {
        return createCategory(tagToPreview);
      });
  };

  this.extractKeynotes = function() {
    return conferenceData.keynote.sessions.map(sessionMap);
  };

  this.extractSessions = function() {
    return conferenceData.sessionData.sessions.map(sessionMap);
  };

  this.extractBlocks = function() {
    return conferenceData.blocks.blocks
      .filter(function(googleIOBlock) {
        return googleIOBlock.type !== "free";
      })
      .map(function(googleIOBlock) {
        return {
          title: googleIOBlock.title,
          room: googleIOBlock.subtitle,
          startTimestamp: googleIOBlock.start,
          endTimestamp: googleIOBlock.end
        };
      });
  };

  function sessionMap(googleIOSession) {
    return {
      id: googleIOSession.id,
      title: googleIOSession.title,
      description: googleIOSession.description,
      room: getGoogleIOSessionRoom(googleIOSession),
      image: googleIOSession.photoUrl,
      startTimestamp: googleIOSession.startTimestamp,
      endTimestamp: googleIOSession.endTimestamp,
      speakers: findSpeakers(googleIOSession.speakers)
    };
  }

  function findSpeakers(googleIOSessionSpeakers) {
    return conferenceData.sessionData.speakers
      .filter(function(speaker) {
        return googleIOSessionSpeakers.indexOf(speaker.id) > -1;
      })
      .map(function(googleIOSpeaker) {
        return {
          name: googleIOSpeaker.name,
          bio: googleIOSpeaker.bio || null,
          image: googleIOSpeaker.thumbnailUrl || null,
          company: googleIOSpeaker.company || null
        };
      });
  }

  function getTagsForCategories(categories) {
    return _(conferenceData.sessionData.tags)
      .filter(function(tag) {
        return categories.indexOf(tag.category) > -1;
      })
      .map("tag").value();
  }

  function getGoogleIOSessionRoom(googleIOSession) {
    return _(conferenceData.sessionData.rooms)
      .find(function(room) {
        return room.id === googleIOSession.room;
      }).name;
  }

  function createCategory(tag, filter) {
    return {
      id: tag,
      title: getTagName(tag),
      sessions: getSessions(tag, filter ? filter.sessionsLimit : undefined)
    };
  }

  function getTagName(tag) {
    var tagObject = _.find(conferenceData.sessionData.tags, function(tagObject) {
      return tagObject.tag === tag;
    });
    return tagObject.name || null;
  }

  function getSessions(tag, limit) {
    return conferenceData.sessionData.sessions
      .filter(function(session) {
        return session.tags.indexOf(tag) > -1;
      })
      .slice(0, limit)
      .map(function(session) {
        return {
          id: session.id,
          title: session.title,
          image: session.photoUrl,
          text: session.description,
          startTimestamp: session.startTimestamp,
          endTimestamp: session.endTimestamp
        };
      });
  }
};
