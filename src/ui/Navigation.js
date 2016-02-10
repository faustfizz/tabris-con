var Schedule = require("./navigatable/Schedule");
var Explore = require("./navigatable/Explore");
var Map = require("./navigatable/Map");
var Drawer = require("./Drawer");
var Settings = require("./navigatable/Settings");
var viewDataProvider = require("../data/viewDataProvider");
var colors = require("../../resources/colors");

module.exports = {
  Android: {
    create: function() {
      wrapInPage(Schedule.create()).once("appear", populateBlocks);
      var exporePage = wrapInPage(Explore.create()).once("appear", populatePreviewCategories);
      wrapInPage(Map.create());
      wrapInPage(Settings.create());
      Drawer.create();
      exporePage.open();
    }
  },
  iOS: {
    create: function() {
      var mainPage = tabris.create("Page", {
        id: "mainPage",
        topLevel: true
      }).open();
      var tabFolder = tabris.create("TabFolder", {
        left: 0, top: 0, right: 0, bottom: 0,
        textColor: colors.TINT_COLOR,
        tabBarLocation: "bottom"
      }).on("change:selection", function(tabFolder, tab) {
        mainPage.set("title", tab.get("title"));
        updateNavigatablesActiveState(tab);
        tabFolder.children("Tab").forEach(function(tab) {
          tab.set("image", tab.find(".navigatable").first().get("image"));
        });
      }).appendTo(mainPage);
      wrapInTabFolder(Schedule.create(), tabFolder)
        .once("appear", function() {
          populateBlocks(this);
        });
      var exploreTab = wrapInTabFolder(Explore.create(), tabFolder)
        .once("appear", function() {
          populatePreviewCategories(this);
        });
      wrapInTabFolder(Map.create(), tabFolder);
      wrapInTabFolder(Settings.create(), tabFolder);
      exploreTab.open();
    }
  },
  UWP: {
    create: function() {
      wrapInPage(Schedule.create()).once("appear", populateBlocks);
      var explorePage = wrapInPage(Explore.create()).once("appear", populatePreviewCategories);
      wrapInPage(Map.create());
      wrapInPage(Settings.create());
      Drawer.create();
      explorePage.open();
    }
  }
};

function wrapInTabFolder(navigatable, tabFolder) {
  var tab = tabris.create("Tab", {
    title: navigatable.get("title"),
    id: navigatable.get("id") + "Tab",
    textColor: colors.TINT_COLOR,
    left: 0, top: 0, right: 0, bottom: 0
  }).on("change:data", function(widget, data) {navigatable.set("data", data);});
  navigatable.appendTo(tab);
  tab.appendTo(tabFolder);
  tab.set("image", navigatable.get("image"));
  return navigatable;
}

function wrapInPage(navigatable) {
  var page = tabris.create("Page", {
    topLevel: true,
    title: navigatable.get("title"),
    id: navigatable.get("id") + "Page"
  }).on("change:data", function(widget, data) {navigatable.set("data", data);})
    .on("appear", updateNavigatablesActiveState);

  navigatable.appendTo(page);
  return navigatable;
}

function updateNavigatablesActiveState(navigatableWrapper) {
  var selectedNavigatable = navigatableWrapper.find(".navigatable").first();
  tabris.ui
    .find(".navigatable")
    .forEach(function(navigatable) {
      if (navigatable.get("active")) {
        navigatable.set("active", false);
      }
    });
  selectedNavigatable.set("active", true);
}

function populatePreviewCategories(navigatable) {
  if (!navigatable.get("data")) {
    viewDataProvider.asyncGetPreviewCategories()
      .then(function(previewCategories) {
        navigatable.set("data", previewCategories);
      });
  }
}

function populateBlocks(navigatable) {
  if (!navigatable.get("data")) {
    viewDataProvider.asyncGetBlocks()
      .then(function(blocks) {
        navigatable.set("data", blocks);
      });
  }
}
