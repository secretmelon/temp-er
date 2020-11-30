import React, { useState, useEffect } from 'react';

import {fetchWeather} from './api/fetchWeather';
import './App.css'

const App = () => {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [gif, setGif] = useState('');
    const [desc, setDesc] = useState('');

    const search = async (e) => {
        if(e.key === 'Enter'){
            const data = await fetchWeather(query)
            setWeather(data);
            setQuery('');
            getGif(data);
            getDesc(data);
        }
    }


    useEffect(() => {
        if (gif) {
            const container = document.querySelector(".main-container")
            container.style.backgroundImage = `url(${gif})`;
        }
    }, [gif])

    async function getGif(data){
        try{
            const API_KEY = 'knQTvFoOegije3rg120nn19uFAsS7tz4';
            const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
            const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${data.weather[0].description}`);
            console.log(data);
            const {data: gifs} = await resJson.json();
            const gifCount = gifs.length;
            const randomIdx = Math.floor(Math.random() * gifCount)
            const gifUrl = gifs[randomIdx].images.downsized.url;
            setGif(gifUrl)
          } catch (error) {
            console.warn(error);
          }
    }

    async function getDesc(data){
        try{
            const weatherType = data.weather[0].description
            const sentence = [
                "Expect some " + weatherType + " today!", 
                "Seems like you've got " + weatherType + " coming your way...",
                "Forecast is showing "+ weatherType + " for today!",
                "Get ready for " + weatherType + "!",
            ];
            const sentenceLength = sentence.length
            const randNum = Math.floor(Math.random() * sentenceLength);
            const weatherDesc = sentence[randNum] 
            setDesc(weatherDesc)
        }
        catch (error){
            console.warn(error);
        }
    }

    return (
        <div className="main-container" >
            <input type="text" className="search" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={search} />
            {weather.main && (
                <div className="city">
                    <h2 className="city-name">
                        <span>{weather.name}</span>
                        <sup>{weather.sys.country}</sup>
                    </h2>
                    <div className="city-temp">
                        {Math.round(weather.main.temp)}
                        <sup>&deg;C</sup>
                    </div>
                    <div className="info">
                        <img className="city-icon" src={"https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png"} alt={weather.weather[0].description}/>
                        <h3>{desc}</h3>
                    </div>
                </div>
            )}
        </div>
    );
}
export default App;