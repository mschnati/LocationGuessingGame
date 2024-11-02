import React, { useState } from 'react';
import LocationGame from './components/game/LocationGame';
import { Sun, Moon } from 'lucide-react'; // Import icons for sun and moon

document.documentElement.classList.add('dark'); // Set dark mode by default

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode); // Add or remove dark class
  };

  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none fixed top-4 right-4 z-10"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-800" />
        )}
      </button>

      <div className="container mx-auto flex justify-center">
        <LocationGame />
      </div>
    </div>
  );
}

export default App;
