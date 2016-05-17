export default {
  DATA_TYPE: "cod",
  CONFERENCE_NAME: "EclipseCon NA 2016",
  SERVICE_URL: "https://www.eclipsecon.org/na2016",
  SUPPORTS_FEEDBACK: true,
  SESSIONS_HAVE_IMAGES: false,
  CONFERENCE_TIMEZONE: "America/New_York",
  FEEDBACK_START: "07.03.2016 12:00",
  FEEDBACK_DEADLINE: "18.03.2016 23:59",
  IGNORED_BLOCKS: "^Reserved for",
  SCHEDULE_PATTERN_ICON_MAP: {
    "^Lunch": "schedule_icon_food",
    "Break$": "schedule_icon_break",
    "Late Night$": "schedule_icon_fun",
    "^(Happy Hour|Exhibitors)": "schedule_icon_dialog",
    "^(BROWSE SESSIONS|VORTRÄGE DURCHSUCHEN)": "schedule_icon_plus",
    ".*": "schedule_icon_session"
  },
  TRACK_COLOR: {
    "Other Cool Stuff": "#00dedb",
    "Eclipse Platform / RCP / Runtimes": "#b56bdb",
    "Embedded": "#ff5f6a",
    "IDEs": "#a8d1ac",
    "IoT Summit": "#e88c09",
    "Java 9": "#77ed6b",
    "Languages and Tools": "#bebebe",
    "Methodology and Devops": "#fdd700",
    "Modeling": "#a08d75",
    "Science": "#00bfff",
    "Web / Mobile / Cloud Development": "#a1acff"
  },
  FREE_BLOCKS: [
    ["07.03.2016 09:00", "07.03.2016 12:00"],
    ["07.03.2016 13:00", "07.03.2016 16:00"],
    ["08.03.2016 09:30", "08.03.2016 10:30"],
    ["08.03.2016 11:00", "08.03.2016 11:35"],
    ["08.03.2016 11:45", "08.03.2016 12:20"],
    ["08.03.2016 13:30", "08.03.2016 14:05"],
    ["08.03.2016 14:15", "08.03.2016 14:50"],
    ["08.03.2016 15:00", "08.03.2016 15:35"],
    ["08.03.2016 16:15", "08.03.2016 16:50"],
    ["08.03.2016 17:00", "08.03.2016 18:00"],
    ["09.03.2016 09:00", "09.03.2016 10:00"],
    ["09.03.2016 10:30", "09.03.2016 11:05"],
    ["09.03.2016 11:15", "09.03.2016 11:50"],
    ["09.03.2016 13:30", "09.03.2016 14:05"],
    ["09.03.2016 14:15", "09.03.2016 14:50"],
    ["09.03.2016 15:00", "09.03.2016 15:35"],
    ["09.03.2016 16:15", "09.03.2016 16:50"],
    ["09.03.2016 17:00", "09.03.2016 17:35"],
    ["10.03.2016 09:00", "10.03.2016 10:00"],
    ["10.03.2016 10:30", "10.03.2016 11:05"],
    ["10.03.2016 11:15", "10.03.2016 11:50"],
    ["10.03.2016 12:00", "10.03.2016 12:35"],
    ["10.03.2016 13:45", "10.03.2016 14:20"],
    ["10.03.2016 14:30", "10.03.2016 15:05"]
  ],
  IGNORED_BLOCK_PATTERN: "^Reserved for",
  COLOR_SCHEME: {
    TINT_COLOR: "#443684",
    ANDROID_ACTION_AREA_FOREGROUND_COLOR: "#ffffff",
    ANDROID_ACTION_AREA_BACKGROUND_COLOR: "#443684",
    IOS_ACTION_AREA_FOREGROUND_COLOR: "#443684",
    WINDOWS_ACTION_AREA_FOREGROUND_COLOR: "#ffffff",
    WINDOWS_ACTION_AREA_BACKGROUND_COLOR: "#443684",
    BACKGROUND_COLOR: "#443684",
    INFO_TOAST_BACKGROUND_COLOR: "#323232",
    ACTION_COLOR: "#FFC107",
    ERROR_COLOR: "#F44336",
    DRAWER_TEXT_COLOR: "rgba(0, 0, 0, 0.78)",
    DARK_PRIMARY_TEXT_COLOR: "rgba(0, 0, 0, 0.87)",
    DARK_SECONDARY_TEXT_COLOR: "rgba(0, 0, 0, 0.54)",
    LIGHT_PRIMARY_TEXT_COLOR: "rgba(255, 255, 255, 1)",
    LIGHT_SECONDARY_TEXT_COLOR: "rgba(255, 255, 255, 0.7)",
    LIGHT_TEXT_COLOR: "#ffffff",
    ACCENTED_TEXT_COLOR: "#443684",
    LIGHT_BACKGROUND_COLOR: "#efefef",
    DRAWER_LIST_ITEM_BACKGROUND: {
      iOS: "#efefef",
      Android: "#efefef",
      windows: "#443684"
    },
    LINE_SEPARATOR_COLOR: "#d9d9d9",
    MAP_BACKGROUND_COLOR: "#cdcbcc",
    LINK_COLOR: "#48a8f4",
    KEYNOTE_TITLE_COLOR: "#FFC107",
    ANDROID_BUTTON_DISABLED_BACKGROUND: "#aba1d5"
  },
  BUNDLED_CONFERENCE_DATA: {
    scheduledSessions: "../json/cod/scheduled_sessions.json"
  }
};
