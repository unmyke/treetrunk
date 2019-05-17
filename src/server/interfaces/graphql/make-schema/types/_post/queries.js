export default `
  type Query {
    sellers(
      pageSize: Int
      after: String
    ): [Seller!]!

    seller(id: ID!): Seller!
  }
`;
