async function haveSeniorityType({ data }, { id, mockServices }) {
  const { data } = res;

  const { getSeniorityType } = mockServices;
  const seniorityType = await getSeniorityType;
}

export default haveSeniorityType;
