const aviationdata = 'https://api.aviationdata.systems/v1';

let API = {
    dashboard: aviationdata + '/country/code/{country}?airport_service_type=All',
    table: aviationdata + '/country_list',
    media: aviationdata + '/airport/iata/{iata}',
    authorization: 'Basic YmQwZDljNjctMTRkYS00NmZmLTg2ODYtODhhMjFiZWU5NjU4OmQ3YzMxOGE2LWI4MzQtNDQ4Ny1hM2E5LWY5ZjBkMWM1Y2ZhNg=='
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