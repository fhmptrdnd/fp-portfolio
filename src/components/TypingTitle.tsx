
import {
  useEffect,
  useRef,
  useState,
} from "react";

const defaultWords = [
  "Surface",
  "Vision",
  "Motion",
  "Stories",
  "Ideas",
];

export default function TypingTitle() {
  const [words, setWords] = useState(defaultWords);
  const [wordIndex, setWordIndex] = useState(0);

  const [displayText, setDisplayText] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [customWord, setCustomWord] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[wordIndex] ?? "Surface";

  useEffect(() => {
    if (editing) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayText === currentWord) {
      timeout = setTimeout(() => {
        setDeleting(true);
      }, 1800);
    } else if (deleting && displayText === "") {
      timeout = setTimeout(() => {
        setDeleting(false);

        setWordIndex(
          (prev) => (prev + 1) % words.length
        );
      }, 200);
    } else {
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          deleting
            ? prev.slice(0, -1)
            : currentWord.slice(0, prev.length + 1)
        );
      }, deleting ? 45 : 90);
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    deleting,
    currentWord,
    words.length,
    editing,
  ]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEditing = () => {
    setCustomWord(displayText || currentWord);
    setEditing(true);
  };

  const applyCustomWord = () => {
    const value = customWord.trim();

    if (!value) {
      setEditing(false);
      return;
    }

    setWords((prev) => {
      const next = [...prev];

      next.push(value);

      return next;
    });

    setWordIndex(words.length);

    setDisplayText(value);
    setDeleting(false);

    setEditing(false);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  return (
    <div className="typing-title">
      <h1>
        Beyond
        <br />

        The{" "}

        {editing ? (
          <input
            ref={inputRef}
            className="typing-inline-input"
            value={customWord}
            onChange={(event) =>
              setCustomWord(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applyCustomWord();
              }

              if (event.key === "Escape") {
                cancelEditing();
              }
            }}
            onBlur={applyCustomWord}
            maxLength={24}
            aria-label="Edit title word"
          />
        ) : (
          <button
            type="button"
            className="typing-word"
            onClick={startEditing}
            title="Click to customize this word"
          >
            {displayText}

            <span className="typing-cursor">
              |
            </span>
          </button>
        )}

        <span className="title-period">.</span>
      </h1>

      {/* <p className="typing-hint">
        CLICK THE WORD TO CUSTOMIZE
      </p> */}
    </div>
  );
}
