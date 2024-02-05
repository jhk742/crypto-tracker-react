import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import debounce from '../helpers/debounce'
//https://davidwalsh.name/javascript-debounce-function ->  limits the rate at which a function can fire
import '../styles/Home.css'

//https://www.youtube.com/watch?v=0sY4fUi5dMM

//https://www.coingecko.com/api/documentation

export default function Home() {

    const [coins, setCoins] = useState([])
    const [trending, setTrending] = useState([])
    const [prices, setPrices] = useState(true)
    const [query, setQuery] = useState("")

    useEffect(() => {
        //for initial mount. Fetches trending coins
        (async () => {
            try {
                const res = await axios.get('https://api.coingecko.com/api/v3/search/trending')
                const data = res.data.coins.map(coin => {
                    return {
                        id: coin.item.id,
                        name: coin.item.name,
                        image: coin.item.large,
                        priceBtc: coin.item.price_btc,
                        price: coin.item.data.price,
                        price_change_percentage_24h: coin.item.data.price_change_percentage_24h
                    }
                })
                setCoins(data)
                setTrending(data)
            } catch (err) {
                console.error("Error fetrching data:", err)
            }
        })()
    }, [])

    useEffect(() => {
        //handles query changes
        (async () => {
            try {
                if (query.length > 2) {
                    const res = await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`)
                    const coins = res.data.coins.map(coin => {
                        return {
                            id: coin.id,
                            name: coin.name,
                            image: coin.large,
                            symbol: coin.symbol,
                        }
                    })
                    setCoins(coins)
                    setPrices(false)
                } else {
                    setCoins(trending)
                    setPrices(true)
                }
            } catch (err) {
                console.error("NAH FAM", err)
            }
        })()
    }, [query])

    const handleQuery = debounce((e) => {
        const {value} = e.target
        setQuery(value)
    }, 500)

    return (
        <div className="Home">
            <header>
                <h1>Coins!</h1>
            </header>
            <div className="coin--search">
                <h2>Search for a coin</h2>
                <input type="text" placeholder="Type your coin..." onChange={handleQuery}></input>
            </div>
            <div className="coin--container">
                <h2>Trending coins</h2>
                {coins.map(coin => {
                    return (
                        <Link to={`/${coin.id}`} className="coin" key={coin.id}>
                            <div className="coin--desc">
                                <img src={coin.image}></img>
                                <span>{coin.name}</span>
                            </div>
                            {prices && (
                                <div className="coin--prices">
                                    <span>{coin.priceBtc}</span>
                                    <span>({coin.price} USD)</span>
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    ) 
}
