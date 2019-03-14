const { gql } = require('apollo-server');

export default gql`
  type Query {
    sellers(
      pagination: PaginationInput!
      sort: SortInput
      search: SearchInput
      filters: [FilterInput!]
    ): SellerConnection!
    seller(id: ID!): Seller
    posts(
      pagination: PaginationInput!
      sort: SortInput
      search: SearchInput
      filters: [FilterInput!]
    ): PostConnection!
    post(id: ID!): Post
    seniorityTypes(
      pagination: PaginationInput!
      sort: SortInput
      search: SearchInput
      filters: [FilterInput!]
    ): SeniorityTypeConnection!
    seniorityType(id: ID!): SeniorityType
    me: User
  }

  input PaginationInput {
    type: PaginationTypes
    after: String
    page: Int
    pageSize: Int
  }

  input SortInput {
    field: String!
    order: SortOrder
  }

  input SearchInput {
    value: String!
    fields: [String!]
  }

  input FilterInput {
    field: String!
    values: [String!]
  }

  interface ConnectionResponse {
    cursor: String!
    hasMore: Boolean!
  }

  type SellerConnection implements ConnectionResponse {
    cursor: String!
    hasMore: Boolean!
    sellers: [Seller!]!
  }

  type PostConnection implements ConnectionResponse {
    cursor: String!
    hasMore: Boolean!
    posts: [Post!]!
  }

  type SeniorityTypeConnection implements ConnectionResponse {
    cursor: String!
    hasMore: Boolean!
    seniorityTypes: [SeniorityType!]!
  }

  type Mutation {
    addSeller(
      firstName: String
      middleName: String
      lastName: String
      phone: String
    ): AddSellerMutationResponse!
    updateSeller(
      id: ID!
      firstName: String
      middleName: String
      lastName: String
      phone: String
    ): UpdateSellerMutationResponse!
    deleteSeller(id: ID!): DeleteSellerMutationResponse!
    restoreSeller(id: ID!): RestoreSellerMutationResponse!
    addSellerAppointment(
      postId: ID!
      day: Day!
    ): AddSellerAppointmentMutationResponse!
    updateSellerAppointment(
      postId: ID!
      day: Day!
    ): UpdateSellerAppointmentMutationResponse!
    deleteSellerAppointment(day: Day!): DeleteSellerAppointmentMutationResponse!

    login(email: String): String
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type AddSellerMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    seller: Seller
  }

  type UpdateSellerMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    seller: Seller
  }

  type DeleteSellerMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type RestoreSellerMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    seller: Seller
  }

  type AddSellerAppointmentMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    appointment: Appointment
  }

  type UpdateSellerAppointmentMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    appointment: Appointment
  }

  type DeleteSellerAppointmentMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type Connection {
    edges: Edge!
    pageInfo: PageInfo!
  }

  type Edge {
    node: Node!
    cursor: Cursor!
  }

  type Node {
    id: ID!
  }

  scalar Cursor

  type PageInfo {
    after: Cursor
    before: Cursor
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  type Seller {
    id: ID!
    firstName: String!
    middleName: String!
    lastName: String!
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
    email: String!
    roles: [Role!]!
  }

  type Role {
    id: ID!
    name: String!
  }

  enum SortOrder {
    ASC
    DESC
  }

  enum PaginationTypes {
    OFFSET
    CURSOR
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
