import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Upload, MapPin, Users, Trophy, ArrowRight, X } from 'lucide-react';

const COLORS = [
  '#f00606', '#14b311', '#1911b3', '#9e1c82', '#c96212',
  '#b59624', '#9B59B6', '#3498DB', '#E67E22', '#45B7D1'
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
  const [question, setQuestion] = useState([]);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const calculateDistance = (point1, point2) => {
    const xDiff = point1.x - point2.x;
    const yDiff = point1.y - point2.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
    handleImageUpload(e);
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
          className="absolute bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs transform -translate-x-1/2 -translate-y-1/2 shadow-md"
          style={{ left: `${midX}%`, top: `${midY}%`, color }}
        >
          {distance} units
        </div>
      </div>
    );
  };

  const renderMarker = (point, color = 'red', label = '') => (
    <div 
      className="absolute -translate-x-3 -translate-y-3 group"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
      <div className="relative">
        <MapPin
          size={24}
          style={{ color }}
          className="animate-bounce-slow"
        />
        {label && (
          <div 
            className="absolute mt-1 text-xs font-medium px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-md whitespace-nowrap transform -translate-x-1/2 left-1/2"
            style={{ color }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );

  const canStartGame = players.length >= 2 && targetPoint && imageUrl && question.trim();

  const remainingPlayers = players.filter(player => 
    !guesses.some(guess => guess.playerId === player.id)
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Location Guessing Game
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gameMode === 'setup' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="max-w-xs"
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
                <Button
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim() || players.length >= COLORS.length}
                  className="gap-2"
                >
                  <Users size={16} />
                  Add Player
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {players.map(player => (
                  <Badge
                    key={player.id}
                    variant="outline"
                    className="px-3 py-1.5 gap-2"
                    style={{ 
                      backgroundColor: `${player.color}15`,
                      borderColor: player.color,
                      color: player.color
                    }}
                  >
                    {player.name}
                    <button
                      className="hover:opacity-80"
                      onClick={() => removePlayer(player.id)}
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block">
                <div className="mb-2 text-sm font-medium">Game Question</div>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the question for players (e.g., 'Where is...?')"
                  className="resize-none"
                  rows={2}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block">
                <div className="mb-2 text-sm font-medium">Upload Game Map</div>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Drop an image here or click to upload
                      </div>
                    </div>
                  </label>
                </div>
              </label>
            </div>
            
            {imageUrl && !targetPoint && (
              <div className="text-sm text-red-800 animate-pulse">
                Click on the image to set the target location
              </div>
            )}
            
            {targetPoint && (
              <Button
                onClick={() => setGameMode('playing')}
                disabled={!canStartGame}
                variant={canStartGame ? "default" : "secondary"}
                className="w-full gap-2"
              >
                {!canStartGame ? (
                  <>Need at least 2 players and a question</>
                ) : (
                  <>Start Game <ArrowRight size={16} /></>
                )}
              </Button>
            )}
          </div>
        )}

        {imageUrl && (
          <div className="relative inline-block w-full rounded-lg overflow-hidden shadow-lg">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Game map"
              className="w-full h-auto"
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
            <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
              <div className="text-lg font-medium mb-2">Question:</div>
              <div className="text-gray-700 dark:text-gray-300">{question}</div>
            </div>

            {!currentPlayer ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Players remaining: {remainingPlayers.length}
                </div>
                <div className="flex flex-wrap gap-2">
                  {remainingPlayers.map(player => (
                    <Button
                      key={player.id}
                      onClick={() => setCurrentPlayer(player)}
                      style={{ 
                        backgroundColor: player.color,
                        color: 'white'
                      }}
                      className="gap-2 hover:opacity-90"
                    >
                      <Users size={16} />
                      {player.name}'s turn
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className="text-sm font-medium animate-pulse"
                  style={{ color: currentPlayer.color }}
                >
                  {currentPlayer.name}, click on the map to place your marker
                </div>
                {pendingGuess && (
                  <Button 
                    onClick={confirmGuess}
                    className="w-full gap-2"
                  >
                    <MapPin size={16} />
                    Confirm Guess
                  </Button>
                )}
              </div>
            )}
            
            {guesses.length === players.length && (
              <Button 
                onClick={() => setGameMode('results')}
                variant="secondary"
                className="w-full gap-2"
              >
                <Trophy size={16} />
                Reveal Results
              </Button>
            )}
          </div>
        )}

        {gameMode === 'results' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                <div className="text-lg font-medium mb-2">Question:</div>
                <div className="text-gray-700 dark:text-gray-300">{question}</div>
              </div>

              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Final Rankings
              </h3>
              <div className="space-y-3">
                {getTop3Guesses().map((guess, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: `${guess.color}10` }}
                  >
                    <div className="text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: guess.color }}>
                        {guess.playerName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round(guess.distance)} units away
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => {
                setGameMode('setup');
                setTargetPoint(null);
                setGuesses([]);
                setImageUrl(null);
                setPlayers([]);
                setCurrentPlayer(null);
                setPendingGuess(null);
              }}
              className="w-full gap-2"
            >
              <MapPin size={16} />
              New Game
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationGame;