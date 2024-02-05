import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import ShowCoin from '../pages/ShowCoin'
import '../styles/App.css'

export default function App() {

    

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/:id" element={<ShowCoin />} />
            </Routes>
        </BrowserRouter>
    )
}