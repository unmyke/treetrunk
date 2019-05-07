import types from '../types';
import getConnection from './get-connection';

import { default as PageInfo } from './page-info';

const { connections, edges } = Object.keys(types).reduce(
  ({ connections: prevConnections, edges: prevEdges }, typeName) => {
    const { Connection, Edge } = getConnection(typeName);

    return {
      connections: {
        ...prevConnections,
        [typeName]: Connection,
      },
      edges: [...prevEdges, Edge],
    };
  },
  { connections: {}, edges: [] }
);

const contains = [PageInfo, ...edges];

export default connections;
export { contains };
