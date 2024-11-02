import React, { useState, useRef } from 'react';

const COLORS = [
  '#FF6B6B', '#1ABC9C', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#45B7D1'
];

const LocationGame = () => {
  const [targetPoint, setTargetPoint] = useState(null);
  const [players, setPlayers] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [gameMode, setGameMode] = useState('setup');
  const [imageUrl, setImageUrl] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [pendingGuess, setPendingGuess] = useState(null);
  const imageRef = useRef(null);

  const calculateDistance = (point1, point2) => {
    const xDiff = point1.x - point2.x;
    const yDiff = point1.y - point2.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (gameMode === 'setup') {
      setTargetPoint({ x, y });
    } else if (gameMode === 'playing' && currentPlayer) {
      setPendingGuess({ x, y });
    }
  };

  const confirmGuess = () => {
    if (pendingGuess && currentPlayer) {
      const distance = calculateDistance(pendingGuess, targetPoint);
      const newGuess = {
        ...pendingGuess,
        distance,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        color: currentPlayer.color
      };
      setGuesses([...guesses, newGuess]);
      setCurrentPlayer(null);
      setPendingGuess(null);
    }
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < COLORS.length) {
      const newPlayer = {
        id: Date.now(),
        name: newPlayerName.trim(),
        color: COLORS[players.length]
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (playerId) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const getTop3Guesses = () => {
    return [...guesses]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  const renderDistanceLine = (start, end, color) => {
    const distance = Math.round(calculateDistance(start, end));
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full">
          <line
            x1={`${start.x}%`}
            y1={`${start.y}%`}
            x2={`${end.x}%`}
            y2={`${end.y}%`}
            stroke={color}
            strokeWidth="2"
            strokeDasharray="4"
            opacity="0.6"
          />
        </svg>
        <div 
          className="absolute bg-white px-1 rounded text-xs transform -translate-x-1/2 -translate-y-1/2 shadow-sm"
          style={{ 
            left: `${midX}%`, 
            top: `${midY}%`,
            color: color
          }}
        >
          {distance} units
        </div>
      </div>
    );
  };

  const renderMarker = (point, color = 'red', label = '') => (
    <div className="absolute -translate-x-2 -translate-y-2" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
      <div 
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label && (
        <div 
          className="absolute mt-1 text-xs font-semibold px-1 rounded bg-white shadow-sm whitespace-nowrap"
          style={{ color }}
        >
          {label}
        </div>
      )}
    </div>
  );

  const canStartGame = players.length >= 2 && targetPoint && imageUrl;

  const remainingPlayers = players.filter(player => 
    !guesses.some(guess => guess.playerId === player.id)
  );

  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Location Guessing Game</h2>
      </div>
      <div className="space-y-4">
        {gameMode === 'setup' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="px-3 py-2 border rounded max-w-xs"
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
                <button 
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim() || players.length >= COLORS.length}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Add Player
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {players.map(player => (
                  <div 
                    key={player.id}
                    className="flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${player.color}20`, color: player.color }}
                  >
                    <span className="font-medium">{player.name}</span>
                    <button
                      className="w-4 h-4 flex items-center justify-center hover:opacity-80"
                      onClick={() => removePlayer(player.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-slate-500"
            />
            
            {imageUrl && !targetPoint && (
              <p className="text-sm text-slate-500">Click on the image to set the target location</p>
            )}
            
            {targetPoint && (
              <button 
                onClick={() => setGameMode('playing')}
                disabled={!canStartGame}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {!canStartGame ? 'Need at least 2 players' : 'Start Game'}
              </button>
            )}
          </div>
        )}

        {imageUrl && (
          <div className="relative inline-block">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Game map"
              className="max-w-full h-auto"
              onClick={handleImageClick}
            />
            {targetPoint && gameMode === 'setup' && renderMarker(targetPoint)}
            {gameMode === 'playing' && pendingGuess && 
              renderMarker(pendingGuess, currentPlayer.color)
            }
            {gameMode === 'results' && (
              <>
                {guesses.map((guess) => 
                  renderDistanceLine(guess, targetPoint, guess.color)
                )}
                {renderMarker(targetPoint, 'red', 'Target')}
                {guesses.map((guess) => 
                  renderMarker(guess, guess.color, guess.playerName)
                )}
              </>
            )}
          </div>
        )}

        {gameMode === 'playing' && (
          <div className="space-y-4">
            {!currentPlayer ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-500">
                  Players remaining: {remainingPlayers.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {remainingPlayers.map(player => (
                    <button
                      key={player.id}
                      onClick={() => setCurrentPlayer(player)}
                      style={{ 
                        backgroundColor: player.color,
                        color: 'white'
                      }}
                      className="px-4 py-2 rounded hover:opacity-90"
                    >
                      {player.name}'s turn
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium" style={{ color: currentPlayer.color }}>
                  {currentPlayer.name}, click on the map to place your marker
                </p>
                {pendingGuess && (
                  <button 
                    onClick={confirmGuess}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Confirm Guess
                  </button>
                )}
              </div>
            )}
            
            {guesses.length === players.length && (
              <button 
                onClick={() => setGameMode('results')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reveal Results
              </button>
            )}
          </div>
        )}

        {gameMode === 'results' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Final Rankings</h3>
            <div className="space-y-2">
              {getTop3Guesses().map((guess, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className={
                    index === 0 ? "text-yellow-500" :
                    index === 1 ? "text-gray-400" :
                    "text-amber-600"
                  }>
                    🏅
                  </span>
                  <span style={{ color: guess.color }} className="font-medium">
                    {guess.playerName}
                  </span>
                  <span>{Math.round(guess.distance)} units away</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                setGameMode('setup');
                setTargetPoint(null);
                setGuesses([]);
                setImageUrl(null);
                setPlayers([]);
                setCurrentPlayer(null);
                setPendingGuess(null);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationGame;
