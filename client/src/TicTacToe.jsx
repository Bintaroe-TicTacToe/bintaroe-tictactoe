import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
    withCredentials: true,
});


function TicTacToe() {
    const [board, setBoard] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const [result, setResult] = useState(null)

    useEffect(() => {

        socket.on('gameState', (game) => {
            setBoard(game.board);
            setGameOver(game.gameOver)
            setResult(game.result)
        });
    }, []);

    function makeMove(index) {
        if(!gameOver){
            socket.emit('makeMove', index)

        }
    }

    function resetGame(){
        socket.emit('resetGame')
    }



    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-white">

            <div className="bg-white p-8 rounded-lg ">
                <div className="grid grid-cols-3 gap-4 mb-6">
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
               {gameOver && (
                <div>
                    <div>{result}</div>
                    <button onClick={resetGame} className='mt-4 p-2 bg-blue-500 text-white rounded-md'>
                        Reset Game
                    </button>
                </div>
               )}
            </div>
        </div>

    )
}

export default TicTacToe