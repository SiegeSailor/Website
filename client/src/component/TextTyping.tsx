"use client";

import { useEffect, useState } from "react";

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
  const [indexCurrentWord, setIndexCurrentWord] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [indexCharacter, setCharacterIndex] = useState(0);

  useEffect(() => {
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
