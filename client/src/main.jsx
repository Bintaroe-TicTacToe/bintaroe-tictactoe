import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import TicTacToe from './TicTacToe';

const router = createBrowserRouter([
    {
        path: "/",
        element: <TicTacToe />
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />
)
