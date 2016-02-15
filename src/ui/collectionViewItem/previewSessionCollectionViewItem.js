var sessionCollectionViewItem = require("./sessionCollectionViewItem.js");
var sizes = require("../../../resources/sizes");
var SessionItem = require("./SessionItem");

module.exports = {
  itemHeight: getCellHeight(),
  initializeCell: function(cell) {
    var session = SessionItem.create({height: getCellHeight()}).appendTo(cell);
    cell.on("change:item", function(cell, item) {
      session.set("data", item);
    });
  },
  select: sessionCollectionViewItem.select
};

function getCellHeight() {
  return sizes.PREVIEW_SESSION_CELL_HEIGHT;
}