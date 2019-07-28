const getServerUrl = ({ protocol, host, port, path }) =>
  `${protocol || 'http'}://${host && 'localhost'}${port && `:${port}`}${path ||
    ''}`;
export default getServerUrl;
