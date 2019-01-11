import React, { Component } from "react";
import { Graph } from 'react-d3-graph';
import { Fetch } from 'react-request';

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

class Dashboard extends Component {
  handleChange = (event) => {
    this.updateChart(event.target.value);
    this.setState({ value: event.target.value });
  };

  updateChart = (type) => {
    value = type || 'Medium';
    list = {
      nodes: [
        { id: airportsData.country.name }
      ],
      links: [ ]
    };
    airportsData.airport_list.map(airport => {
      if(airport.airport_type.indexOf(type) > -1 && airport.iata_code.length){
        list.nodes.push({ id: airport.iata_code });
        list.links.push({ source: airportsData.country.name, target: airport.iata_code });
      }
    });
  };

  render() {
    return (
      <div>
        <h2>Dashboard</h2>

        <Fetch url="https://api.aviationdata.systems/v1/country/code/ES?airport_service_type=All"
          headers={{
            'Authorization': 'Basic YmQwZDljNjctMTRkYS00NmZmLTg2ODYtODhhMjFiZWU5NjU4OmQ3YzMxOGE2LWI4MzQtNDQ4Ny1hM2E5LWY5ZjBkMWM1Y2ZhNg==',
          }}>
        {({ fetching, failed, data }) => {
          if (fetching)
            return <div>Loading data...</div>;
 
          if (failed)
            return <div>The request did not succeed.</div>;
 
          if (data) {
            if(!this.state || this.state.value != value) {
              airportsData = data;
              this.updateChart(value, data);
            }
            
            return (
              <div>
                <h3>{data.country.name} ({data.country.country_code}) - {data.country.continent}</h3>
                <select onChange={this.handleChange} value={value}>
                  <option key="s" value="Small">Small Airport</option>
                  <option key="m" value="Medium">Medium Airport</option>
                  <option key="l" value="Large">Large Airport</option>
                </select>
                
                <Graph
                  id={value}
                  data={list}
                  config={myConfig}/>
              </div>
            );
          }
 
          return null;
        }}
      </Fetch>
      </div>
    );
  }
}
 
export default Dashboard;