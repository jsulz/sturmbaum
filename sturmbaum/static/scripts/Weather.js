import React, { useState, useEffect } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";

export default function Weather(props) {
  const [weatherData, setweatherData] = useState(null);
  useEffect(() => {
    fetch("/sensor-data")
      .then((response) => response.json())
      .then((json) => setweatherData(json));
  }, []);

  if (weatherData != null && weatherData.length > 0) {
    let transformedWeatherData = weatherData.map((row) => {
      return {
        ...row,
        published: dateStr(row["published"]),
        winddirection: windDir(row["winddirection"]),
        pressure: convertPressure(row["pressure"]),
      };
    });

    const temperatureData = spliceData(transformedWeatherData, ["airtemp"]);
    const windData = spliceData(transformedWeatherData, [
      "windspeed",
      "winddirection",
    ]);
    const humidityData = spliceData(transformedWeatherData, ["humidity"]);
    const precipData = spliceData(transformedWeatherData, ["rainfall"]);
    const soilData = spliceData(transformedWeatherData, [
      "soilmoisture",
      "soiltemp",
    ]);
    const pressureData = spliceData(transformedWeatherData, ["pressure"]);

    const currentRow =
      transformedWeatherData[transformedWeatherData.length - 1];

    const batteryData = {
      batteryCharge: currentRow["batterycharge"],
      chargeRemaining: 100.0 - currentRow["batterycharge"],
    };

    const tempCardData = {
      title: currentRow["airtemp"].toFixed(2),
      high: getHigh(temperatureData, "airtemp").toFixed(2),
      low: getLow(temperatureData, "airtemp").toFixed(2),
      unit: String.fromCharCode(176) + "F",
    };

    const windCardData = {
      title: [currentRow["windspeed"].toFixed(2), currentRow["winddirection"]],
      high: getHigh(windData, "windspeed").toFixed(2),
      unit: "mph",
    };

    const precipCardData = {
      title: getTotal(precipData, "rainfall").toFixed(2),
      last_hour: getHourTotal(precipData, "rainfall").toFixed(2),
      unit: "in",
    };

    const soilMoistureCardData = {
      title: currentRow["soilmoisture"],
      high: getHigh(soilData, "soilmoisture").toFixed(3),
      low: getLow(soilData, "soilmoisture").toFixed(3),
      unit: null,
    };

    const soilTempCardData = {
      title: currentRow["soiltemp"],
      high: getHigh(soilData, "soiltemp").toFixed(3),
      low: getLow(soilData, "soiltemp").toFixed(3),
      unit: String.fromCharCode(176) + "F",
    };

    const cardData = {
      tempCardData: tempCardData,
      windCardData: windCardData,
      precipCardData: precipCardData,
      soilMoistureCardData: soilMoistureCardData,
      soilTempCardData: soilTempCardData,
      batteryData: batteryData,
    };

    const chartsData = {
      temperatureData: temperatureData,
      windData: windData,
      humidityData: humidityData,
      precipData: precipData,
      soilData: soilData,
      pressureData: pressureData,
    };
    return (
      <>
        <CardRow allCardData={cardData} />
        <Charts data={chartsData} />
      </>
    );
  } else {
    const divStyle = {
      width: "3rem",
      height: "3rem",
      textAlign: "center",
    };
    document
      .getElementById("charts")
      .setAttribute("style", "text-align:center");
    return (
      <>
        <div
          class="spinner-border text-secondary"
          style={divStyle}
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </>
    );
  }
}

const CardRow = ({ allCardData }) => {
  return (
    <div className="row row-cols-1 row-cols-md-3 mb-3">
      <Card
        title="Current Temperature"
        data={allCardData["tempCardData"]}
        type="temp"
      />
      <Card
        title="Current Wind Speed/Direction"
        data={allCardData["windCardData"]}
        type="wind"
      />
      <Card
        title="Today's Precipitation"
        data={allCardData["precipCardData"]}
        type="precip"
      />
      <Card
        title="Current Soil Moisture"
        data={allCardData["soilMoistureCardData"]}
        type="soilmoisture"
      />
      <Card
        title="Current Soil Temp"
        data={allCardData["soilTempCardData"]}
        type="soiltemp"
      />
      <Card
        title="Battery Charge"
        data={allCardData["batteryData"]}
        type="battery"
      />
    </div>
  );
};

const Card = ({ title, data, type }) => {
  let cardTitle = (
    <h1 className="card-title pricing-card-title">
      {data["title"]}
      {data["unit"]}
    </h1>
  );

  let cardContent = null;
  switch (type) {
    case "battery":
      cardTitle = <GaugeChart batteryData={data} />;
      cardContent = null;
      break;
    case "temp":
      cardContent = (
        <ul className="list-unstyled mt-3 mb-4">
          <li>
            High: {data["high"]}
            {data["unit"]}
          </li>
          <li>
            Low: {data["low"]}
            {data["unit"]}
          </li>
        </ul>
      );
      break;
    case "wind":
      cardContent = (
        <ul className="list-unstyled mt-3 mb-4">
          <li>
            High: {data["high"]}
            {data["unit"]} {data["direction"]}
          </li>
        </ul>
      );
      cardTitle = (
        <h2 className="card-title pricing-card-title">
          {data["title"][0]} {data["unit"]} {data["title"][1]}
        </h2>
      );
      break;
    case "precip":
      cardContent = (
        <ul className="list-unstyled mt-3 mb-4">
          <li>
            Last Hour: {data["last_hour"]}
            {data["unit"]}
          </li>
        </ul>
      );
      break;
    case "soilmoisture":
      cardContent = (
        <ul className="list-unstyled mt-3 mb-4">
          <li>
            High: {data["high"]}
            {data["unit"]}
          </li>
          <li>
            Low: {data["low"]}
            {data["unit"]}
          </li>
        </ul>
      );
      break;
    case "soiltemp":
      cardContent = (
        <ul className="list-unstyled mt-3 mb-4">
          <li>
            High: {data["high"]}
            {data["unit"]}
          </li>
          <li>
            Low: {data["low"]}
            {data["unit"]}
          </li>
        </ul>
      );
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
};

const Charts = ({ data }) => {
  return (
    <>
      <Chart
        title="Temperature"
        chartData={data["temperatureData"]}
        stat="airtemp"
      />
      <Chart
        title="Humidity"
        chartData={data["humidityData"]}
        stat="humidity"
      />
      <Chart title="Rain" chartData={data["precipData"]} stat="rainfall" />
      <Chart
        title="Wind"
        chartData={data["windData"]}
        stat="windspeed"
        customtooltip={true}
      />
      <Chart
        title="Pressure"
        chartData={data["pressureData"]}
        stat="pressure"
      />
      <MultiLineChart
        title="Soil"
        chartData={data["soilData"]}
        stats={["soilmoisture", "soiltemp"]}
      />
    </>
  );
};

const Chart = ({ title, chartData, stat, customtooltip = false }) => {
  return (
    <>
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey={stat} stroke="#8884d8" />
          <CartesianGrid strokeDasharray="3 3" />
          {customtooltip ? (
            <Tooltip
              content={CustomToolTip}
              wrapperStyle={{
                backgroundColor: "white",
                border: "1px solid grey",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            />
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
};

const MultiLineChart = ({ title, chartData, stats }) => {
  return (
    <>
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            yAxisId="left"
            dataKey={stats[0]}
            stroke="#8884d8"
          />
          <Line
            type="monotone"
            yAxisId="right"
            dataKey={stats[1]}
            stroke="#82ca9d"
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <XAxis dataKey="published" />
          <YAxis yAxisId="left" dataKey={stats[0]} />
          <YAxis yAxisId="right" orientation="right" dataKey={stats[1]} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const GaugeChart = ({ batteryData }) => {
  const data = [
    { value: batteryData["batteryCharge"] },
    { value: batteryData["chargeRemaining"] },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          startAngle={180}
          endAngle={0}
          innerRadius="55%"
          data={data}
          dataKey="value"
          blendStroke
          isAnimationActive={false}
        >
          <Cell fill="#000" />
          <Cell fill="#eaeaea" />
          <Label position="center" style={{ fontSize: "120%" }}>
            {data[0].value + "%"}
          </Label>
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

/* Utilities */

const getHigh = (data, property) => {
  const propArr = data.map((row) => {
    return row[property];
  });

  return Math.max(...propArr);
};

const getLow = (data, property) => {
  const propArr = data.map((row) => {
    return row[property];
  });

  return Math.min(...propArr);
};

const getHourTotal = (data, property) => {
  const hourSlice = data.slice(data.length - 61, data.length);
  const initialVal = 0;
  const sumData = hourSlice.reduce(
    (accumulator, currentValue) => accumulator + currentValue[property],
    initialVal
  );

  return sumData;
};

const getTotal = (data, property) => {
  const initialVal = 0;
  const sumData = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue[property],
    initialVal
  );

  return sumData;
};

const CustomToolTip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p>{payload[0]["payload"]["published"]}</p>
        <p>windspeed: {payload[0]["payload"]["windspeed"]}</p>
        <p>winddirection: {payload[0]["payload"]["winddirection"]}</p>
      </div>
    );
  }
};

const windDir = (direction) => {
  let strDir = "";
  if (direction > 158 && direction < 202) {
    strDir = "N";
  }
  if (direction > 202 && direction < 247) {
    strDir = "NE";
  }
  if (direction > 247 && direction < 292) {
    strDir = "E";
  }
  if (direction > 292 && direction < 337) {
    strDir = "SE";
  }
  if (direction > 337 || direction < 22) {
    strDir = "S";
  }
  if (direction > 22 && direction < 67) {
    strDir = "SW";
  }
  if (direction > 67 && direction < 112) {
    strDir = "W";
  }
  if (direction > 112 && direction < 158) {
    strDir = "NW";
  }
  return strDir;
};

const dateStr = (epoch) => {
  const date = new Date(epoch * 1000);
  const hour = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hour + ":" + minutes;
};

const convertPressure = (hPa) => {
  return (hPa / 3386.389).toFixed(3);
};

const spliceData = (data, properties) => {
  const finalData = data.map((row) => {
    let newRow = { published: row["published"] };
    properties.forEach((property) => {
      newRow[property] = row[property];
    });
    return newRow;
  });
  return finalData;
};
