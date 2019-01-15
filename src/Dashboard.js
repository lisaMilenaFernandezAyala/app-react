import React, { Component } from "react";
import { Graph } from 'react-d3-graph';
import { Fetch } from 'react-request';
import { API, DEFAULT } from "./Common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

let list, value, airportsData;
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
      color: DEFAULT.color,
      size: 150,
      highlightStrokeColor: '#777'
  },
  link: {
      highlightColor: '#777'
  }
}

class Dashboard extends Component {
  handleChange = (event) => {
    this.setState({ value: false });
    this.updateChart(event.target.value, true);
  };

  updateChart = (type, toUpdate) => {
    value = type || DEFAULT.chartType;
    list = {
      nodes: [{
        id: airportsData.country.name,
        color: DEFAULT.color,
        size: 200,
        symbolType: 'diamond'
      }],
      links: [ ],
      focusedNodeId: airportsData.country.name
    };
    airportsData.airport_list.map(airport => {
      if(airport.airport_type.indexOf(value) > -1 && airport.iata_code.length && JSON.stringify(list.nodes).indexOf(airport.iata_code) === -1){
        list.nodes.push({ id: airport.iata_code });
        list.links.push({ source: airportsData.country.name, target: airport.iata_code });
      }
    });
    
    if(toUpdate) setTimeout(() => this.setState({ value: type }));
  };
  
  onMouseOverNode = (node) => {
    window.alert(`Mouse over node ${JSON.stringify(node)}`);
  };

  render() {
    if(!cookies.get('country'))
      cookies.set('country', DEFAULT.country, { path: '/' });
    if(cookies.get('color'))
      myConfig.node.color = '#' + cookies.get('color');

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
            return <div className="error">The request did not succeed.</div>;
 
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
                  config={myConfig}
                  onClickNode={this.onClickNode} />
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