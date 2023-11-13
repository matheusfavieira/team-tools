import { useState } from "react";
import "./styles.css";
import { Box } from "@mui/material";

const moods = {
  red: [
    "Enraged",
    "Panicked",
    "Stressed",
    "Jittery",
    "Shocked",
    "Livid",
    "Furious",
    "Frustrated",
    "Tense",
    "Stunned",
    "Fuming",
    "Frightened",
    "Angry",
    "Nervous",
    "Restless",
    "Anxious",
    "Apprehensive",
    "Worried",
    "Irritated",
    "Annoyed",
    "Repulsed",
    "Troubled",
    "Concerned",
    "Uneasy",
    "Peeved",
  ],
  yellow: [
    "Suprised",
    "Upbeat",
    "Festive",
    "Exhilarated",
    "Ecstatic",
    "Hyper",
    "Cheerful",
    "Motivated",
    "Inspired",
    "Elated",
    "Energized",
    "Lively",
    "Enthusiastic",
    "Optimistic",
    "Excited",
    "Pleased",
    "Happy",
    "Focused",
    "Proud",
    "Thrilled",
    "Pleasant",
    "Joyful",
    "Hopeful",
    "Playful",
    "Blissful",
  ],
  blue: [
    "Disgusted",
    "Glum",
    "Disappointed",
    "Down",
    "Apathetic",
    "Pessimistic",
    "Morose",
    "Discouraged",
    "Sad",
    "Bored",
    "Alienated",
    "Miserable",
    "Lonely",
    "Disheartened",
    "Tired",
    "Despondent",
    "Depressed",
    "Sullen",
    "Exhausted",
    "Fatigued",
    "Despair",
    "Hopeless",
    "Desolate",
    "Spent",
    "Drained",
  ],
  green: [
    "At Ease",
    "Easygoing",
    "Content",
    "Loving",
    "Fulfilled",
    "Calm",
    "Secure",
    "Satisfied",
    "Grateful",
    "Touched",
    "Relaxed",
    "Chill",
    "Restful",
    "Blessed",
    "Balanced",
    "Mellow",
    "Thoughtful",
    "Peaceful",
    "Comfy",
    "Carefree",
    "Sleepy",
    "Complacent",
    "Tranquil",
    "Cozy",
    "Serene",
  ],
};

type MoodsColor = keyof typeof moods;

const emojis = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐻‍❄️",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🦄",
  "🫎",
  "🐙",
];

const selectRandomEmoji = () =>
  emojis[Math.floor(Math.random() * emojis.length)];

export default function MoodMeter() {
  const [selectedMoods, setSelectedMoods] = useState<
    Record<string, { count: number; emoji: string }>
  >({});

  const onMoodClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    mood: string
  ) => {
    const isRemoving = e.shiftKey;

    let selectedMood = selectedMoods[mood];

    if (selectedMood) {
      selectedMood.count += isRemoving ? -1 : 1;

      if (selectedMood.count < 0) {
        selectedMood.count = 0;
      }
    } else {
      selectedMood = { count: 1, emoji: selectRandomEmoji() };
    }

    const updatedMoods = { ...selectedMoods, [mood]: selectedMood };
    setSelectedMoods(updatedMoods);
  };

  return (
    <Box className="mood-chart">
      {Object.keys(moods).map((color) => {
        const moodsByColor: string[] = moods[color as MoodsColor];

        return (
          <Box key={color} className={`mood-quadrant`}>
            {moodsByColor.map((mood, index) => {
              const selectedMood = selectedMoods[mood];
              const moodCount = selectedMood?.count ?? 0;
              const isMoodSelected = moodCount > 0;

              const moodCountPlus = moodCount > 1 ? `+${moodCount - 1}` : "";
              const moodContent = (selectedMood?.emoji ?? "") + moodCountPlus;

              const countToBeOnFire = 3;
              const limitOfFireIcons = 6;

              const countOfFires =
                moodCount > limitOfFireIcons + countToBeOnFire
                  ? limitOfFireIcons
                  : moodCount - countToBeOnFire;

              return (
                <button
                  key={mood}
                  className={`mood ${color} ${
                    isMoodSelected ? "selected" : ""
                  } ${moodCount > 3 ? "on-fire" : ""}`}
                  data-content={isMoodSelected ? moodContent : ""}
                  data-tip={`${color[0].toUpperCase()}${index + 1}`}
                  onClick={(e) => onMoodClick(e, mood)}
                >
                  {mood}{" "}
                  {countOfFires && (
                    <span className="on-fire">
                      {Array.from({ length: countOfFires }).map(() => "🔥")}
                    </span>
                  )}
                </button>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}
