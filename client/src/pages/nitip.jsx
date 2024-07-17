<div className="flex items-center justify-center mt-10">
        <div className="bg-slate-400 p-4 rounded-lg border">
          <div className="grid grid-cols-3 gap-4">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => makeMove(index)}
                className="w-20 h-20 text-4xl font-bold bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                {cell}
              </button>
            ))}
          </div>
        </div>

        {gameOver && (
          <div>
            <div>{result}</div>
            <button
              onClick={resetGame}
              className="mt-4 p-2 bg-blue-500 text-white rounded-md"
            >
              Reset Game
            </button>
          </div>
        )}
      </div>