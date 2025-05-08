"use client";

import React from "react";

export default function ({
  speedDeleting = 100,
  speedTyping = 150,
  timePause = 1000,
  words,
}: {
  speedDeleting?: number;
  speedTyping?: number;
  timePause?: number;
  words: string[];
}) {
  const [indexCurrentWord, setIndexCurrentWord] = React.useState(0);
  const [text, setText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [indexCharacter, setCharacterIndex] = React.useState(0);

  React.useEffect(() => {
    const currentWord = words[indexCurrentWord];
    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      if (indexCharacter < currentWord.length) {
        timeoutId = setTimeout(() => {
          setText(currentWord.substring(0, indexCharacter + 1));
          setCharacterIndex((prev) => prev + 1);
        }, speedTyping);
      } else {
        timeoutId = setTimeout(() => setIsDeleting(true), timePause);
      }
    } else {
      if (indexCharacter > 0) {
        timeoutId = setTimeout(() => {
          setText(currentWord.substring(0, indexCharacter - 1));
          setCharacterIndex((prev) => prev - 1);
        }, speedDeleting);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setIndexCurrentWord((prev) => (prev + 1) % words.length);
        }, timePause / 2);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [
    indexCharacter,
    isDeleting,
    indexCurrentWord,
    words,
    speedTyping,
    speedDeleting,
    timePause,
  ]);

  return text;
}
