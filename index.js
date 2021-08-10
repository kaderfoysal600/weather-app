// requirement , design , code

// object -property method
const storage = {
    city:'',
    country:'',
    saveItem(){
        localStorage.setItem('weatherApp-city', this.city)
        localStorage.setItem('weatherApp-country', this.country)
    },
    getItem(){
        this.city = localStorage.getItem('weatherApp-city')
        this.country = localStorage.getItem('weatherApp-country')
    }
}

const weatherData = {
    city: '',
    country: '',
    API_KEY: '93bf166805908f9deb7d074ef93daa15',
    async getWeather() {
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`)
        const data = await res.json()
        
        return data
        }catch(err){

        }

        
    }
}
const ui = {
    loadSelector() {
        const cityElm = document.querySelector('#city')
        const cityInfoElm = document.querySelector('#w-city')
        const iconElm = document.querySelector('#w-icon')
        const temperatureElm = document.querySelector('#w-temp')
        const pressureElm = document.querySelector('#w-pressure')
        const humidityElm = document.querySelector('#w-humidity')
        const feelElm = document.querySelector('#w-feel')
        const formElm = document.querySelector('#form')
        const countryElm = document.querySelector('#country')
        const messageElm = document.querySelector('#messageWrapper')

        return {
            cityInfoElm,
            cityElm,
            countryElm,
            iconElm,
            temperatureElm,
            pressureElm,
            feelElm,
            humidityElm,
            formElm,
            messageElm
        }
    },

    showMessage(msg) {
        const { messageElm } = this.loadSelector()
        const elm = `<div class = 'alert alert-danger id='message'>${msg}</div>`
        messageElm.insertAdjacentHTML('afterBegin', elm)
        this.hideMessage()
    },
    hideMessage() {
        const messageElm = document.querySelector('#message')
        setTimeout(() => {
            if (messageElm) {
                messageElm.remove()
            }
        }, 2000)
    },

    validateInput(city, country) {
        if (country === '' || city === '') {
            this.showMessage('please enter  validate input ')
            return false
        } else {
            return true
        }
    },
    getInputValues() {
        const { cityElm, countryElm } = this.loadSelector()
        const country = countryElm.value
        const city = cityElm.value
        const isValid = this.validateInput(city, country)
        if (isValid) {
            //send the api request with necessary data
            weatherData.city = city
            weatherData.country = country
            //set to local storage
            storage.city = city
            storage.country = country
            //save to localStorage
            storage.saveItem()

        }
    },
    getIcon(iconCode) {
        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
      },
    printWeather(weatherData) {
        const { main, weather, name:cityName } = weatherData
        const { cityInfoElm, temperatureElm, pressureElm, humidityElm, feelElm, iconElm } = this.loadSelector()
        cityInfoElm.textContent = cityName
        temperatureElm.textContent = `Temperature: ${main.temp}°C`
        pressureElm.textContent = `Pressure: ${main.pressure}Kpa`
        humidityElm.textContent = `Humidity ${main.humidity}`
        feelElm.textContent = weather[0].description
        iconElm.setAttribute('src', this.getIcon(weather[0].icon))

    },
    resetInputValues(){
const {cityElm, countryElm} = this.loadSelector()
        cityElm.value =  '',
        countryElm.value = ''

    },
    init() {
        const { formElm } = this.loadSelector()
        formElm.addEventListener('submit', async e => {
            e.preventDefault()
            this.getInputValues()
            //reset input vales
            this.resetInputValues()
            const data = await weatherData.getWeather()
            if(data.cod === "404"){
                ui.showMessage(data.message)
            }else{
                const { main, weather, name } = data
                ui.printWeather(data)
            }
           

        })
        window.addEventListener('DOMContentLoaded', async ()=>{
            storage.getItem()
            const city = storage.city
            const country = storage.country
            weatherData.city = city ? city : 'Pabna'
            weatherData.country = country? country : 'BD'

            //send api request
            const data = await weatherData.getWeather()
           
            //set in ui 
            if(data.cod === "404"){
                ui.showMessage(data.message)
            }else{
                const { main, weather, name } = data
                ui.printWeather(data)
            }
        })
    }

}
ui.init()

