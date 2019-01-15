import React, { Component } from "react";
import { Fetch } from 'react-request';
import { API } from "./Common";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const style = {
  width: '80%',
  maxWidth: '500px',
  height: '350px',
  margin: '5px auto'
};
 
export class Media extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  handleSubmit(event) {
    let state = Array.from(event.target.childNodes).reduce((result, item) => {
      if(item.attributes.type && item.attributes.type.value === 'text' && item.value) result = { iata: item.value };
      return result;
    }, null);
    
    this.setState(state);
    event.preventDefault();
  }

  onMarkerClick(props, marker) {
    this.setState({
      activeMarker: (!this.state.activeMarker ? marker : null),
    });
  }

  render() {
    const google = this.props.google;

    return (
      <div className="media">
        <h2>Media</h2>

        <form onSubmit={this.handleSubmit}>
          <label className="m-r-20">IATA Code:</label>
          <input className="m-r-20" type="text" name="code" placeholder="Code" autoComplete="off" />
          <input type="submit" value="Submit" />
        </form>
        
        { this.state && this.state.iata ? (
        <Fetch url={API.media.replace('{iata}', this.state.iata)}
          method="GET"
          cacheResponse
          headers={{
            'Authorization': API.authorization,
          }}>
          {({ failed, data }) => {
            if (failed)
              return <div className="error">The request did not succeed.</div>;
   
            if (data) {
              const airport = data.airport_list[0],
              center = {
                lat: airport.latitude,
                lng: airport.longitude
              };

              return (
                <div>
                  <h3>{(data.airport_list.length === 1 ? airport.airport_name : data.message)}</h3>
                  <p><span>Type:</span> {airport.airport_type}</p>
                  <p><span>Lat / Lon:</span> {airport.latitude} / {airport.longitude}</p>
                  <p><span>Wikipedia:</span> <a href={airport.wikipedia}>Link</a></p>
                  <p><span>Location:</span> {airport.location} (<abbr>{airport.local_code}</abbr>)</p>
                  <p><span>Region:</span> {airport.Region.name} (<abbr>{airport.Region.region_code}</abbr>)</p>
                  <p><span>Country:</span> {airport.Country.name} (<abbr>{airport.Country.country_code}</abbr>)</p>

                  <h3>Location map</h3>
                  <Map google={google}
                    style={style}
                    initialCenter={center}
                    zoom={11}
                    className="map">
                      <Marker onClick={this.onMarkerClick} />
                      <InfoWindow marker={this.state.activeMarker}
                        visible={!!this.state.activeMarker}>
                        <p>{airport.airport_name}</p>
                      </InfoWindow>
                    </Map>

                  <h3>Region videos</h3>
                  {<Fetch url={API.youtube.replace('{query}', airport.Region.name.replace(/\s/g, "+"))}
                    method="GET"
                    cacheResponse>
                    {({ failed, data }) => {
                      if (failed)
                        return <div>The request did not succeed.</div>;
            
                      if (data) {
                        return (<ul>{
                          data.items.map((item, key) => (
                            <li key={key} id={item.id.videoId}>
                              <h4 onClick={() => this.setState({ iata: this.state.iata, video: item.id.videoId })}>
                                {item.snippet.title}
                              </h4>
                              <p>{item.snippet.description}</p>
                              <p>{item.snippet.publishedAt}</p>
                            </li>
                          ))
                        }</ul>);
                      }
                    }}
                  </Fetch>}

                  {this.state.video ? <iframe frameBorder="0" scrolling="no" type="text/html" 
                  src={`https://www.youtube.com/embed/${this.state.video}?start=0`}></iframe>
                  : <p className="message">Select a video</p>}
                </div>
              );
            }

            return <div>Loading data...</div>;
          }}
          </Fetch>
        ) : <p>Fill IATA code *</p>}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyA-FsYcvfXBa7a3gBlWq5pqXHorV9neKBo",
  v: "3"
})(Media);