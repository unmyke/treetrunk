import { convertDate } from 'src/infra/support/dateHelpers';

export function addDateAccessors(Class) {
  Object.defineProperties(Class.prototype, {
    date: {
      get: function() {
        return this._date;
      },
      set: function(date) {
        this._date = convertDate(date);
      }
    }
  });

  if (Date.prototype.equals === undefined) {
    Date.prototype.equals = function(date) {
      return this.getTime() === date.getTime();
    };
  }
}