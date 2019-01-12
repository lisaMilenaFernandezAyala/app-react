import React, { Component } from "react";
import { Graph } from 'react-d3-graph';
import { Fetch } from 'react-request';
import { API } from "./Common";
import Cookies from 'universal-cookie';

let list, value, airportsData;
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
      color: '#FF4444',
      size: 150,
      highlightStrokeColor: '#FF4444'
  },
  link: {
      highlightColor: '#FF7777'
  }
};

const cookies = new Cookies();

class Dashboard extends Component {
  handleChange = (event) => {
    this.setState({ value: false });
    this.updateChart(event.target.value, true);
  };

  updateChart = (type, toUpdate) => {
    value = type || 'Large';
    list = {
      nodes: [
        { id: airportsData.country.name }
      ],
      links: [ ]
    };
    airportsData.airport_list.map(airport => {
      if(airport.airport_type.indexOf(value) > -1 && airport.iata_code.length && JSON.stringify(list.nodes).indexOf(airport.iata_code) === -1){
        list.nodes.push({ id: airport.iata_code });
        list.links.push({ source: airportsData.country.name, target: airport.iata_code });
      }
    });
    
    if(toUpdate) setTimeout(() => this.setState({ value: type }));
  };

  render() {
    if(!cookies.get('country'))
      cookies.set('country', 'ES', { path: '/' });
    
    return (
      <div>
        <h2>Dashboard</h2>

        <Fetch url={API.dashboard.replace('{country}', cookies.get('country'))}
          method="GET"
          cacheResponse
          headers={{
            'Authorization': API.authorization,
          }}>
        {({ failed, data }) => { 
          if (failed)
            return <div>The request did not succeed.</div>;
 
          if (data && (!this.state || this.state.value)) {
            if(!this.state || this.state.value !== value) {
              airportsData = data;
              this.updateChart(value);
            }
            
            return (
              <div>
                <h3>{data.country.name} ({data.country.country_code}) - {data.country.continent} ({list.links.length} airports)</h3>
                <select onChange={this.handleChange} value={value}>
                  <option key="s" value="Small">Small Airport</option>
                  <option key="m" value="Medium">Medium Airport</option>
                  <option key="l" value="Large">Large Airport</option>
                  <option key="c" value="Closed">Closed Airport</option>
                  <option key="h" value="Heliport">Heliport</option>
                </select>
                
                <Graph
                  id={value}
                  data={list}
                  config={myConfig}/>
              </div>
            );
          }
 
          return <div>Loading data...</div>;
        }}
      </Fetch>
      </div>
    );
  }
}
 
export default Dashboard;