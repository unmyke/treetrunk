export default `
  type Seller {
    id: ID!
    firstName: String!
    middleName: String!
    lastName: String!
    phone: Phone!
    post: Post!
    seniorityType: SeniorityType!
    recruitedAt: Day
    dismissAt: Day
    deletedAt: Day
    state: SellerState!
    appointments: [Appointment!]!
  }

  type Appointment {
    post: Post!
    day: Day!
  }

  enum SellerState {
    NEW
    RECRUITED
    DISMISS
    DELETED
  }
`;
