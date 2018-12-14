const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    sellers(pageSize: Int, after: String): SellerConnection!
    seller(id: ID!): Seller
    posts(pageSize: Int, after: String): PostConnection!
    post(id: ID!): Post
    seniorityTypes(pageSize: Int, after: String): SeniorityTypeConnection!
    seniorityType(id: ID!): SeniorityType
    me: User
  }

  type Mutation {
    addSeller(firstName: String, middleName: String, lastName: String, phone: String)
    updateSeller(id: ID!, firstName: String, middleName: String, lastName: String, phone: String): SellerUpdateResponse!
    deleteSeller(id: ID!): SellerUpdateResponse!
    restoreSeller(id: ID!): SellerUpdateResponse!
    addSellerAppointment(postId: ID!, day: Day!): SellerUpdateResponse!
    updateSellerAppointment(postId: ID!, day: Day!): SellerUpdateResponse!
    deleteSellerAppointment(day: Day!): SellerUpdateResponse!

    login(email: String): String # login token
  }

  type SellerUpdateResponse {
    success: Boolean!
    message: String
    seller: Seller!
  }

  type SellerConnection {
    cursor: String!
    hasMore: Boolean!
    sellers: [Seller!]!
  }

  type PostConnection {
    cursor: String!
    hasMore: Boolean!
    posts: [Post!]!
  }

  type SeniorityTypeConnection {
    cursor: String!
    hasMore: Boolean!
    seniorityTypes: [SeniorityType!]!
  }

  type Seller {
    id: ID!
    ...PersonName
    phone: String!
    post: Post
    seniorityType: SeniorityType
    seniority: Int
    recruitDay: Day
    dismissDay: Day
    deletedAt: Day
    appointments: [Appointment!]!
    state: SellerState!
    createdAt: Day!
  }

  type Appointment {
    post: Post!
    day: Day!
  }

  type Post {
    id: ID!
    name: String!
    pieceRate: Float
    pieceRates: [PieceRate!]!
    state: DeletableEntityState!
  }

  type PieceRate {
    value: Float!
    day: Day!
  }

  type SeniorityType {
    id: ID!
    name: String!
    months: Int!
    award: Float!
    awards: [Award!]!
    state: DeletableEntityState!
  }

  type Award {
    value: Float!
    day: Day!
  }

  type User {
    id: ID!
    personName: PersonName!
    email: String!
    roles: [Role!]!
  }

  type Role {
    id: ID!
    name: String!
  }

  fragment PersonName on Seller {
    firstName: String!
    middleName: String!
    lastName: String!
  }

  enum PatchSize {
    SMALL
    LARGE
  }

  enum SellerState {
    NEW
    RECRUITED
    DISMISSED
    DELETED
  }

  enum DeletableEntityState {
    ACTIVE
    DELETED
  }

  scalar Day
`;

module.exports = typeDefs;
