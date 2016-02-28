var sanitizeHtml = require("sanitize-html");
var _ = require("lodash");
_.mixin({squash: require("./squash")});
var TimezonedDate = require("./TimezonedDate");
var config = require("../config");

module.exports = function(conferenceData) {
  var conferenceData = _.cloneDeep(conferenceData);
  aggregateSessionRooms(conferenceData);
  removeIgnoredBlocks(conferenceData);
  assignCategoryTypes(conferenceData);

  this.extractPreviewCategories = function() {
    var keynoteCategory = {
      id: "KEYNOTES",
      title: "Keynotes",
      sessions: this.extractKeynotes().map(function(keynote) {
        return {
          id: keynote.id,
          title: keynote.title,
          text: stripHtml(keynote.description),
          categoryName: keynote.categoryName || null,
          startTimestamp: new TimezonedDate(keynote.startTimestamp).toJSON(),
          endTimestamp: new TimezonedDate(keynote.endTimestamp).toJSON()
        };
      })
    };
    var previewCategories = getCategoriesList({exclude: "SCHEDULE_ITEM"})
      .map(function(category) {
        return createCategory(category.id, {limit: 2});
      });
    previewCategories.push(keynoteCategory);
    return previewCategories;
  };

  this.extractCategories = function() {
    return _(getCategoriesList())
      .filter(function(category) {
        return category.id !== "SCHEDULE_ITEM";
      })
      .map(function(category) {
        return createCategory(category.id);
      }).value();
  };

  this.extractKeynotes = function() {
    return getMappedSessions(function(session) {return session.session_type === "Keynote";});
  };

  this.extractSessions = function() {
    return getMappedSessions(function(session) {return session.type !== "schedule_item";});
  };

  this.extractBlocks = function() {
    return _(conferenceData.scheduledSessions)
      .filter(function(codSession) {
        return codSession.type === "schedule_item";
      })
      .groupBy(function(item) {
        return item.title + "#" + item.start + "#" + item.end;
      })
      .map(function(group) {
        return {
          title: group[0].title,
          startTimestamp: new TimezonedDate(group[0].start).toJSON(),
          endTimestamp: new TimezonedDate(group[0].end).toJSON(),
          room: _.map(group, "room").join(", ")
        };
      })
      .value();
  };

  function getMappedSessions(predicate) {
    return conferenceData.scheduledSessions
      .filter(predicate)
      .map(function(session) {
        return {
          id: session.id,
          nid: session.nid,
          title: session.title,
          description: stripHtml(session.abstract),
          room: session.room,
          categoryName: session.categoryName || null,
          startTimestamp: new TimezonedDate(session.start).toJSON(),
          endTimestamp: new TimezonedDate(session.end).toJSON(),
          speakers: session.presenter.map(function(speaker) {
            return {
              name: speaker.fullname,
              bio: stripHtml(speaker.bio),
              company: speaker.organization,
              image: speaker.picture
            };
          })
        };
      });
  }

  function createCategory(categoryId, options) {
    return {
      id: categoryId,
      title: getCategoryName(categoryId),
      sessions: getSessions(categoryId, options ? options.limit : undefined)
    };
  }

  function getCategoryName(categoryId) {
    var session = _.find(conferenceData.scheduledSessions, function(session) {
      return session.categoryId === categoryId;
    });
    return session && session.categoryName ? session.categoryName : null;
  }

  function getCategoriesList(options) {
    return _(conferenceData.scheduledSessions)
      .filter(function(session) {return options && options.exclude ? options.exclude !== session.categoryId : true;})
      .map(function(session) {
        return {id: session.categoryId, name: session.categoryName};
      })
      .uniqWith(_.isEqual)
      .value();
  }

  function getSessions(value, limit) {
    return _(conferenceData.scheduledSessions)
      .filter(function(session) {
        return session.categoryId === value;
      })
      .slice(0, limit)
      .map(categorySessionMap)
      .value();
  }

};

function categorySessionMap(session) {
  return {
    id: session.id,
    title: session.title,
    text: stripHtml(session.abstract),
    categoryName: session.categoryName || null,
    startTimestamp: new TimezonedDate(session.start).toJSON(),
    endTimestamp: new TimezonedDate(session.end).toJSON()
  };
}

function assignCategoryTypes(conferenceData) {
  conferenceData.scheduledSessions.forEach(function(session) {
    session.categoryId = session.category.toUpperCase().replace(/ /g, "_");
    session.categoryName = session.category || null;
    delete session.category;
  });
  return conferenceData;
}

function stripHtml(hypertext) {
  return sanitizeHtml(hypertext, {allowedTags: [], allowedAttributes: []});
}

function aggregateSessionRooms(conferenceData) {
  conferenceData.scheduledSessions = _(conferenceData.scheduledSessions)
    .squash(function(session) {
      return session.type === "schedule_item" ? _.uniqueId() : session.title;
    }, {
      aggregatee: "room", separator: ", "
    })
    .value();
}

function removeIgnoredBlocks(conferenceData) {
  conferenceData.scheduledSessions = _.reject(conferenceData.scheduledSessions, function(session) {
    return session.type === "schedule_item" && !!session.title.match(config.IGNORED_COD_BLOCKS);
  });
}