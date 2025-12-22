import { useState } from "react";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md shadow-sm mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
      >
        <span>{title}</span>
        <span>{isOpen ? "|" : ">"}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-2 bg-white border-t">
          {children}
        </div>
      )}
    </div>
  );
};

// Example usage
export default function Practice() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <Accordion title="What is React?">
        React is a JavaScript library for building user interfaces.
      </Accordion>
      <Accordion title="What is Tailwind CSS?">
        Tailwind CSS is a utility-first CSS framework for rapid UI development.
      </Accordion>
      <Accordion title="Why use an accordion?">
        Accordions help organize content and improve UX by hiding unnecessary details.
      </Accordion>
    </div>
  );
}
