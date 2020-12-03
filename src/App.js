import React, { useState, useEffect } from 'react';

import {fetchWeather} from './api/fetchWeather';
import './App.css'

const App = () => {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [gif, setGif] = useState('');
    const [mainGif, setMainGif] = useState('');
    const [desc, setDesc] = useState('');
    const [homePageSet, setHomePageBool] = useState(false);
    const [surprised, setSurprise] = useState(false);

    // Only set up the landing page gif once
    if(!homePageSet){
        getMainGifArray();
        setHomePageBool(true);
    }
    
    useEffect(() => {
        if(mainGif && homePageSet){
            const container = document.querySelector(".main-container");
            container.style.backgroundImage = `url(${mainGif})`;
        }
    }, [mainGif, homePageSet])


    const search = async (e) => {
        if(e.key === 'Enter'){
            const data = await fetchWeather(query)
            setWeather(data);
            setQuery('');
            getWeatherGif(data);
            getDesc(data);
        }
    }



    useEffect(() => {
        if (gif) {
            const welcomeContainer = document.querySelector(".main-header");
            welcomeContainer.style.display='none';
            const surpriseMe = document.querySelector(".surprise");
            surpriseMe.style.display='none';
            const tryAnother = document.querySelector(".back");
            tryAnother.style.display='flex';
            const container = document.querySelector(".main-container");
            container.style.backgroundImage = `url(${gif})`;
        }
    }, [gif])

    
    // Retrieves a gif from Giphy API that corresponds with the weather description
    async function getWeatherGif(data){
        try{
            const API_KEY = 'knQTvFoOegije3rg120nn19uFAsS7tz4';
            const BASE_URL = 'https://api.giphy.com/v1/gifs/search';
            const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${data.weather[0].description}`);
            console.log(data);
            const {data: gifs} = await resJson.json();
            const gifCount = gifs.length;
            const randomIdx = Math.floor(Math.random() * gifCount);
            const gifUrl = gifs[randomIdx].images.downsized.url;
            setGif(gifUrl)
          } catch (error) {
            console.warn(error);
          }
    }

    // Searches for random gif with term 'Weather' for landing page
    async function getMainGif(){
        try{
            const API_KEY = 'knQTvFoOegije3rg120nn19uFAsS7tz4';
            const BASE_URL = 'https://api.giphy.com/v1/gifs/search';
            const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=weather`);
            const {data: gifs} = await resJson.json();
            const gifCount = gifs.length;
            const randomIdx = Math.floor(Math.random() * gifCount);
            const gifUrl = gifs[randomIdx].images.downsized.url;
            // setMainGif(gifUrl);
          } catch (error) {
            console.warn(error);
          }
    }

    // Picks a random gif from an array of pre-selected gifs for landing page
    async function getMainGifArray(){
        try{
            const gifArray = [
                'https://media.giphy.com/media/5W5TOAKuoZfa0/giphy.gif',
                'https://media.giphy.com/media/MS0az8du4jir6/giphy.gif',
                'https://media.giphy.com/media/xUPGcdhiQf2vbfDCyk/giphy.gif',
                'https://media.giphy.com/media/qB6q1LG042M4o/giphy.gif',
                'https://media.giphy.com/media/3o7TKGsK4gcsly0rW8/giphy.gif',
                'https://media.giphy.com/media/yGs66ASVCCPQc/giphy.gif',
                'https://media.giphy.com/media/BvQflwM7aDXva/giphy.gif',
                'https://media.giphy.com/media/3D2EHbKSPAReFx7GGn/giphy.gif',
                'https://media.giphy.com/media/l1Joik8YDBqnuiaqs/giphy.gif',
                'https://media.giphy.com/media/xUPGcChZRE8p2djeiQ/giphy.gif',
                'https://media.giphy.com/media/za5xikuRr0OzK/giphy.gif',
                'https://media.giphy.com/media/26DN4DJqhltqNpT9K/giphy.gif',
                'https://media.giphy.com/media/LGY967AFmrueY/giphy.gif'

                ]
            const randNum = Math.floor(Math.random() * gifArray.length);
            const gifUrl = gifArray[randNum];
            setMainGif(gifUrl);
        }
        catch (error){
            console.warn(error);
        }
    }

    // Picks a random sentence with the weather description 
    async function getDesc(data){
        try{
            const weatherType = data.weather[0].description
            const sentence = [
                "Expect some " + weatherType + " today!", 
                "Seems like you've got " + weatherType + " coming your way...",
                "Forecast is showing "+ weatherType + " for today!",
                "Get ready for " + weatherType + "!",
            ];
            const sentenceLength = sentence.length;
            const randNum = Math.floor(Math.random() * sentenceLength);
            const weatherDesc = sentence[randNum];
            setDesc(weatherDesc);
        }
        catch (error){
            console.warn(error);
        }
    }

    return (
        <div className="main-container">
            <div className="main-header">
                <h2>welcome to temp-er!</h2>
                <h3>what's the weather like in...</h3>
                <input type="text" className="search" placeholder="wellington, nz" spellCheck={true} value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={search} />
            </div>
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
            <div className="surprise">
                <a href="https://giphy.com/gifs/arielle-m-coming-soon-3o72FkiKGMGauydfyg/fullscreen" target="_parent">
                    surprise me!
                </a>
            </div>
            <div className="back">
                <a href="default.asp" target="_parent">
                    try another?
                </a>
            </div>
            
        </div>
    );
}
export default App;