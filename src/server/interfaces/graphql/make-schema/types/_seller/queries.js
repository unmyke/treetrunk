export default `
  type Query {
    getSellers: [Seller!]!
    getSeller(id: ID!): Seller!
  }
`;
