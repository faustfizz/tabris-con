var colors = require("../../resources/colors");
var sizes = require("../../resources/sizes");
var DrawerUserArea = require("./DrawerUserArea");
var fontToString = require("../fontToString");
var getImage = require("../getImage");
var loginService = require("../loginService");
var addProgressTo = require("./addProgressTo");

exports.create = function() {
  var accountModeEnabled = false;
  var drawer = tabris.create("Drawer", {
    accountMode: false
  });
  var scrollView = tabris.create("ScrollView", {
    left: 0, top: 0, right: 0, bottom: 0
  }).appendTo(drawer);

  var drawerUserArea = DrawerUserArea
    .create()
    .on("loggedInTap", function() {drawer.set("accountMode", !drawer.get("accountMode"));})
    .appendTo(scrollView);

  var drawerList = createDrawerList();
  var accountList = createAccountList();

  tabris.ui.on("change:activePage", function() {
    updateDrawerListSelection();
    drawer.close();
  });

  function updateDrawerListSelection() {
    drawerList.children()
      .filter(function(child) {
        return child.get("page") instanceof tabris.Page && child.get("page").get("topLevel");
      })
      .forEach(function(pageItem) {
        pageItem.updateSelection();
      });
  }

  drawer.on("change:accountMode", function(widget, value) {
    accountList.set("visible", value);
    drawerList.set("visible", !value);
    drawerUserArea.find("#menuArrowImageView").set("transform", value ? {rotation: Math.PI} : null);
    accountModeEnabled = value;
  });

  drawer.on("logoutSuccess", function() {
    drawerUserArea.set("loggedIn", false);
    drawer.set("accountMode", false);
  });

  function createDrawerList() {
    var drawerList = tabris.create("Composite", {
      left: 0, top: ["#userArea", sizes.MARGIN], right: 0
    }).appendTo(scrollView);
    createPageListItem("schedulePage").appendTo(drawerList);
    createPageListItem("tracksPage").appendTo(drawerList);
    createPageListItem("mapPage").appendTo(drawerList);
    createSeparator().appendTo(drawerList);
    createPageListItem("aboutPage").appendTo(drawerList);
    return drawerList;
  }

  function createPageListItem(id) {
    var page = tabris.ui.find("#" + id).first();
    var pageListItem = createListItem(page.get("title"), page.get("image"));
    pageListItem.updateSelection = function() {
      pageListItem.find("#iconImageView").set("image", page.find(".navigatable").get("image"));
      pageListItem.set("background", page.find(".navigatable").get("active") ?
        colors.LIGHT_BACKGROUND_COLOR : "transparent");
    };
    pageListItem.set("page", page);
    pageListItem.on("tap", function() {page.open();});
    return pageListItem;
  }

  function createAccountList() {
    var accountList = tabris.create("Composite", {
      left: 0, top: ["#userArea", 8], right: 0,
      visible: false
    }).appendTo(scrollView);
    createListItem("Logout", getImage.forDevicePlatform("logout"))
      .on("tap", function(widget) {
        this.set("progress", true);
        loginService.logout().then(function() {widget.set("progress", false);});
      })
      .appendTo(accountList);
    return accountList;
  }

  function createSeparator() {
    var container = tabris.create("Composite", {
      left: 0,
      top: "prev()",
      right: 0,
      height: sizes.DRAWER_SEPARATOR_HEIGHT
    });
    tabris.create("Composite", {
      left: 0, right: 0, centerY: 0, height: 1,
      id: "separator",
      background: "#e8e8e8"
    }).appendTo(container);
    return container;
  }

  function createListItem(text, image) {
    var listItem = tabris.create("Composite", {
      left: 0, top: "prev()", right: 0, height: sizes.DRAWER_LIST_ITEM_HEIGHT,
      highlightOnTouch: true,
      progress: false
    });
    addProgressTo(listItem);
    tabris.create("ImageView", {
      id: "iconImageView",
      image: image,
      left: sizes.MARGIN_LARGE, centerY: 0
    }).appendTo(listItem);
    tabris.create("TextView", {
      id: "titleTextView",
      text: text,
      left: sizes.LEFT_CONTENT_MARGIN, centerY: 0,
      font: fontToString({
        weight: "bold",
        size: sizes.FONT_MEDIUM,
        family: device.platform === "iOS" ? ".HelveticaNeueInterface-Bold" : null
      }),
      textColor: colors.DRAWER_TEXT_COLOR
    }).appendTo(listItem);
    return listItem;
  }

};
