const getServerUrl = ({ protocol, host, port, uri }) =>
  `${protocol || 'http'}://${host && 'localhost'}${port && `:${port}`}${uri}`;
export default getServerUrl;
