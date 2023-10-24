import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import './App.css';

const App = () => {
  const [interval, setInterval] = useState('1d');
  const [devise, setDevise] = useState('^FCHI');
  const [deviseName, setDeviseName] = useState('');
  const [chartData, setChartData] = useState([]);
  const [todayInTimestamp, setTodayInTimestamp] = useState(Math.floor(Date.now() / 1000));

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `/v8/finance/chart/${devise}?period1=1633381200&period2=${todayInTimestamp}&interval=${interval}&events=history&crumb=5YTX%2FgVGBmg&corsDomain=finance.yahoo.com&.tsrc=finance`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        },
      );

      const chartData = [['Timestamp', 'a', 'b', 'c', 'd']];
      const timestamps = res.data.chart.result[0]['timestamp'];
      const values = res.data.chart.result[0]['indicators']['quote'][0];

      timestamps.forEach((element, index) => {
        const date = new Date(element * 1000); // Unix time in ms
        const prettyDate = date.toDateString();
        chartData.push([prettyDate, values['high'][index], values['open'][index], values['close'][index], values['low'][index]]);
      });

      setChartData(chartData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTodayInTimestamp(Math.floor(Date.now() / 1000));
    setDevise('^FCHI');
    setDeviseName('CAC 40');
    fetchData();
  }, [interval, todayInTimestamp]);

  const options = {
    legend: 'none',
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: '#f00' },
      risingColor: { strokeWidth: 0, fill: '#0f0' },
      width: 0.5,
    },
    chartArea: { width: '80%', height: '80%' },
  };

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  const handleDeviseChange = (devise, deviseName) => (e) => {
    setDevise(devise);
    setDeviseName(deviseName);
    fetchData()
  }

  return (
    <div className="container">
      <h1>Graphique boursier du 4 Octobre 2021 à aujourd'hui</h1>
      <h2>{deviseName} ({devise})</h2>

      <div className="row">
        <button onClick={handleDeviseChange("^FCHI", "CAC40")}>CAC40</button>
        <button onClick={handleDeviseChange("CA.PA", "Carrefour")}>Carrefour</button>
        <button onClick={handleDeviseChange("AIR.PA", "Airbus")}>Airbus</button>
        <button onClick={handleDeviseChange("BN.PA", "Danone")}>Danone</button>
        <button onClick={handleDeviseChange("BNP.PA", "BNP")}>BNP</button>
        <button onClick={handleDeviseChange("ACA.PA", "Crédit Agricole")}>Crédit Agricole</button>
        <button onClick={handleDeviseChange("ENGI.PA", "Engie")}>Engie</button>
        <button onClick={handleDeviseChange("KER.PA", "Kering")}>Kering</button>
        <button onClick={handleDeviseChange("MC.PA", "LVMH")}>LVMH</button>
        <button onClick={handleDeviseChange("OR.PA", "L'Oréal")}>L'Oréal</button>
        <button onClick={handleDeviseChange("ORA.PA", "Orange")}>Orange</button>
        <button onClick={handleDeviseChange("RI.PA", "Pernod Ricard")}>Pernod Ricard</button>
        <button onClick={handleDeviseChange("SAN.PA", "Sanofi")}>Sanofi</button>
        <button onClick={handleDeviseChange("SU.PA", "Schneider Electric")}>Schneider Electric</button>
        <button onClick={handleDeviseChange("GLE.PA", "Société Générale")}>S.G</button>
        <button onClick={handleDeviseChange("SW.PA", "Sodexo")}>Sodexo</button>
        <button onClick={handleDeviseChange("FP.PA", "Total Energies")}>Total</button>
      </div>

      <div>
        <label htmlFor="interval">Choisir un intervalle: </label>
        <select id="interval" value={interval} onChange={handleIntervalChange}>
          <option value="1d">1 jour</option>
          <option value="1wk">1 semaine</option>
          <option value="1mo">1 mois</option>
        </select>

      </div>
      <Chart
        chartType="CandlestickChart"
        width="100%"
        height="500px"
        data={chartData}
        options={options}
      />

      <h1>Dernières infos via flux RSS</h1>
      <div className="row">

        <div className="col">
          <h2>Selon `Le Figaro</h2>
          <div id="rss-feed">
          </div>
        </div>
      </div>


    </div>
  );
};

export default App;