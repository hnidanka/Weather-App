import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './WeatherApp.css'
import './WeatherAppMedia.css'
import search_icon from '../Assets/search.png'
import clear_icon from '../Assets/clear.png'
import cloud_icon from '../Assets/cloud.png'
import drizzle_icon from '../Assets/drizzle.png'
import rain_icon from '../Assets/rain.png'
import snow_icon from '../Assets/snow.png'
import wind_icon from '../Assets/wind.png'
import humidity_icon from '../Assets/humidity.png'
import rain_background from '../Assets/raining.mp4'
import storm_background from '../Assets/storm.mp4'
import foggy_background from '../Assets/foggy.mp4'
import sunny_background from '../Assets/bluesky.mp4'
import cloudy_background from '../Assets/cloudy.mp4'
import drizzle_background from '../Assets/drizzle.mp4'
import snow_background from '../Assets/snowing.mp4'
import default_background from '../Assets/default.mp4'
import location_icon from '../Assets/location.png'

const WeatherApp = () => {
  const api_key = process.env.REACT_APP_API_Weather_KEY
  const [wBackground, setWBackground] = useState(default_background)
  const [wIcon, setWIcon] = useState(clear_icon)
  const [errorMessage, setErrorMessage] = useState(null);
  let [res, setRes] = useState(null);

  useEffect(() => {
    search()
    const videoElement = document.querySelector('.background-video');
    videoElement.src = wBackground;
  }, [wBackground]);

  useEffect(()=>{
    if(errorMessage != null){
      toast.error(errorMessage)
      setErrorMessage(null);
    }
  },[errorMessage])
  const element = document.getElementsByClassName("cityInput")
  
    const search = async () => {  
      if(element[0].value===""){
        //setErrorMessage('Please enter Location');
        return;
      }
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`
      let res = await fetch(url)
      setRes(res)
      handleRes(res)
    }
    
    const handleRes = async (res)=>{
      if (!res.ok) {
        console.log("Location not found. Please enter a valid location");
        setErrorMessage("Location not found. Please enter a valid location")
        setWBackground(default_background)
        return;
      }
      let data =  await res.json()
      if(element[0].value === ""){
        element[0].value =data.name
      }
      setWeatherData(data)
    }
    const setWeatherData=(data)=>{
      const humidity = document.getElementsByClassName('humidity-percent')
      const wind = document.getElementsByClassName('wind-rate')
      const temperature = document.getElementsByClassName('weather-temp')
      const location = document.getElementsByClassName('weather-location')
      const description = document.getElementsByClassName('weather-description')
      const min = document.getElementsByClassName('weather-min')
      const max = document.getElementsByClassName('weather-max')
      const sunrise = document.getElementsByClassName('sunrise');
      const sunset = document.getElementsByClassName('sunset');

      if (humidity.length > 0 && wind.length > 0 && temperature.length > 0 && location.length > 0 && description.length >0 && min.length > 0 && max.length > 0 &&sunrise.length > 0 &&
        sunset.length > 0) {
        humidity[0].innerHTML = data.main.humidity+'%';
        wind[0].innerHTML= data.wind.speed+'km/h';
        temperature[0].innerHTML = Math.floor(data.main.temp)+'°C';
        location[0].innerHTML = data.name;
        description[0].innerHTML = data.weather[0].main
        min[0].innerHTML = 'min: ' + Math.floor(data.main.temp_min) +'°C'
        max[0].innerHTML = 'max: ' + Math.floor(data.main.temp_max) + '°C'
        const timeZoneOffset = data.timezone * 1000;
        sunrise[0].innerHTML = ` ${new Date(
          (data.sys.sunrise * 1000) + timeZoneOffset
        ).toLocaleTimeString()}`;
    
        sunset[0].innerHTML = ` ${new Date(
          (data.sys.sunset * 1000) + timeZoneOffset
        ).toLocaleTimeString()}`;
        setErrorMessage(null);
        //console.log(min, max)
      } else {
        console.error("Elements not found!");
      }
      
      if(data.weather[0].icon==='01d' || data.weather[0].icon==='01n'){
        setWIcon(clear_icon)
        setWBackground(sunny_background)
      }else if(data.weather[0].icon==='02d' || data.weather[0].icon==='02n'){
        setWIcon(cloud_icon)
        setWBackground(cloudy_background)
      }else if(data.weather[0].icon==='03d' ||  data.weather[0].icon==='03n'){
        setWIcon(drizzle_icon)
        setWBackground(drizzle_background)
      }else if(data.weather[0].icon==='04d' ||  data.weather[0].icon==='04n'){
        setWIcon(cloud_icon)
        setWBackground(cloudy_background)
      }else if(data.weather[0].icon==='09d' ||  data.weather[0].icon==='09n'){
        setWIcon(rain_icon)
        setWBackground(rain_background)
      }else if(data.weather[0].icon==='10d' ||  data.weather[0].icon==='10n'){
        setWIcon(rain_icon)
        setWBackground(rain_background)
      }else if(data.weather[0].icon==='13d' || data.weather[0].icon==='13n'){
        setWIcon(snow_icon)
        setWBackground(snow_background)
      }else{
        setWIcon(clear_icon)
        setWBackground(sunny_background)
      }
    }

    const setWeatherByUserLocation = async()=>{
      if(!navigator.geolocation){
        setErrorMessage("Geolocation is not supported by your browser")
        return
      }
      navigator.geolocation.getCurrentPosition(async (position)=>{
        const {latitude, longitude} = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=Metric&appid=${api_key}`;
        const res = await fetch(url);
        handleRes(res)
      })
    }

  return (
    <div id='mainContainer'>
      <div className='top-bar'>
        <input type='text' className='cityInput' placeholder='Search'></input>
      <div className='search-icon'onClick={()=>{search()}} >
      <ToastContainer />
        <img src={search_icon} alt='search'/>
      </div>
      <div className='location_icon' onClick={()=>{setWeatherByUserLocation()}}>
        <img src={location_icon} alt="location" className='loc_ic'/>
      </div>
      </div>

    {(!res?.ok || element.length == 0 || element[0].value === "") ? (
      <div className='default-background'>
        <video className="background-video" autoPlay muted loop >
          <source src={wBackground} type="video/mp4"/>
          </video>
        <div className='default-container'>
      <h1>Welcome to our weather app!</h1>
      <p> Stay updated with the latest weather forecasts to be prepared for every day</p>
      </div>
    </div>
    ):(
      <div className="weather-container">
        <video className="background-video" autoPlay muted loop>
          <source src={wBackground} type="video/mp4"/>
          </video>
      <div className='container'>
      <div className='weather-location'>
          London
        </div>
        <div className='weather-temp'>
          24 C
        </div>
        <div className='min-max-container'>
        <div className='weather-min'>
        12
        </div>
        <div className='weather-max'>
          23
        </div>
        </div>
        <div className='weather-description'>
          sunny
        </div>
        
        <div className='weather-image'>
          <img src={wIcon} alt='cloud'/>
        </div>  
        <div className='data-container'>

        <div className='element'>
            <img src={humidity_icon} alt='' className='icon'/>
            <div className='data'>
               <div className='sunrise'>00:00</div>
               <div className='text'>Sunrise</div>

            </div>
         </div>
         <div className='element'>
            <img src={humidity_icon} alt='' className='icon'/>
            <div className='data'>
               <div className='sunset'>00:00</div>
               <div className='text'>Sunset</div>

            </div>
         </div>

          <div className='element'>
            <img src={humidity_icon} alt='' className='icon'/>
            <div className='data'>
               <div className='humidity-percent'>64%</div>
                <div className='text'>Humidity</div>
            </div>
         </div>
         <div className='element'>
            <img src={wind_icon} alt='' className='icon'/>
            <div className='data'>
               <div className='wind-rate'>18 km/h</div>
                <div className='text'>Wind</div>
            </div>
         </div>
        </div>
      </div>
      </div>
    )}
   
    </div>
  )
}

export default WeatherApp