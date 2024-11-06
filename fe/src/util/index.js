import { POST } from "../config/API";
import { Route, UTIL_PATH } from "../Breads-Shared/APIConfig";

export const emojiMap = {
  ":)": {
    icon: "😊",
    names: ["happy", "pleased", "glad", "delighted"],
  },
  ";)": {
    icon: "😉",
    names: ["wink", "blink", "nictitate"],
  },
  ":D": {
    icon: "😃",
    names: ["haha", "laugh", "giggle", "snicker"],
  },
  "<3": {
    icon: "❤️",
    names: ["heart", "love", "like"],
  },
  "<3*": {
    icon: "💖",
    names: ["start-heart", "start", "heart"],
  },
  ":(": {
    icon: "😢",
    names: ["cry", "sad", "weep", "unhappy"],
  },
  ":O": {
    icon: "😮",
    names: ["wow", "shock", "surprise"],
  },
  ":P": {
    icon: "😛",
    names: ["hey", "laugh", "haha", "giggle"],
  },
  "B)": {
    icon: "😎",
    names: ["cool", "unfazed", "unruffled", "calm"],
  },
  ":*": {
    icon: "😘",
    names: ["kiss", "love", "like", "heart"],
  },
  ":|": {
    icon: "😐",
    names: ["nah", "quiet", "hmm", "silent", "nervous", "afraid", "worried"],
  },
  ":x": {
    icon: "🤐",
    names: ["silent", "ban", "quiet"],
  },
  ":*(": {
    icon: "😥",
    names: ["nervous", "panic", "afraid", "worried"],
  },
  ":#": {
    icon: "🤫",
    names: ["shh", "silent", "quiet"],
  },
  ":^)": {
    icon: "😇",
    names: ["peace", "peaceful", "happy", "harmony"],
  },
  ":3": {
    icon: "😺",
    names: ["cat", "happy", "kitty"],
  },
  ">_<": {
    icon: "😣",
    names: ["awk", "hurt", "injure", "wound"],
  },
  ":tired:": {
    icon: "😴",
    names: ["sleep", "sleepy", "slumber", "nap"],
  },
  ":sweat:": {
    icon: "😓",
    names: ["sweat", "afraid", "worried", "sorry"],
  },
  ":>": {
    icon: "😏",
    names: ["hmm", "cool", "vainglorious"],
  },
  ":-3": {
    icon: "😗",
    names: ["whistle", "pipe"],
  },
  "|3": {
    icon: "😚",
    names: ["blissful", "happy", "glad", "pleased"],
  },
  "$:D": {
    icon: "🤑",
    names: ["money-face", "money", "dollar"],
  },
  ">o<": {
    icon: "🤮",
    names: ["vomit", "ew", "throw up"],
  },
  ":-/": {
    icon: "😕",
    names: ["nah", "sad", "bad", "unhappy"],
  },
  "o-O": {
    icon: "🧐",
    names: ["thinking", "suspect", "doubt", "question"],
  },
  ":hurt": {
    icon: "😫",
    names: ["hurt", "cry", "unhappy", "painful", "injure", "wound"],
  },
  ":huh": {
    icon: "😤",
    names: ["breath", "decisive", "determine"],
  },
  ":haiz": {
    icon: "😩",
    names: ["haiz", "sad", "unhappy", "tired"],
  },
  ":slang": {
    icon: "🤬",
    names: ["angry", "slang", "annoyed", "furious"],
  },
  ":sleepy": {
    icon: "🥱",
    names: ["yawn", "sleep", "sleepy", "bed"],
  },
  ":emotional": {
    icon: "🥺",
    names: ["emotion", "cry", "passion", "sentiment"],
  },
  ":cold": {
    icon: "🥶",
    names: ["cold", "freeze", "icy", "freezing"],
  },
  ":hot": {
    icon: "🥵",
    names: ["hot", "nervous"],
  },
  ":what": {
    icon: "🤨",
    names: ["what", "thinking", "hmm", "suspect", "doubt"],
  },
  ":lovely": {
    icon: "🥰",
    names: ["lovely", "happy", "love", "like"],
  },
  ":thinking": {
    icon: "🤔",
    names: ["thinking", "doubt", "suspect", "hmm"],
  },
  ":friendly": {
    icon: "🤗",
    names: ["hugging", "friendly", "happy"],
  },
  ":angry": {
    icon: "😡",
    names: ["angry", "annoyed", "furious"],
  },
  ":shock": {
    icon: "😱",
    names: ["shock", "unbelieve", "wow"],
  },
  ":clown": {
    icon: "🤡",
    names: ["clown", "happy", "fool", "joker"],
  },
  ":chicken": {
    icon: "🐥",
    names: ["chicken", "noob", "chick"],
  },
  ":penguin": {
    icon: "🐧",
    names: ["penguin", "noob"],
  },
  ":fire:": {
    icon: "🔥",
    names: ["fire", "hot", "blaze"],
  },
  ":zap:": {
    icon: "⚡️",
    names: ["zap", "lightning"],
  },
  ":100:": {
    icon: "💯",
    names: ["100", "perfect", "nice", "good", "applaud"],
  },
  ":clap": {
    icon: "👏",
    names: ["clap", "nice", "good", "applaud"],
  },
  ":thumbsup:": {
    icon: "👍",
    names: ["like", "good", "ok", "nice", "enjoy"],
  },
  ":thumbsdown:": {
    icon: "👎",
    names: ["dislike", "bad", "hate"],
  },
  ":ok_hand:": {
    icon: "👌",
    names: ["ok", "like", "good"],
  },
  ":ban": {
    icon: "⛔",
    names: ["ban", "prohibit", "disallow"],
  },
  ":wrong": {
    icon: "❌",
    names: ["ban", "prohibit", "disallow", "wrong", "false"],
  },
  ":?": {
    icon: "❓",
    names: ["?", "what", "hmm", "thinking"],
  },
  ":true": {
    icon: "✅",
    names: ["true", "nice", "good", "correct"],
  },
  ":Ffinger": {
    icon: "🖕",
    names: ["f-finger", "slang", "dislike"],
  },
  ":brain": {
    icon: "🧠",
    names: ["brain", "thinking"],
  },
  ":shit": {
    icon: "💩",
    names: ["shit", "excrement", "happy"],
  },
  ":ghost": {
    icon: "👻",
    names: ["ghost", "scary", "laugh"],
  },
  ":moneybag": {
    icon: "💰",
    names: ["money-bag", "money", "bag"],
  },
  ":money": {
    icon: "💸",
    names: ["money", "dollar"],
  },
  ":dollar": {
    icon: "💲",
    names: ["dollar", "money"],
  },
  ":break-heart": {
    icon: "💔",
    names: ["broken-heart", "sad", "painful"],
  },
  ":skull": {
    icon: "💀",
    names: ["skull", "death"],
  },
  ":eyes": {
    icon: "👀",
    names: ["eyes", "look", "what"],
  },
  ":zzz": {
    icon: "💤",
    names: ["zzz", "sleep", "sleepy", "bed"],
  },
  ":dimond": {
    icon: "💎",
    names: ["diamond", "jewerly", "money"],
  },
  ":stonk": {
    icon: "📈",
    names: ["stonk", "graph"],
  },
  ":stink": {
    icon: "📉",
    names: ["stink", "graph"],
  },
  ":target": {
    icon: "🎯",
    names: ["target", "score"],
  },
  ":<18": {
    icon: "🔞",
    names: ["under-18", "ban", "disallow", "prohibit"],
  },
  ":search": {
    icon: "🔍",
    names: ["search", "research", "find"],
  },
  ":coffee": {
    icon: "☕",
    names: ["coffee"],
  },
  ":chad": {
    icon: "🗿",
    names: ["chad", "bro", "thinking", "cool"],
  },
  ":phone": {
    icon: "📞",
    names: ["phone", "ring", "call"],
  },
  ":key": {
    icon: "🔑",
    names: ["key", "solution", "answer"],
  },
  ":lock": {
    icon: "🔒",
    names: ["lock", "question"],
  },
  ":link": {
    icon: "🔗",
    names: ["link", "hyperlink"],
  },
  ":start": {
    icon: "💫",
    names: ["star", "nice", "good"],
  },
  ":power": {
    icon: "💪",
    names: ["power", "strong", "good", "fighting"],
  },
  ":bomb": {
    icon: "💣",
    names: ["bomb", "mine", "rocket"],
  },
  ":water": {
    icon: "💧",
    names: ["water", "tear", "cry"],
  },
  ":talk": {
    icon: "💬",
    names: ["chat", "talk", "conversation"],
  },
};

export const replaceEmojis = (text) => {
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  for (let emoji in emojiMap) {
    const regex = new RegExp(escapeRegExp(emoji), "g");
    text = text.replace(regex, emojiMap[emoji].icon);
  }
  return text;
};

export const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const handleUploadFiles = async ({ files, userId }) => {
  try {
    if (!!files && files?.length > 0 && !userId) {
      return [];
    }
    const formData = new FormData();
    const filesName = [];
    for (let i = 0; i < files.length; i++) {
      filesName.push(files[i].name);
      formData.append("files", files[i]);
    }
    formData.append("filesName", filesName);
    const filesId = await POST({
      path: Route.UTIL + UTIL_PATH.UPLOAD + `?userId=${userId}`,
      payload: formData,
    });
    return filesId;
  } catch (err) {
    console.error("handleUploadFiles: ", err);
    return [];
  }
};

export const getUserTimezoneOffset = () => {
  const offsetInMinutes = new Date().getTimezoneOffset();
  const offsetInHours = -offsetInMinutes / 60;
  const sign = offsetInHours >= 0 ? "+" : "-";
  return `${sign}${Math.abs(offsetInHours)}`;
};

export const convertUTCToLocalTime = (utcDateString) => {
  const timeZoneOffset = getUserTimezoneOffset();
  const utcDate = new Date(utcDateString);
  const offsetHours = parseInt(timeZoneOffset, 10);
  const localTime = new Date(utcDate.getTime() + offsetHours * 60 * 60 * 1000);
  return localTime;
};

export const isDifferentDate = (date1, date2) => {
  return (
    date1.getFullYear() !== date2.getFullYear() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getDate() !== date2.getDate()
  );
};

export const formatDateToDDMMYYYY = (date) => {
  let dateValue = date ?? new Date();
  const day = String(dateValue.getDate()).padStart(2, "0");
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const year = dateValue.getFullYear();

  return `${day}/${month}/${year}`;
};

export const generateObjectId = () => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const randomValue = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  ).join("");
  const counter = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");

  return timestamp + randomValue + counter;
};
