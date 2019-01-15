import React, { Component } from "react";
import { Fetch } from 'react-request';
import { API } from "./Common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let countries, filters = {}, active = cookies.get('country');

class Table extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    const nodes = Array.from(event.target.childNodes);
    filters = { name: '', code: '', continent: '' };

    nodes.forEach(item => {
      if(item.attributes.type.value === 'text' && item.value) filters[item.name] = item.value;
    })
    this.setState(filters);
    event.preventDefault();
  }

  handleChange(event) {
    active = event.target.id;
    cookies.set('country', active, { path: '/' });
    filters["check"] = !filters["check"];
    this.setState(filters);
  }

  render() {
    return (
      <div>
        <h2>Table</h2>
        <form className="filters" onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Name" autoComplete="off" />
          <input type="text" name="code" placeholder="Code" autoComplete="off" />
          <input type="text" name="continent" placeholder="Continent" autoComplete="off" />
          <input type="submit" value="Submit" />
        </form>

        <Fetch url={API.table}
          method="GET"
          cacheResponse
          headers={{
            'Authorization': API.authorization,
          }}>
        {({ failed, data }) => {
          if (failed)
            return <div className="error">The request did not succeed.</div>;
 
          if (data) {
            if(this.state && ((this.state.name && this.state.name.length) ||
            (this.state.code && this.state.code.length) || (this.state.continent && this.state.continent.length)))
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
                      <th>Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map((country, key) => (
                      <tr key={key}>
                        <td><img src={country.flag_url} alt={country.name}/></td>
                        <td>{country.name}</td>
                        <td>{country.country_code}</td>
                        <td>{country.continent}</td>
                        <td>
                          <input type="checkbox" id={country.country_code} checked={country.country_code===active} onChange={this.handleChange}/>
                          </td>
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