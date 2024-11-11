const messageThemes = {
  // Theme 0: Default
  default: {
    conversationBackground: {
      backgroundImage: "url('/path/to/soft-sky-background.jpg')",
      backgroundColor: "#181818",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#4299e1",
      color: "white",
      borderColor: "#2B6CB0",
    },
    user2Message: {
      backgroundColor: "#a0aec0",
      color: "black",
      borderColor: "#718096",
    },
  },
  // Theme 1: Soft Sky - Light and Airy
  softSky: {
    conversationBackground: {
      backgroundImage: "url('/path/to/soft-sky-background.jpg')",
      backgroundColor: "#E3F2FD",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#BBDEFB",
      color: "#0D47A1",
      borderColor: "#90CAF9",
    },
    user2Message: {
      backgroundColor: "#E1F5FE",
      color: "#01579B",
      borderColor: "#B3E5FC",
    },
  },

  // Theme 2: Warm Desert - Earthy and Neutral
  warmDesert: {
    conversationBackground: {
      backgroundImage: "url('/path/to/desert-background.jpg')",
      backgroundColor: "#FBE9E7",
      backgroundBlendMode: "overlay",
    },
    user1Message: {
      backgroundColor: "#FFCCBC",
      color: "#BF360C",
      borderColor: "#FFAB91",
    },
    user2Message: {
      backgroundColor: "#FFAB91",
      color: "#D84315",
      borderColor: "#FF8A65",
    },
  },

  // Theme 3: Midnight Glow - Dark and Vibrant
  midnightGlow: {
    conversationBackground: {
      backgroundImage: "url('/path/to/midnight-background.jpg')",
      backgroundColor: "#212121",
      backgroundBlendMode: "multiply",
    },
    user1Message: {
      backgroundColor: "#424242",
      color: "#FFD54F",
      borderColor: "#303030",
    },
    user2Message: {
      backgroundColor: "#616161",
      color: "#FFAB40",
      borderColor: "#484848",
    },
  },

  // Theme 4: Lavender Bloom - Calm and Elegant
  lavenderBloom: {
    conversationBackground: {
      backgroundImage: "url('/path/to/lavender-background.jpg')",
      backgroundColor: "#F3E5F5",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#CE93D8",
      color: "#4A148C",
      borderColor: "#AB47BC",
    },
    user2Message: {
      backgroundColor: "#E1BEE7",
      color: "#6A1B9A",
      borderColor: "#BA68C8",
    },
  },

  // Theme 5: Cyberwave - Neon and Futuristic
  cyberwave: {
    conversationBackground: {
      backgroundImage: "url('/path/to/cyberpunk-background.jpg')",
      backgroundColor: "#1E1E2C",
      backgroundBlendMode: "multiply",
    },
    user1Message: {
      backgroundColor: "#18FFFF",
      color: "#0D47A1",
      borderColor: "#00E5FF",
    },
    user2Message: {
      backgroundColor: "#FF80AB",
      color: "#880E4F",
      borderColor: "#FF4081",
    },
  },
  oceanBreeze: {
    conversationBackground: {
      backgroundImage: "url('/path/to/ocean-background.jpg')",
      backgroundColor: "#E0F7FA",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#4FC3F7",
      color: "#0277BD",
      borderColor: "#29B6F6",
    },
    user2Message: {
      backgroundColor: "#B3E5FC",
      color: "#01579B",
      borderColor: "#81D4FA",
    },
  },

  // Theme 7: Autumn Forest - Warm and Earthy
  autumnForest: {
    conversationBackground: {
      backgroundImage: "url('/path/to/autumn-forest-background.jpg')",
      backgroundColor: "#FBE9E7",
      backgroundBlendMode: "overlay",
    },
    user1Message: {
      backgroundColor: "#FFAB91",
      color: "#BF360C",
      borderColor: "#FF8A65",
    },
    user2Message: {
      backgroundColor: "#FF7043",
      color: "#D84315",
      borderColor: "#FF5722",
    },
  },

  // Theme 8: Galaxy Night - Mysterious and Cosmic
  galaxyNight: {
    conversationBackground: {
      backgroundImage: "url('/path/to/galaxy-background.jpg')",
      backgroundColor: "#212121",
      backgroundBlendMode: "multiply",
    },
    user1Message: {
      backgroundColor: "#673AB7",
      color: "#D1C4E9",
      borderColor: "#512DA8",
    },
    user2Message: {
      backgroundColor: "#4527A0",
      color: "#B39DDB",
      borderColor: "#311B92",
    },
  },

  // Theme 9: Minty Fresh - Cool and Modern
  mintyFresh: {
    conversationBackground: {
      backgroundImage: "url('/path/to/minty-background.jpg')",
      backgroundColor: "#E0F2F1",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#80CBC4",
      color: "#004D40",
      borderColor: "#4DB6AC",
    },
    user2Message: {
      backgroundColor: "#B2DFDB",
      color: "#00695C",
      borderColor: "#80CBC4",
    },
  },

  // Theme 10: Urban Jungle - Lush and Green
  urbanJungle: {
    conversationBackground: {
      backgroundImage: "url('/path/to/jungle-background.jpg')",
      backgroundColor: "#C8E6C9",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#66BB6A",
      color: "#2E7D32",
      borderColor: "#4CAF50",
    },
    user2Message: {
      backgroundColor: "#A5D6A7",
      color: "#388E3C",
      borderColor: "#81C784",
    },
  },
  sunsetGlow: {
    conversationBackground: {
      backgroundImage: "url('/path/to/sunset-background.jpg')",
      backgroundColor: "#FFE0B2",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#FFB74D",
      color: "#E65100",
      borderColor: "#FFA726",
    },
    user2Message: {
      backgroundColor: "#FFCC80",
      color: "#BF360C",
      borderColor: "#FFB74D",
    },
  },

  // Theme 12: Winter Frost - Cool and Icy
  winterFrost: {
    conversationBackground: {
      backgroundImage: "url('/path/to/winter-frost-background.jpg')",
      backgroundColor: "#E0F7FA",
      backgroundBlendMode: "overlay",
    },
    user1Message: {
      backgroundColor: "#80DEEA",
      color: "#006064",
      borderColor: "#4DD0E1",
    },
    user2Message: {
      backgroundColor: "#B2EBF2",
      color: "#004D40",
      borderColor: "#80DEEA",
    },
  },

  // Theme 13: Neon Lights - Bold and Vibrant
  neonLights: {
    conversationBackground: {
      backgroundImage: "url('/path/to/neon-background.jpg')",
      backgroundColor: "#1A237E",
      backgroundBlendMode: "multiply",
    },
    user1Message: {
      backgroundColor: "#FF4081",
      color: "#C2185B",
      borderColor: "#F50057",
    },
    user2Message: {
      backgroundColor: "#E040FB",
      color: "#6A1B9A",
      borderColor: "#D500F9",
    },
  },

  // Theme 14: Vintage Paper - Rustic and Classic
  vintagePaper: {
    conversationBackground: {
      backgroundImage: "url('/path/to/vintage-paper-background.jpg')",
      backgroundColor: "#FFF3E0",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#D7CCC8",
      color: "#3E2723",
      borderColor: "#BCAAA4",
    },
    user2Message: {
      backgroundColor: "#BCAAA4",
      color: "#5D4037",
      borderColor: "#A1887F",
    },
  },

  // Theme 15: Candy Land - Fun and Colorful
  candyLand: {
    conversationBackground: {
      backgroundImage: "url('/path/to/candy-land-background.jpg')",
      backgroundColor: "#FFEBEE",
      backgroundBlendMode: "overlay",
    },
    user1Message: {
      backgroundColor: "#F48FB1",
      color: "#880E4F",
      borderColor: "#F06292",
    },
    user2Message: {
      backgroundColor: "#CE93D8",
      color: "#4A148C",
      borderColor: "#BA68C8",
    },
  },
  desertOasis: {
    conversationBackground: {
      backgroundImage: "url('/path/to/desert-background.jpg')",
      backgroundColor: "#FFF3E0",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#FFB74D",
      color: "#E65100",
      borderColor: "#FFA726",
    },
    user2Message: {
      backgroundColor: "#FFCC80",
      color: "#D84315",
      borderColor: "#FFB74D",
    },
  },

  // Theme 17: Aurora Borealis - Mystical and Ethereal
  auroraBorealis: {
    conversationBackground: {
      backgroundImage: "url('/path/to/aurora-background.jpg')",
      backgroundColor: "#0D47A1",
      backgroundBlendMode: "overlay",
    },
    user1Message: {
      backgroundColor: "#64B5F6",
      color: "#002171",
      borderColor: "#42A5F5",
    },
    user2Message: {
      backgroundColor: "#BBDEFB",
      color: "#0D47A1",
      borderColor: "#90CAF9",
    },
  },

  // Theme 18: Cyberpunk City - Futuristic and Neon
  cyberpunkCity: {
    conversationBackground: {
      backgroundImage: "url('/path/to/cyberpunk-city-background.jpg')",
      backgroundColor: "#1C1C1E",
      backgroundBlendMode: "multiply",
    },
    user1Message: {
      backgroundColor: "#8E24AA",
      color: "#E1BEE7",
      borderColor: "#00C853",
    },
    user2Message: {
      backgroundColor: "#D81B60",
      color: "#F48FB1",
      borderColor: "#F50057",
    },
  },

  // Theme 19: Spring Blossom - Soft and Pastel
  springBlossom: {
    conversationBackground: {
      backgroundImage: "url('/path/to/spring-blossom-background.jpg')",
      backgroundColor: "#FFFDE7",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#F8BBD0",
      color: "#880E4F",
      borderColor: "#F8BBD0",
    },
    user2Message: {
      backgroundColor: "#FFCDD2",
      color: "#B71C1C",
      borderColor: "#F48FB1",
    },
  },

  // Theme 20: Starry Sky - Calm and Dreamy
  starrySky: {
    conversationBackground: {
      backgroundImage: "url('/path/to/starry-sky-background.jpg')",
      backgroundColor: "#212121",
      backgroundBlendMode: "soft-light",
    },
    user1Message: {
      backgroundColor: "#283593",
      color: "#E8EAF6",
      borderColor: "#1A237E",
    },
    user2Message: {
      backgroundColor: "#3F51B5",
      color: "#C5CAE9",
      borderColor: "#1E88E5",
    },
  },
};

export const getCurrentTheme = (themeName) => {
  if (!!themeName && themeName in messageThemes) {
    return messageThemes[themeName];
  }
  return {};
};

export default messageThemes;
