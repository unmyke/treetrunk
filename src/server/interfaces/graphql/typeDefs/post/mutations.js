export default `
  type Mutation {
    createSeller(id: ID!): Seller!
    updateSeller(seller: SellerInput!): Seller!
    deleteSeller(id: ID!): Boolean!
    restoreSeller(id: ID!): Boolean!
    eraseSeller(id: ID!): Boolean!
    addAppointment(id: ID!, post: Post!, day: Day!): Seller!
    deleteAppointmentAt(id: ID!, day: Day!): Seller!
    updateAppointmentTo(
      id: ID!
      day: Day!
      newPost: Post!
      newDay: Day!
    ): Seller!
    dismissAt(id: ID!, day: Day!): Seller!
    deleteDismiss(id: ID!, day: Day!): Seller!
    updateDismissTo(id: ID!, day: Day!, newDay: Day!): Seller!
  }
`;
