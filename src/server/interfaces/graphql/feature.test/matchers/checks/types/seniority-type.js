import withState from './with-state';
import withTimestamp from './with-timestamp';

const checkSeniorityType = withState(
  withTimestamp((seniorityType, mockSeniorityType) => {
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
    mockSeniorityType.awards.forEach(({ value, day: { value: day } }, idx) => {
      expect(seniorityType.awards[idx]).toEqual({
        value,
        day: day.getTime(),
      });
    });

    return {
      message: 'response contains seniority type',
      pass: true,
    };
  })
);
export default checkSeniorityType;
