import React, { useState } from 'react'

export default function Weather() {
    const [weatherData, setweatherData] = useState(data)
    console.log(weatherData.map(item => {
        return {"published": item['published'], "temperature": item['air-temperature']}
    }))
    return(
        <>
            <CardRow />
        </>
    );
}

const CardRow = () => {
    const tempData = {"title": 55, "high": 80, "low": 20, "unit": String.fromCharCode(176)};
    const windData = {"title": 1.5, "high": 100, "direction": windDir(202.20), "unit": "mph"};
    const precipData = {"title": 1.3, "last_hour": .2, "unit": "in"}
    return (
        <div className="row row-cols-1 row-cols-md-3 mb-3">
            <Card title="Temperature" data={tempData}/>
            <Card title="Wind" data={windData}/>
            <Card title="Precipitation" data={precipData}/>
        </div>
    );
}

const Card = ({title, data}) => {
    const cardTitle = <h1 className="card-title pricing-card-title">{data['title']}{data['unit']}</h1>;

    let cardContent = null;
    switch (title){
        case "Temperature":
            cardContent = <ul className="list-unstyled mt-3 mb-4">
                            <li>High: {data["high"]}{data['unit']}</li>
                            <li>Low: {data["low"]}{data['unit']}</li>
                        </ul>;
            break;
        case "Wind":
            cardContent = <ul className="list-unstyled mt-3 mb-4">
                            <li>High: {data["high"]}{data['unit']}</li>
                        </ul>;
            break;
        case "Precipitation":
            cardContent = <ul className="list-unstyled mt-3 mb-4">
                            <li>Last Hour: {data["last_hour"]}{data['unit']}</li>
                        </ul>;
            break;
    }

    return (
    <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header py-3">
            <h4 className="my-0 fw-normal">{title}</h4>
            </div>
            <div className="card-body">
                {cardTitle}
                {cardContent}
            </div>
        </div>
    </div>
    )
}

const windDir = (direction) => {
    return direction
}

const data = [
    {
      "published": 1703367150,
      "humidity": 40.5431,
      "air-temperature": 76.006,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367210,
      "humidity": 40.948531,
      "air-temperature": 76.082006,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367270,
      "humidity": 41.35801631,
      "air-temperature": 76.15808801,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367330,
      "humidity": 41.77159647,
      "air-temperature": 76.23424609,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367390,
      "humidity": 42.18931244,
      "air-temperature": 76.31048034,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367450,
      "humidity": 42.61120556,
      "air-temperature": 76.38679082,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367510,
      "humidity": 43.03731762,
      "air-temperature": 76.46317761,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367570,
      "humidity": 43.46769079,
      "air-temperature": 76.53964079,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367630,
      "humidity": 43.9023677,
      "air-temperature": 76.61618043,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367690,
      "humidity": 44.34139138,
      "air-temperature": 76.69279661,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367750,
      "humidity": 44.78480529,
      "air-temperature": 76.76948941,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 202.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367810,
      "humidity": 45.23265335,
      "air-temperature": 76.8462589,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367870,
      "humidity": 45.68497988,
      "air-temperature": 76.92310516,
      "atmospheric-pressure": 50673.6,
      "wind-speed": 0,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367930,
      "humidity": 46.14182968,
      "air-temperature": 77.00002826,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 0,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703367990,
      "humidity": 46.60324797,
      "air-temperature": 76.92302823,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 0,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703368050,
      "humidity": 47.06928045,
      "air-temperature": 76.8461052,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 0,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703368110,
      "humidity": 47.53997326,
      "air-temperature": 76.7692591,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 1,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368170,
      "humidity": 48.01537299,
      "air-temperature": 76.69248984,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 2,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368230,
      "humidity": 48.49552672,
      "air-temperature": 76.61579735,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 3,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368290,
      "humidity": 48.98048199,
      "air-temperature": 76.53918155,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 4,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368350,
      "humidity": 49.47028681,
      "air-temperature": 76.46264237,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 5,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368410,
      "humidity": 49.96498968,
      "air-temperature": 76.38617973,
      "atmospheric-pressure": 50673.1,
      "wind-speed": 6,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368470,
      "humidity": 50.46463957,
      "air-temperature": 76.30979355,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 7,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368530,
      "humidity": 50.96928597,
      "air-temperature": 76.23348375,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368590,
      "humidity": 51.47897883,
      "air-temperature": 76.15725027,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.022
    },
    {
      "published": 1703368650,
      "humidity": 50.96418904,
      "air-temperature": 76.08109302,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368710,
      "humidity": 50.45454715,
      "air-temperature": 76.00501193,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368770,
      "humidity": 49.95000168,
      "air-temperature": 76.08101694,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368830,
      "humidity": 49.45050166,
      "air-temperature": 76.15709796,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368890,
      "humidity": 48.95599665,
      "air-temperature": 76.23325505,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703368950,
      "humidity": 48.46643668,
      "air-temperature": 76.30948831,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703369010,
      "humidity": 47.98177231,
      "air-temperature": 76.3857978,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 8,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0.011
    },
    {
      "published": 1703369070,
      "humidity": 47.50195459,
      "air-temperature": 76.4621836,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 7,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369130,
      "humidity": 47.02693504,
      "air-temperature": 76.53864578,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 4,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369190,
      "humidity": 46.55666569,
      "air-temperature": 76.61518443,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 2,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369250,
      "humidity": 46.09109904,
      "air-temperature": 76.69179961,
      "atmospheric-pressure": 50671.1,
      "wind-speed": 1,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369310,
      "humidity": 45.63018805,
      "air-temperature": 76.76849141,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 1,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369370,
      "humidity": 45.17388616,
      "air-temperature": 76.8452599,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 1,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369430,
      "humidity": 44.7221473,
      "air-temperature": 76.92210516,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 1,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369490,
      "humidity": 44.27492583,
      "air-temperature": 76.99902727,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 1,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369550,
      "humidity": 43.83217657,
      "air-temperature": 77.07602629,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 1,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369610,
      "humidity": 43.39385481,
      "air-temperature": 77.15310232,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369670,
      "humidity": 42.95991626,
      "air-temperature": 77.23025542,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369730,
      "humidity": 42.5303171,
      "air-temperature": 77.30748568,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369790,
      "humidity": 42.10501392,
      "air-temperature": 77.38479316,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369850,
      "humidity": 41.68396379,
      "air-temperature": 77.46217796,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369910,
      "humidity": 41.26712415,
      "air-temperature": 77.53964013,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703369970,
      "humidity": 40.85445291,
      "air-temperature": 77.61717977,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370030,
      "humidity": 40.44590838,
      "air-temperature": 77.69479695,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370090,
      "humidity": 40.04144929,
      "air-temperature": 77.77249175,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370150,
      "humidity": 39.6410348,
      "air-temperature": 77.85026424,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370210,
      "humidity": 39.24462445,
      "air-temperature": 77.92811451,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370270,
      "humidity": 38.85217821,
      "air-temperature": 78.00604262,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370330,
      "humidity": 38.46365643,
      "air-temperature": 78.08404866,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370390,
      "humidity": 38.07901986,
      "air-temperature": 78.16213271,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370450,
      "humidity": 37.69822966,
      "air-temperature": 78.24029485,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370510,
      "humidity": 37.32124737,
      "air-temperature": 78.31853514,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370570,
      "humidity": 36.94803489,
      "air-temperature": 78.39685368,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 10,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370630,
      "humidity": 36.57855454,
      "air-temperature": 78.47525053,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 1,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    },
    {
      "published": 1703370690,
      "humidity": 36.212769,
      "air-temperature": 78.55372578,
      "atmospheric-pressure": 50670.1,
      "wind-speed": 5,
      "wind-direction": 205.254,
      "soil-temperature": 129.475,
      "soil-moisture": 0.75,
      "rainfall": 0
    }
   ]