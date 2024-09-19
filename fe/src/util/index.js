export const emojiMap = {
  ":)": "😊",
  ";)": "😉",
  ":D": "😃",
  "<3": "❤️",
  "<3*": "💖",
  ":(": "😢",
  ":O": "😮",
  ":P": "😛",
  "B)": "😎",
  ":*": "😘",
  ":|": "😐",
  ":x": "🤐",
  ":*(": "😥",
  ":#": "🤫",
  ":^)": "😇",
  ":3": "😺",
  "O:)": "😇",
  ">_<": "😣",
  ":tired:": "😴",
  ":sweat:": "😓",
  ":>": "😏",
  ":-3": "😗",
  "|3": "😚",
  "$:D": "🤑",
  ">o<": "🤮",
  ":-/": "😕",
  "o-O": "🧐",
  ":hurt": "😫",
  ":huh": "😤",
  ":haiz": "😩",
  ":slang": "🤬",
  ":sleepy": "🥱",
  ":emotional": "🥺",
  ":cold": "🥶",
  ":hot": "🥵",
  ":what": "🤨",
  ":lovely": "🥰",
  ":thinking": "🤔",
  ":friendly": "🤗",
  ":angry": "😡",
  ":shock": "😱",
  ":clown": "🤡",
  ":chicken": "🐥",
  ":penguin": "🐧",
  ":fire:": "🔥",
  ":zap:": "⚡️",
  ":100:": "💯",
  ":clap": "👏",
  ":thumbsup:": "👍",
  ":thumbsdown:": "👎",
  ":ok_hand:": "👌",
  ":ban": "⛔",
  ":wrong": "❌",
  ":?": "❓",
  ":true": "✅",
  ":Ffinger": "🖕",
  ":brain": "🧠",
  ":shit": "💩",
  ":ghost": "👻",
  ":moneybag": "💰",
  ":money": "💸",
  ":dollar": "💲",
  ":break-heart": "💔",
  ":skull": "💀",
  ":eyes": "👀",
  ":zzz": "💤",
  ":dimond": "💎",
  ":stonk": "📈",
  ":stink": "📉",
  ":target": "🎯",
  ":<18": "🔞",
  ":search": "🔍",
  ":coffee": "☕",
  ":chad": "🗿",
  ":phone": "📞",
  ":key": "🔑",
  ":lock": "🔒",
  ":link": "🔗",
  ":start": "💫",
  ":power": "💪",
  ":bomb": "💣",
  ":tear": "💧",
  ":talk": "💬",
};

export const replaceEmojis = (text) => {
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  for (let emoji in emojiMap) {
    const regex = new RegExp(escapeRegExp(emoji), "g");
    text = text.replace(regex, emojiMap[emoji]);
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
