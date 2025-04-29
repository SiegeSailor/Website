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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        timeoutId = setTimeout(() => {
          setText(currentWord.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, speedTyping);
      } else {
        timeoutId = setTimeout(() => setIsDeleting(true), timePause);
      }
    } else {
      if (charIndex > 0) {
        timeoutId = setTimeout(() => {
          setText(currentWord.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, speedDeleting);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }, timePause / 2);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [
    charIndex,
    isDeleting,
    currentWordIndex,
    words,
    speedTyping,
    speedDeleting,
    timePause,
  ]);

  return text;
}
