import React, { useState, useEffect } from 'react'
import {Line, LineChart, ReponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'

export default function Weather() {
    const [weatherData, setweatherData] = useState(WEATHERDATA)
    useEffect(() => {
      fetch('/sensor-data')
        .then(response => response.json())
        .then(json => setweatherData(json))
    }, []);

    let transformedWeatherData = weatherData.map((row) => {
        return {...row, "published": dateStr(row["published"]), "winddirection": windDir(row["winddirection"]) }
    });

    const temperatureData = spliceData(transformedWeatherData, ["airtemp"]);
    const windData = spliceData(transformedWeatherData, ["windspeed", "winddirection"]);
    const humidityData = spliceData(transformedWeatherData, ["humidity"]);
    const precipData = spliceData(transformedWeatherData, ["rainfall"]);
    const soilData = spliceData(transformedWeatherData, ["soilmoisture", "soiltemp"]);
    const pressureData = spliceData(transformedWeatherData, ["apressure"]);

    const currentRow = transformedWeatherData[transformedWeatherData.length - 1]

    const tempCardData = {
      "title": currentRow["airtemp"].toFixed(2), 
      "high": getHigh(temperatureData, "airtemp").toFixed(2), 
      "low": getLow(temperatureData, "airtemp").toFixed(2), 
      "unit": String.fromCharCode(176) + "F"
    }

    const windCardData = {
      "title": [currentRow["windspeed"].toFixed(2), currentRow['winddirection']], 
      "high": getHigh(windData, "windspeed").toFixed(2), 
      "unit": "mph"
    }

    const precipCardData = {
      "title": getTotal(precipData, "rainfall").toFixed(2),
      "last_hour": getHourTotal(precipData, "rainfall").toFixed(2),
      "unit": "in"
    }

    const soilCardData = {
      "title": [currentRow["soilmoisture"], currentRow['soiltemp']], 
      "moisture_high": getHigh(soilData, "soilmoisture").toFixed(3), 
      "temperature_high": getHigh(soilData, "soiltemp").toFixed(3), 
      "unit": String.fromCharCode(176) + "F"
    }

    const cardData = {
      "tempCardData": tempCardData,
      "windCardData": windCardData,
      "precipCardData": precipCardData,
      "soilCardData": soilCardData
    }

    const chartsData = {
      "temperatureData": temperatureData,
      "windData": windData,
      "humidityData": humidityData,
      "precipData": precipData,
      "soilData": soilData,
      "pressureData":pressureData
    }

    return(
        <>
            <CardRow allCardData={cardData} />
            <Charts data={chartsData}/>
        </>
    );
}

const CardRow = ({allCardData}) => {
    return (
        <div className="row row-cols-1 row-cols-md-4 mb-3">
            <Card title="Current Temperature" data={allCardData["tempCardData"]} type="temp"/>
            <Card title="Current Wind Speed/Direction" data={allCardData["windCardData"]} type="wind"/>
            <Card title="Today's Precipitation" data={allCardData["precipCardData"]} type="precip"/>
            <Card title="Current Soil Moisture / Temp" data={allCardData["soilCardData"]} type="soil"/>
        </div>
    );
}

const Card = ({title, data, type}) => {
    let cardTitle = <h1 className="card-title pricing-card-title">{data['title']}{data['unit']}</h1>;

    let cardContent = null;
    switch (type){
        case "temp":
            cardContent = <ul className="list-unstyled mt-3 mb-4">
                            <li>High: {data["high"]}{data['unit']}</li>
                            <li>Low: {data["low"]}{data['unit']}</li>
                        </ul>;
            break;
        case "wind":
            cardContent = <ul className="list-unstyled mt-3 mb-4">
                            <li>High: {data["high"]}{data['unit']} {data["direction"]}</li>
                        </ul>;
            cardTitle = <h2 className="card-title pricing-card-title">{data['title'][0]} {data['unit']} {data['title'][1]}</h2>;
            break;
        case "precip":
            cardContent = <ul className="list-unstyled mt-3 mb-4">
                            <li>Last Hour: {data["last_hour"]}{data['unit']}</li>
                        </ul>;
            break;
        case "soil":
            cardContent = <ul className="list-unstyled mt-3 mb-4">
                            <li>Moisture High: {data["moisture_high"]}</li>
                            <li>Temperature High: {data["temperature_high"]} {data['unit']}</li>
                        </ul>;
            cardTitle = <h2 className="card-title pricing-card-title">{data['title'][0]} / {data['title'][1]}{data['unit']}</h2>;
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
    );
}

const Charts = ({data}) => {

  return(
    <>
      <Chart title="Temperature" chartData={data["temperatureData"]} stat="airtemp"/>
      <Chart title="Humidity" chartData={data["humidityData"]} stat="humidity"/>
      <Chart title="Rain" chartData={data["precipData"]} stat="rainfall"/>
      <Chart title="Wind" chartData={data["windData"]} stat="windspeed" customtooltip={true}/>
      <Chart title="Pressure" chartData={data["pressureData"]} stat="apressure"/>
      <MultiLineChart title="Soil" chartData={data["soilData"]} stats={["soilmoisture", "soiltemp"]} />
    </>
  );
}

const Chart = ({title, chartData, stat, customtooltip=false}) => {

  return(
      <>
        <h2>{title}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <Line type="monotone" dataKey={stat} stroke="#8884d8" />
            <CartesianGrid strokeDasharray="3 3" />
            {customtooltip ? (
                <Tooltip content={CustomToolTip} 
                wrapperStyle={{ backgroundColor: "white", border: "1px solid grey", paddingLeft: "10px", paddingRight: "10px" }}/>
              ) : (
                <Tooltip />
              )}
            <Tooltip />
            <XAxis dataKey="published" />
            <YAxis />
          </LineChart>
        </ResponsiveContainer>
      </>
  );
}

const MultiLineChart = ({title, chartData, stats}) => {
  return(
    <>
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <Line type="monotone" yAxisId="left" dataKey={stats[0]} stroke="#8884d8" />
          <Line type="monotone" yAxisId="right" dataKey={stats[1]} stroke="#82ca9d" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <XAxis dataKey="published" />
          <YAxis yAxisId="left" dataKey={stats[0]} />
          <YAxis yAxisId="right" orientation="right" dataKey={stats[1]} />
        </LineChart>
      </ResponsiveContainer>
    </>
);
}

/* Utilities */

const getHigh = (data, property) => {

  const propArr = data.map(row => {
    return row[property]
  });

  return Math.max(...propArr);

}

const getLow = (data, property) => {

  const propArr = data.map(row => {
    return row[property]
  });

  return Math.min(...propArr);

}

const getHourTotal = (data, property) => {

  const hourSlice = data.slice(data.length - 61, data.length)
  const initialVal = 0
  const sumData = hourSlice.reduce(
    (accumulator, currentValue) => accumulator + currentValue[property],
    initialVal,
  );

  return sumData

}

const getTotal = (data, property) => {

  const initialVal = 0
  const sumData = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue[property],
    initialVal,
  );

  return sumData

}

const CustomToolTip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    return(
      <div className="custom-tooltip">
        <p>{payload[0]["payload"]["published"]}</p>
        <p>windspeed: {payload[0]["payload"]["windspeed"]}</p>
        <p>windspeed: {payload[0]["payload"]["winddirection"]}</p>
      </div>
    );
  }
}

const windDir = (direction) => {
  let strDir = "";
  if(direction > 158 && direction < 202){
    strDir = "N";
  }
  if(direction > 202 && direction < 247){
    strDir = "NE";
  }
  if(direction > 247 && direction < 292){
    strDir = "E";
  }
  if(direction > 292 && direction < 337){
    strDir = "SE";
  }
  if(direction > 337 && direction < 22){
    strDir = "S";
  }
  if(direction > 22 && direction < 67){
    strDir = "SW";
  }
  if(direction > 67 && direction < 112){
    strDir = "W";
  }
  if(direction > 112 && direction < 158){
    strDir = "NW";
  }
  return strDir
}

const dateStr = (epoch) => {
  const date = new Date(epoch * 1000);
  const hour = date.getHours();
  let minutes = date.getMinutes();
  if(minutes < 10){
    minutes +="0";
  }
  return hour + ":" + minutes;
}

const spliceData = (data, properties) => {
  const finalData = data.map(row => {
    let newRow = {"published": row["published"]}
    properties.forEach(property => {
      newRow[property] = row[property]
    })
    return newRow
  })
  return finalData
}

const WEATHERDATA = [
  {
    "published": 1704672000,
    "humidity": 40.5431,
    "airtemp": 76.006,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704672120,
    "humidity": 40.948531,
    "airtemp": 76.082006,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704672240,
    "humidity": 41.35801631,
    "airtemp": 76.15808801,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704672360,
    "humidity": 41.77159647,
    "airtemp": 76.23424609,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704672480,
    "humidity": 42.18931244,
    "airtemp": 76.31048034,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704672600,
    "humidity": 42.61120556,
    "airtemp": 76.38679082,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704672720,
    "humidity": 43.03731762,
    "airtemp": 76.46317761,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704672840,
    "humidity": 43.46769079,
    "airtemp": 76.53964079,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704672960,
    "humidity": 43.9023677,
    "airtemp": 76.61618043,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704673080,
    "humidity": 44.34139138,
    "airtemp": 76.69279661,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704673200,
    "humidity": 44.78480529,
    "airtemp": 76.76948941,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704673320,
    "humidity": 45.23265335,
    "airtemp": 76.8462589,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704673440,
    "humidity": 45.68497988,
    "airtemp": 76.92310516,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704673560,
    "humidity": 46.14182968,
    "airtemp": 77.00002826,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704673680,
    "humidity": 46.60324797,
    "airtemp": 76.92302823,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704673800,
    "humidity": 47.06928045,
    "airtemp": 86.8461052,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704673920,
    "humidity": 47.53997326,
    "airtemp": 76.7692591,
    "apressure": 50673.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704674040,
    "humidity": 48.01537299,
    "airtemp": 76.69248984,
    "apressure": 50673.1,
    "windspeed": 2,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704674160,
    "humidity": 48.49552672,
    "airtemp": 76.61579735,
    "apressure": 50673.1,
    "windspeed": 3,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704674280,
    "humidity": 48.98048199,
    "airtemp": 76.53918155,
    "apressure": 50673.1,
    "windspeed": 4,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704674400,
    "humidity": 49.47028681,
    "airtemp": 76.46264237,
    "apressure": 50673.1,
    "windspeed": 5,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704674520,
    "humidity": 49.96498968,
    "airtemp": 76.38617973,
    "apressure": 50673.1,
    "windspeed": 6,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704674640,
    "humidity": 50.46463957,
    "airtemp": 76.30979355,
    "apressure": 50671.1,
    "windspeed": 7,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704674760,
    "humidity": 50.96928597,
    "airtemp": 76.23348375,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704674880,
    "humidity": 51.47897883,
    "airtemp": 76.15725027,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.022
  },
  {
    "published": 1704675000,
    "humidity": 50.96418904,
    "airtemp": 76.08109302,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704675120,
    "humidity": 50.45454715,
    "airtemp": 76.00501193,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704675240,
    "humidity": 49.95000168,
    "airtemp": 76.08101694,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704675360,
    "humidity": 49.45050166,
    "airtemp": 76.15709796,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704675480,
    "humidity": 48.95599665,
    "airtemp": 76.23325505,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704675600,
    "humidity": 48.46643668,
    "airtemp": 76.30948831,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704675720,
    "humidity": 47.98177231,
    "airtemp": 76.3857978,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704675840,
    "humidity": 47.50195459,
    "airtemp": 76.4621836,
    "apressure": 50671.1,
    "windspeed": 7,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704675960,
    "humidity": 47.02693504,
    "airtemp": 76.53864578,
    "apressure": 50671.1,
    "windspeed": 4,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704676080,
    "humidity": 46.55666569,
    "airtemp": 76.61518443,
    "apressure": 50671.1,
    "windspeed": 2,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704676200,
    "humidity": 46.09109904,
    "airtemp": 76.69179961,
    "apressure": 50671.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704676320,
    "humidity": 45.63018805,
    "airtemp": 76.76849141,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704676440,
    "humidity": 45.17388616,
    "airtemp": 76.8452599,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704676560,
    "humidity": 44.7221473,
    "airtemp": 76.92210516,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704676680,
    "humidity": 44.27492583,
    "airtemp": 76.99902727,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704676800,
    "humidity": 43.83217657,
    "airtemp": 77.07602629,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704676920,
    "humidity": 43.39385481,
    "airtemp": 77.15310232,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704677040,
    "humidity": 42.95991626,
    "airtemp": 77.23025542,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704677160,
    "humidity": 42.5303171,
    "airtemp": 77.30748568,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704677280,
    "humidity": 42.10501392,
    "airtemp": 77.38479316,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704677400,
    "humidity": 41.68396379,
    "airtemp": 77.46217796,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704677520,
    "humidity": 41.26712415,
    "airtemp": 77.53964013,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704677640,
    "humidity": 40.85445291,
    "airtemp": 77.61717977,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704677760,
    "humidity": 40.44590838,
    "airtemp": 77.69479695,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704677880,
    "humidity": 40.04144929,
    "airtemp": 77.77249175,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678000,
    "humidity": 39.6410348,
    "airtemp": 77.85026424,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678120,
    "humidity": 39.24462445,
    "airtemp": 77.92811451,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678240,
    "humidity": 38.85217821,
    "airtemp": 78.00604262,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678360,
    "humidity": 38.46365643,
    "airtemp": 78.08404866,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678480,
    "humidity": 38.07901986,
    "airtemp": 78.16213271,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678600,
    "humidity": 37.69822966,
    "airtemp": 78.24029485,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678720,
    "humidity": 37.32124737,
    "airtemp": 78.31853514,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678840,
    "humidity": 36.94803489,
    "airtemp": 78.39685368,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704678960,
    "humidity": 36.57855454,
    "airtemp": 78.47525053,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704679080,
    "humidity": 36.212769,
    "airtemp": 78.55372578,
    "apressure": 50670.1,
    "windspeed": 5,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704679200,
    "humidity": 40.5431,
    "airtemp": 76.006,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704679320,
    "humidity": 40.948531,
    "airtemp": 76.082006,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704679440,
    "humidity": 41.35801631,
    "airtemp": 76.15808801,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704679560,
    "humidity": 41.77159647,
    "airtemp": 76.23424609,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704679680,
    "humidity": 42.18931244,
    "airtemp": 76.31048034,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704679800,
    "humidity": 42.61120556,
    "airtemp": 76.38679082,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704679920,
    "humidity": 43.03731762,
    "airtemp": 76.46317761,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704680040,
    "humidity": 43.46769079,
    "airtemp": 76.53964079,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704680160,
    "humidity": 43.9023677,
    "airtemp": 76.61618043,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704680280,
    "humidity": 44.34139138,
    "airtemp": 76.69279661,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704680400,
    "humidity": 44.78480529,
    "airtemp": 76.76948941,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704680520,
    "humidity": 45.23265335,
    "airtemp": 76.8462589,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704680640,
    "humidity": 45.68497988,
    "airtemp": 76.92310516,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704680760,
    "humidity": 46.14182968,
    "airtemp": 77.00002826,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704680880,
    "humidity": 46.60324797,
    "airtemp": 76.92302823,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704681000,
    "humidity": 47.06928045,
    "airtemp": 76.8461052,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704681120,
    "humidity": 47.53997326,
    "airtemp": 76.7692591,
    "apressure": 50673.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704681240,
    "humidity": 48.01537299,
    "airtemp": 76.69248984,
    "apressure": 50673.1,
    "windspeed": 2,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704681360,
    "humidity": 48.49552672,
    "airtemp": 76.61579735,
    "apressure": 50673.1,
    "windspeed": 3,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704681480,
    "humidity": 48.98048199,
    "airtemp": 76.53918155,
    "apressure": 50673.1,
    "windspeed": 4,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704681600,
    "humidity": 49.47028681,
    "airtemp": 76.46264237,
    "apressure": 50673.1,
    "windspeed": 5,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704681720,
    "humidity": 49.96498968,
    "airtemp": 76.38617973,
    "apressure": 50673.1,
    "windspeed": 6,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704681840,
    "humidity": 50.46463957,
    "airtemp": 76.30979355,
    "apressure": 50671.1,
    "windspeed": 7,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704681960,
    "humidity": 50.96928597,
    "airtemp": 76.23348375,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704682080,
    "humidity": 51.47897883,
    "airtemp": 76.15725027,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.022
  },
  {
    "published": 1704682200,
    "humidity": 50.96418904,
    "airtemp": 76.08109302,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704682320,
    "humidity": 50.45454715,
    "airtemp": 76.00501193,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704682440,
    "humidity": 49.95000168,
    "airtemp": 76.08101694,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704682560,
    "humidity": 49.45050166,
    "airtemp": 76.15709796,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704682680,
    "humidity": 48.95599665,
    "airtemp": 76.23325505,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704682800,
    "humidity": 48.46643668,
    "airtemp": 76.30948831,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704682920,
    "humidity": 47.98177231,
    "airtemp": 76.3857978,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704683040,
    "humidity": 47.50195459,
    "airtemp": 76.4621836,
    "apressure": 50671.1,
    "windspeed": 7,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704683160,
    "humidity": 47.02693504,
    "airtemp": 76.53864578,
    "apressure": 50671.1,
    "windspeed": 4,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704683280,
    "humidity": 46.55666569,
    "airtemp": 76.61518443,
    "apressure": 50671.1,
    "windspeed": 2,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704683400,
    "humidity": 46.09109904,
    "airtemp": 76.69179961,
    "apressure": 50671.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704683520,
    "humidity": 45.63018805,
    "airtemp": 76.76849141,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704683640,
    "humidity": 45.17388616,
    "airtemp": 76.8452599,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704683760,
    "humidity": 44.7221473,
    "airtemp": 76.92210516,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704683880,
    "humidity": 44.27492583,
    "airtemp": 76.99902727,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684000,
    "humidity": 43.83217657,
    "airtemp": 77.07602629,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684120,
    "humidity": 43.39385481,
    "airtemp": 77.15310232,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684240,
    "humidity": 42.95991626,
    "airtemp": 77.23025542,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684360,
    "humidity": 42.5303171,
    "airtemp": 77.30748568,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684480,
    "humidity": 42.10501392,
    "airtemp": 77.38479316,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684600,
    "humidity": 41.68396379,
    "airtemp": 77.46217796,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684720,
    "humidity": 41.26712415,
    "airtemp": 77.53964013,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684840,
    "humidity": 40.85445291,
    "airtemp": 77.61717977,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704684960,
    "humidity": 40.44590838,
    "airtemp": 77.69479695,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704685080,
    "humidity": 40.04144929,
    "airtemp": 77.77249175,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704685200,
    "humidity": 39.6410348,
    "airtemp": 77.85026424,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704685320,
    "humidity": 39.24462445,
    "airtemp": 77.92811451,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704685440,
    "humidity": 38.85217821,
    "airtemp": 78.00604262,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704685560,
    "humidity": 38.46365643,
    "airtemp": 78.08404866,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704685680,
    "humidity": 38.07901986,
    "airtemp": 78.16213271,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704685800,
    "humidity": 37.69822966,
    "airtemp": 78.24029485,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704685920,
    "humidity": 37.32124737,
    "airtemp": 78.31853514,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704686040,
    "humidity": 36.94803489,
    "airtemp": 78.39685368,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704686160,
    "humidity": 36.57855454,
    "airtemp": 78.47525053,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704686280,
    "humidity": 36.212769,
    "airtemp": 78.55372578,
    "apressure": 50670.1,
    "windspeed": 5,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704686400,
    "humidity": 40.5431,
    "airtemp": 76.006,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704686520,
    "humidity": 40.948531,
    "airtemp": 76.082006,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704686640,
    "humidity": 41.35801631,
    "airtemp": 76.15808801,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704686760,
    "humidity": 41.77159647,
    "airtemp": 76.23424609,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704686880,
    "humidity": 42.18931244,
    "airtemp": 76.31048034,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687000,
    "humidity": 42.61120556,
    "airtemp": 76.38679082,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687120,
    "humidity": 43.03731762,
    "airtemp": 76.46317761,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687240,
    "humidity": 43.46769079,
    "airtemp": 76.53964079,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687360,
    "humidity": 43.9023677,
    "airtemp": 76.61618043,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687480,
    "humidity": 44.34139138,
    "airtemp": 76.69279661,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687600,
    "humidity": 44.78480529,
    "airtemp": 76.76948941,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687720,
    "humidity": 45.23265335,
    "airtemp": 76.8462589,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687840,
    "humidity": 45.68497988,
    "airtemp": 76.92310516,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704687960,
    "humidity": 46.14182968,
    "airtemp": 77.00002826,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704688080,
    "humidity": 46.60324797,
    "airtemp": 76.92302823,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704688200,
    "humidity": 47.06928045,
    "airtemp": 76.8461052,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704688320,
    "humidity": 47.53997326,
    "airtemp": 76.7692591,
    "apressure": 50673.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704688440,
    "humidity": 48.01537299,
    "airtemp": 76.69248984,
    "apressure": 50673.1,
    "windspeed": 2,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704688560,
    "humidity": 48.49552672,
    "airtemp": 76.61579735,
    "apressure": 50673.1,
    "windspeed": 3,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704688680,
    "humidity": 48.98048199,
    "airtemp": 76.53918155,
    "apressure": 50673.1,
    "windspeed": 4,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704688800,
    "humidity": 49.47028681,
    "airtemp": 76.46264237,
    "apressure": 50673.1,
    "windspeed": 5,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704688920,
    "humidity": 49.96498968,
    "airtemp": 76.38617973,
    "apressure": 50673.1,
    "windspeed": 6,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704689040,
    "humidity": 50.46463957,
    "airtemp": 76.30979355,
    "apressure": 50671.1,
    "windspeed": 7,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704689160,
    "humidity": 50.96928597,
    "airtemp": 76.23348375,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704689280,
    "humidity": 51.47897883,
    "airtemp": 76.15725027,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.022
  },
  {
    "published": 1704689400,
    "humidity": 50.96418904,
    "airtemp": 76.08109302,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704689520,
    "humidity": 50.45454715,
    "airtemp": 76.00501193,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704689640,
    "humidity": 49.95000168,
    "airtemp": 76.08101694,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704689760,
    "humidity": 49.45050166,
    "airtemp": 76.15709796,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704689880,
    "humidity": 48.95599665,
    "airtemp": 76.23325505,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704690000,
    "humidity": 48.46643668,
    "airtemp": 76.30948831,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704690120,
    "humidity": 47.98177231,
    "airtemp": 76.3857978,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704690240,
    "humidity": 47.50195459,
    "airtemp": 76.4621836,
    "apressure": 50671.1,
    "windspeed": 7,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704690360,
    "humidity": 47.02693504,
    "airtemp": 76.53864578,
    "apressure": 50671.1,
    "windspeed": 4,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704690480,
    "humidity": 46.55666569,
    "airtemp": 76.61518443,
    "apressure": 50671.1,
    "windspeed": 2,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704690600,
    "humidity": 46.09109904,
    "airtemp": 76.69179961,
    "apressure": 50671.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704690720,
    "humidity": 45.63018805,
    "airtemp": 76.76849141,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704690840,
    "humidity": 45.17388616,
    "airtemp": 76.8452599,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704690960,
    "humidity": 44.7221473,
    "airtemp": 76.92210516,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704691080,
    "humidity": 44.27492583,
    "airtemp": 76.99902727,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704691200,
    "humidity": 43.83217657,
    "airtemp": 77.07602629,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704691320,
    "humidity": 43.39385481,
    "airtemp": 77.15310232,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704691440,
    "humidity": 42.95991626,
    "airtemp": 77.23025542,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704691560,
    "humidity": 42.5303171,
    "airtemp": 77.30748568,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704691680,
    "humidity": 42.10501392,
    "airtemp": 77.38479316,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704691800,
    "humidity": 41.68396379,
    "airtemp": 77.46217796,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704691920,
    "humidity": 41.26712415,
    "airtemp": 77.53964013,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704692040,
    "humidity": 40.85445291,
    "airtemp": 77.61717977,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704692160,
    "humidity": 40.44590838,
    "airtemp": 77.69479695,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704692280,
    "humidity": 40.04144929,
    "airtemp": 77.77249175,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704692400,
    "humidity": 39.6410348,
    "airtemp": 77.85026424,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704692520,
    "humidity": 39.24462445,
    "airtemp": 77.92811451,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704692640,
    "humidity": 38.85217821,
    "airtemp": 78.00604262,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704692760,
    "humidity": 38.46365643,
    "airtemp": 78.08404866,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704692880,
    "humidity": 38.07901986,
    "airtemp": 78.16213271,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693000,
    "humidity": 37.69822966,
    "airtemp": 78.24029485,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693120,
    "humidity": 37.32124737,
    "airtemp": 78.31853514,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693240,
    "humidity": 36.94803489,
    "airtemp": 78.39685368,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693360,
    "humidity": 36.57855454,
    "airtemp": 78.47525053,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693480,
    "humidity": 36.212769,
    "airtemp": 78.55372578,
    "apressure": 50670.1,
    "windspeed": 5,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693600,
    "humidity": 40.5431,
    "airtemp": 76.006,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693720,
    "humidity": 40.948531,
    "airtemp": 76.082006,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693840,
    "humidity": 41.35801631,
    "airtemp": 76.15808801,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704693960,
    "humidity": 41.77159647,
    "airtemp": 76.23424609,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704694080,
    "humidity": 42.18931244,
    "airtemp": 76.31048034,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704694200,
    "humidity": 42.61120556,
    "airtemp": 76.38679082,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704694320,
    "humidity": 43.03731762,
    "airtemp": 76.46317761,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704694440,
    "humidity": 43.46769079,
    "airtemp": 76.53964079,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704694560,
    "humidity": 43.9023677,
    "airtemp": 76.61618043,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704694680,
    "humidity": 44.34139138,
    "airtemp": 76.69279661,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704694800,
    "humidity": 44.78480529,
    "airtemp": 76.76948941,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 202.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704694920,
    "humidity": 45.23265335,
    "airtemp": 76.8462589,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704695040,
    "humidity": 45.68497988,
    "airtemp": 76.92310516,
    "apressure": 50673.6,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704695160,
    "humidity": 46.14182968,
    "airtemp": 77.00002826,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704695280,
    "humidity": 46.60324797,
    "airtemp": 76.92302823,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704695400,
    "humidity": 47.06928045,
    "airtemp": 76.8461052,
    "apressure": 50673.1,
    "windspeed": 0,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704695520,
    "humidity": 47.53997326,
    "airtemp": 76.7692591,
    "apressure": 50673.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704695640,
    "humidity": 48.01537299,
    "airtemp": 76.69248984,
    "apressure": 50673.1,
    "windspeed": 2,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704695760,
    "humidity": 48.49552672,
    "airtemp": 76.61579735,
    "apressure": 50673.1,
    "windspeed": 3,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704695880,
    "humidity": 48.98048199,
    "airtemp": 76.53918155,
    "apressure": 50673.1,
    "windspeed": 4,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704696000,
    "humidity": 49.47028681,
    "airtemp": 76.46264237,
    "apressure": 50673.1,
    "windspeed": 5,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704696120,
    "humidity": 49.96498968,
    "airtemp": 76.38617973,
    "apressure": 50673.1,
    "windspeed": 6,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704696240,
    "humidity": 50.46463957,
    "airtemp": 76.30979355,
    "apressure": 50671.1,
    "windspeed": 7,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704696360,
    "humidity": 50.96928597,
    "airtemp": 76.23348375,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704696480,
    "humidity": 51.47897883,
    "airtemp": 76.15725027,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.022
  },
  {
    "published": 1704696600,
    "humidity": 50.96418904,
    "airtemp": 76.08109302,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704696720,
    "humidity": 50.45454715,
    "airtemp": 76.00501193,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704696840,
    "humidity": 49.95000168,
    "airtemp": 76.08101694,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704696960,
    "humidity": 49.45050166,
    "airtemp": 76.15709796,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704697080,
    "humidity": 48.95599665,
    "airtemp": 76.23325505,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704697200,
    "humidity": 48.46643668,
    "airtemp": 76.30948831,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704697320,
    "humidity": 47.98177231,
    "airtemp": 76.3857978,
    "apressure": 50671.1,
    "windspeed": 8,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0.011
  },
  {
    "published": 1704697440,
    "humidity": 47.50195459,
    "airtemp": 76.4621836,
    "apressure": 50671.1,
    "windspeed": 7,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704697560,
    "humidity": 47.02693504,
    "airtemp": 76.53864578,
    "apressure": 50671.1,
    "windspeed": 4,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704697680,
    "humidity": 46.55666569,
    "airtemp": 76.61518443,
    "apressure": 50671.1,
    "windspeed": 2,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704697800,
    "humidity": 46.09109904,
    "airtemp": 76.69179961,
    "apressure": 50671.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704697920,
    "humidity": 45.63018805,
    "airtemp": 76.76849141,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704698040,
    "humidity": 45.17388616,
    "airtemp": 76.8452599,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704698160,
    "humidity": 44.7221473,
    "airtemp": 76.92210516,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704698280,
    "humidity": 44.27492583,
    "airtemp": 76.99902727,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704698400,
    "humidity": 43.83217657,
    "airtemp": 77.07602629,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704698520,
    "humidity": 43.39385481,
    "airtemp": 77.15310232,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704698640,
    "humidity": 42.95991626,
    "airtemp": 77.23025542,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704698760,
    "humidity": 42.5303171,
    "airtemp": 77.30748568,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704698880,
    "humidity": 42.10501392,
    "airtemp": 77.38479316,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699000,
    "humidity": 41.68396379,
    "airtemp": 77.46217796,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699120,
    "humidity": 41.26712415,
    "airtemp": 77.53964013,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699240,
    "humidity": 40.85445291,
    "airtemp": 77.61717977,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699360,
    "humidity": 40.44590838,
    "airtemp": 77.69479695,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699480,
    "humidity": 40.04144929,
    "airtemp": 77.77249175,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699600,
    "humidity": 39.6410348,
    "airtemp": 77.85026424,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699720,
    "humidity": 39.24462445,
    "airtemp": 77.92811451,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699840,
    "humidity": 38.85217821,
    "airtemp": 78.00604262,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704699960,
    "humidity": 38.46365643,
    "airtemp": 78.08404866,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704700080,
    "humidity": 38.07901986,
    "airtemp": 78.16213271,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704700200,
    "humidity": 37.69822966,
    "airtemp": 78.24029485,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704700320,
    "humidity": 37.32124737,
    "airtemp": 78.31853514,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704700440,
    "humidity": 36.94803489,
    "airtemp": 78.39685368,
    "apressure": 50670.1,
    "windspeed": 10,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704700560,
    "humidity": 36.57855454,
    "airtemp": 78.47525053,
    "apressure": 50670.1,
    "windspeed": 1,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  },
  {
    "published": 1704700680,
    "humidity": 36.212769,
    "airtemp": 78.55372578,
    "apressure": 50670.1,
    "windspeed": 5,
    "winddirection": 205.254,
    "soiltemp": 129.475,
    "soilmoisture": 0.75,
    "rainfall": 0
  }
 ];