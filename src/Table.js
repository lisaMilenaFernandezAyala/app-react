import React, { Component } from "react";
import { Fetch } from 'react-request';
import { API } from "./Common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let countries;

class Table extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    const nodes = Array.from(event.target.childNodes);
    let filters =  {name: '', code: '', continent: ''};

    nodes.map(item => {
      if(item.attributes.type.value === 'text' && item.value) filters[item.name] = item.value;
    })
    this.setState(filters);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h2>Table</h2>
        <form className="filters" onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Name" />
          <input type="text" name="code" placeholder="Code" />
          <input type="text" name="continent" placeholder="Continent" />
          <input type="submit" value="Submit" />
        </form>

        <Fetch url={API.table}
          headers={{
            'Authorization': API.authorization,
          }}>
        {({ failed, data }) => {
          if (failed)
            return <div>The request did not succeed.</div>;
 
          if (data) {
            console.log(this.state)
            if(this.state && (this.state.name.length || this.state.code.length || this.state.continent.length))
              countries = data.country.filter(country => (
                (!this.state.name.length || country.name.toLowerCase().indexOf(this.state.name.toLowerCase()) > -1) &&
                (!this.state.code.length || country.country_code.toLowerCase().indexOf(this.state.code.toLowerCase()) > -1) &&
                (!this.state.continent.length || country.continent.toLowerCase().indexOf(this.state.continent.toLowerCase()) > -1)
              ))
            else
              countries = data.country;
            
            return (
              <div>
                <h3>{data.message}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Flag</th>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Contienent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map((country, key) => (
                      <tr key={key}>
                        <td><img src={country.flag_url} alt={country.name}/></td>
                        <td>{country.name}</td>
                        <td>{country.country_code}</td>
                        <td>{country.continent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
 
export default Table;