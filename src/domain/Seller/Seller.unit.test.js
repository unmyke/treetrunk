import { Contact, PersonName, Day } from "../_lib/ValueObjects";
import { Seller } from "./Seller";
import { SellerId } from "./SellerId";
import { Post } from "../Post";
import { Appointment } from "./Appointment";

const surname = "Surname";
const firstName = "Firstname";
const middleName = "Middlename";
const phone = "55-66-00";

const floristPost = new Post({ name: "Флорист" });
const seniorFloristPost = new Post({ name: "Старший флорист" });

const newDay = new Day();
const appointmentDay1 = new Day({ value: new Date("2018.02.14 11:00") });
const appointmentDay2 = new Day({ value: new Date("2018.03.20 11:00") });
const appointmentDay3 = new Day({ value: new Date("2018.04.14 11:00") });

describe("Domain :: entities :: Seller", () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ surname, firstName, middleName, phone });
  });

  describe("#constructor", () => {
    it("should be instance of Seller", () => {
      expect(seller).toBeInstanceOf(Seller);
      expect(seller.sellerId).toBeInstanceOf(SellerId);
      expect(seller.personName).toBeInstanceOf(PersonName);
      expect(seller.fullName).toBe(`${surname} ${firstName} ${middleName}`);
      expect(seller.phone).toBe(phone);
      expect(seller.appointments).toHaveLength(0);
    });
  });

  describe("#appointToPostIdAt", () => {
    context("when appoint to one postId", () => {
      it("should have appointments length equal 1", () => {
        seller.appointToPostIdAt(floristPost.postId, appointmentDay1);

        expect(seller.appointments).toHaveLength(1);
      });
    });

    context("when appoint to same postId by same date", () => {
      it("should throw exeption", () => {
        seller.appointToPostIdAt(floristPost.postId, appointmentDay1);

        try {
          seller.appointToPostIdAt(floristPost.postId, appointmentDay1);
        } catch (e) {
          expect(e.details).toEqual(["Seller already have this post"]);
          expect(seller.appointments).toHaveLength(1);
        }
      });
    });

    context(
      "when appoint to same postId, different date, but previous postId is same",
      () => {
        it("should throw exeption", () => {
          seller.appointToPostIdAt(floristPost.postId, appointmentDay1);

          try {
            seller.appointToPostIdAt(floristPost.postId, newDay);
          } catch (e) {
            expect(e.details).toEqual(["Seller already have this post"]);
            expect(seller.appointments).toHaveLength(1);
          }
        });
      }
    );

    context(
      "when appoint to different postId, different date, but previous postId is same",
      () => {
        it("should have appointments length equal 2", () => {
          seller.appointToPostIdAt(seniorFloristPost.postId, appointmentDay2);
          seller.appointToPostIdAt(floristPost.postId, appointmentDay1);

          expect(seller.appointments).toHaveLength(2);
        });
      }
    );
  });

  describe("#getPostIdAt", () => {
    beforeEach(() => {
      seller.appointToPostIdAt(seniorFloristPost.postId, appointmentDay2);
      seller.appointToPostIdAt(floristPost.postId, appointmentDay3);
      seller.appointToPostIdAt(floristPost.postId, appointmentDay1);
    });

    context("when date before first appointment", () => {
      it("should return undefined", () => {
        expect(
          seller.getPostIdAt(appointmentDay1.subDays(1))
        ).toBeUndefined();
      });
    });

    context("when date equal second appointment date", () => {
      it("should return second appointment's postId", () => {
        expect(seller.getPostIdAt(appointmentDay2)).toBe(
          seniorFloristPost.postId
        );
      });
    });

    context("when date after third appointment date", () => {
      it("should return third appointment's postId", () => {
        expect(seller.getPostIdAt(newDay)).toBe(floristPost.postId);
      });
    });
  });

  describe("#deleteAppointmentToPostIdAt", () => {
    beforeEach(() => {
      seller.appointToPostIdAt(floristPost.postId, appointmentDay1);
      seller.appointToPostIdAt(seniorFloristPost.postId, appointmentDay2);
      seller.appointToPostIdAt(floristPost.postId, appointmentDay3);
    });

    context("when delete existing appointment", () => {
      it("should decrease appointments length", () => {
        expect(seller.appointments).toHaveLength(3);

        seller.deleteAppointmentToPostIdAt(
          floristPost.postId,
          appointmentDay3
        );

        expect(seller.getPostIdAt()).toBe(seniorFloristPost.postId);
        expect(seller.appointments).toHaveLength(2);
      });
    });

    context("when delete appointment twice", () => {
      it("should throw exeption", () => {
        seller.deleteAppointmentToPostIdAt(
          floristPost.postId,
          appointmentDay3
        );

        try {
          seller.deleteAppointmentToPostIdAt(
            floristPost.postId,
            appointmentDay3
          );
        } catch (e) {
          expect(e.details).toEqual([
            "Seller have not such appointment to this postId"
          ]);
          expect(seller.appointments).toHaveLength(2);
        }
      });
    });
  });

  describe("#editAppointmentAt", () => {
    beforeEach(() => {
      seller.appointToPostIdAt(floristPost.postId, appointmentDay1);
    });

    context("when appointment has created with wrong postId", () => {
      it("should change associated postId", () => {
        seller.editAppointmentAt(
          floristPost.postId,
          appointmentDay1,
          seniorFloristPost.postId,
          appointmentDay1
        );

        expect(seller.appointments).toHaveLength(1);
        expect(seller.appointments[0].day).toEqual(appointmentDay1);
        expect(seller.getPostIdAt()).toBe(seniorFloristPost.postId);
      });
    });

    context("when appointment has created with wrong date", () => {
      it("should change associated date", () => {
        seller.editAppointmentAt(
          floristPost.postId,
          appointmentDay1,
          floristPost.postId,
          appointmentDay2
        );
        expect(seller.appointments).toHaveLength(1);
        expect(seller.getPostIdAt(appointmentDay1)).toEqual(undefined);
        expect(seller.getPostIdAt(appointmentDay2)).toBe(floristPost.postId);
      });
    });
  });

  describe("#seniority", () => {
    beforeEach(() => {
      seller.appointToPostIdAt(floristPost.postId, appointmentDay2);
    });

    context("when seller have appointments", () => {
      it("should not be undefined", () => {
        expect(seller.seniority(appointmentDay3)).toBe(0);
      });
      // it("should be reset after seller's restoration", () => {
      //   seller.takeQuit();
      //   seller.restore()
      //   expect(seller.seniority().toBe(0));
      // });
      it("should be undefined when requested before seller's appointment", () => {
        expect(seller.seniority(appointmentDay1)).toBe(undefined);
      });
    });

    context("when seller have no appointments", () => {
      it("should be undefined", () => {
        seller.deleteAppointmentToPostIdAt(
          floristPost.postId,
          appointmentDay2
        );
        expect(seller.isRecruited()).toBe(false);
        expect(seller.seniority()).toBe(undefined);
      });
    });
  });
});
