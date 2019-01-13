const aviationdata = 'https://api.aviationdata.systems/v1';
const key = 'AIzaSyAOYG1Ai4mZy6L-ifZgQ8bzS87vA6v3JdA'
const result = 20;

let API = {
    dashboard: aviationdata + '/country/code/{country}?airport_service_type=All',
    table: aviationdata + '/country_list',
    media: aviationdata + '/airport/iata/{iata}',
    authorization: 'Basic YmQwZDljNjctMTRkYS00NmZmLTg2ODYtODhhMjFiZWU5NjU4OmQ3YzMxOGE2LWI4MzQtNDQ4Ny1hM2E5LWY5ZjBkMWM1Y2ZhNg==',
    youtube: `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet,id&order=relevance&maxResults=${result}&q={query}`
};
const DEFAULT = {
    country: 'ES',
    color: '#61dafb',
    chartType: 'Large'
};

export {
    API,
    DEFAULT
};