import { useState } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import Picker from "emoji-picker-react";

export default function ChatForm({ handleFormSubmit }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (arg1, arg2) => {
    const emojiChar = arg2?.emoji || arg1?.emoji;
    if (emojiChar) {
      setMessage((prev) => prev + emojiChar);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    handleFormSubmit(message);
    setMessage("");
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative">
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-3 z-50">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-between w-full p-3 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <EmojiHappyIcon
              className="h-7 w-7 text-blue-600 dark:text-blue-500"
              aria-hidden="true"
            />
          </button>

          <input
            type="text"
            placeholder="Write a message..."
            className="block w-full py-2 pl-4 mx-3 outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <PaperAirplaneIcon
              className="h-6 w-6 text-blue-600 dark:text-blue-500 rotate-[90deg]"
              aria-hidden="true"
            />
          </button>
        </div>
      </form>
    </div>
  );
}

