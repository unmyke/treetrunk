import checkEntityTimestamp from './entity-timestamp';

const checkSeniorityType = checkEntityTimestamp(
  (seniorityType, mockSeniorityType) => {
    if (!seniorityType) {
      return {
        message: () => 'there is no seniority type in response',
        pass: false,
      };
    }

    expect(seniorityType.id).toBe(mockSeniorityType.seniorityTypeId.value);
    expect(seniorityType.name).toBe(mockSeniorityType.name);
    expect(seniorityType.months).toBe(mockSeniorityType.months);
    expect(seniorityType.award).toBe(mockSeniorityType.award);
    mockSeller.awards.forEach(({ value, day: { value: day } }, idx) => {
      expect({ value, day: day.getTime() }).toEqual(
        mockSeniorityType.awards[idx]
      );
    });

    return {
      message: 'response contains seniority type',
      pass: true,
    };
  }
);
export default checkSeniorityType;
