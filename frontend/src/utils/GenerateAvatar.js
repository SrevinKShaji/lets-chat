const generateDiceBearAvataaars = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

const generateDiceBearBottts = (seed) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

const generateDiceBearGridy = (seed) =>
  `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

export const generateAvatar = () => {
  const data = [];

  for (let i = 0; i < 2; i++) {
    const seed = Math.random().toString(36).substring(7);
    data.push(generateDiceBearAvataaars(seed));
  }
  for (let i = 0; i < 2; i++) {
    const seed = Math.random().toString(36).substring(7);
    data.push(generateDiceBearBottts(seed));
  }
  for (let i = 0; i < 2; i++) {
    const seed = Math.random().toString(36).substring(7);
    data.push(generateDiceBearGridy(seed));
  }
  return data;
};

