'use client';

import { useState, useEffect } from 'react';

const TypingEffect = ({ words }: { words: string[] }) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[wordIndex];
      const shouldDelete = isDeleting;

      setText(
        shouldDelete
          ? currentWord.substring(0, text.length - 1)
          : currentWord.substring(0, text.length + 1)
      );

      if (!shouldDelete && text === currentWord) {
        setTypingSpeed(2000); // Pause at end
        setIsDeleting(true);
      } else if (shouldDelete && text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        setTypingSpeed(500);
      } else {
        setTypingSpeed(shouldDelete ? 100 : 150);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed]);

  return (
    <span className="text-secondary-400 font-mono font-bold">
      {text}
      <span className="animate-pulse ml-1">|</span>
    </span>
  );
};

export default TypingEffect;
