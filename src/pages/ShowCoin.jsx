import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import '../styles/ShowCoin.css'

export default function ShowCoin() {

    const [coinData, setCoinData] = useState()
    const [graphData, setGraphData] = useState([])
    const {id} = useParams()

    useEffect(() => {
        (async () => {
            try {
                const [graphRes, dataRes] = await Promise.all([
                    axios.get(
                        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=121`
                        ),
                    axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&market_data=true`)
                ])
                
                const graphData = graphRes.data.prices.map(price => {
                    const [timeStamp, p] = price
                    const date = new Date(timeStamp).toLocaleDateString("en-us")
                    return {
                            Date: date,
                            Price: p
                          }
                })
                setGraphData(graphData)

                const data = {
                    market_cap_rank: dataRes.data.market_cap_rank,
                    high_24h: dataRes.data.market_data.high_24h,
                    low_24h: dataRes.data.market_data.low_24h,
                    circulating_supply: dataRes.data.market_data.circulating_supply.toFixed(2),
                    current_price: dataRes.data.market_data.current_price,
                    price_change_percentage_1y: dataRes.data.market_data.price_change_percentage_1y.toFixed(2),
                    name: dataRes.data.name,
                    symbol: dataRes.data.symbol,
                    image: dataRes.data.image.large
                }
                setCoinData(data)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [])

    if (!coinData) return <></>

    return (
        <div className="Showcoin">
            <header>
                <Link to="/" className="btn--back">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        >
                        <path 
                            
                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </Link>
                <img src={coinData.image}></img>
                <h1>{coinData.name} ({coinData.symbol})</h1>
            </header>
            <div className="coin--meta--info">
                <AreaChart
                    width={800}
                    height={350}
                    data={graphData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="Price" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
                <div className="coin--info">
                    <div>
                        <h3>Market Cap Rank</h3>
                        <span>{coinData.market_cap_rank}</span>
                    </div>
                    <div>
                        <h3>24H High</h3>
                        <span>${coinData.high_24h.usd}</span>
                    </div>
                    <div>
                        <h3>24H Low</h3>
                        <span>${coinData.low_24h.usd}</span>
                    </div>
                    <div>
                        <h3>Circulating Supply</h3>
                        <span>${coinData.circulating_supply}</span>
                    </div>
                    <div>
                        <h3>Current Price</h3>
                        <span>${coinData.current_price.usd}</span>
                    </div>
                    <div>
                        <h3>1Y Change</h3>
                        <span>{coinData.price_change_percentage_1y}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}