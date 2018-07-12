export function diaryMustNotBeClosedAtRecordDay({ record: { day } }) {
  if (this.operatee.isClosedAt(day)) {
    throw this.errors.diaryClosed();
  }
}
