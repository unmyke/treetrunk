import { subDays, startOfDay } from "date-fns";
import { Contact, PersonName } from "../lib/ValueObjects";
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

const appointmentDate1 = new Date("2018.02.14 11:00");
const appointmentDate2 = new Date("2018.03.20 11:00");
const appointmentDate3 = new Date("2018.04.14 11:00");
const wrongAppointmentDate = new Date("2017.02.14 11:00");

describe("Domain :: entities :: Seller", () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ surname, firstName, middleName, phone });
  });

  describe("#constructor", () => {
    it("should be instance of Seller", () => {
      expect(seller).toBeInstanceOf(Seller);
      expect(seller.id).toBeInstanceOf(SellerId);
      expect(seller.personName).toBeInstanceOf(PersonName);
      expect(seller.fullName).toBe(`${surname} ${firstName} ${middleName}`);
      expect(seller.phone).toBe(phone);
      expect(seller.appointments).toHaveLength(0);
    });
  });

  describe("#appointToPostId", () => {
    context("when appoint to one postId", () => {
      it("should have appointments length equal 1", () => {
        seller.appointToPostId(floristPost.id, appointmentDate1);

        expect(seller.appointments).toHaveLength(1);
      });
    });

    context("when appoint to same postId by same date", () => {
      it("should throw exeption", () => {
        seller.appointToPostId(floristPost.id, appointmentDate1);

        try {
          seller.appointToPostId(floristPost.id, appointmentDate1);
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
          seller.appointToPostId(floristPost.id, appointmentDate1);

          try {
            seller.appointToPostId(floristPost.id, new Date());
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
          seller.appointToPostId(seniorFloristPost.id, appointmentDate2);
          seller.appointToPostId(floristPost.id, appointmentDate1);

          expect(seller.appointments).toHaveLength(2);
        });
      }
    );
  });

  describe("#getPostIdAtDate", () => {
    beforeEach(() => {
      seller.appointToPostId(seniorFloristPost.id, appointmentDate2);
      seller.appointToPostId(floristPost.id, appointmentDate3);
      seller.appointToPostId(floristPost.id, appointmentDate1);
    });

    context("when date before first appointment", () => {
      it("should return undefined", () => {
        expect(
          seller.getPostIdAtDate(subDays(appointmentDate1, 1))
        ).toBeUndefined();
      });
    });

    context("when date equal second appointment date", () => {
      it("should return second appointment's postId", () => {
        expect(seller.getPostIdAtDate(appointmentDate2)).toBe(
          seniorFloristPost.id
        );
      });
    });

    context("when date after third appointment date", () => {
      it("should return third appointment's postId", () => {
        expect(seller.getPostIdAtDate(new Date())).toBe(floristPost.id);
      });
    });
  });

  describe("#deleteAppointmentToPostIdAtDate", () => {
    beforeEach(() => {
      seller.appointToPostId(floristPost.id, appointmentDate1);
      seller.appointToPostId(seniorFloristPost.id, appointmentDate2);
      seller.appointToPostId(floristPost.id, appointmentDate3);
    });

    context("when delete existing appointment", () => {
      it("should decrease appointments length", () => {
        expect(seller.appointments).toHaveLength(3);

        seller.deleteAppointmentToPostIdAtDate(
          floristPost.id,
          appointmentDate3
        );

        expect(seller.getPostIdAtDate()).toBe(seniorFloristPost.id);
        expect(seller.appointments).toHaveLength(2);
      });
    });

    context("when delete appointment twice", () => {
      it("should throw exeption", () => {
        seller.deleteAppointmentToPostIdAtDate(
          floristPost.id,
          appointmentDate3
        );

        try {
          seller.deleteAppointmentToPostIdAtDate(
            floristPost.id,
            appointmentDate3
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

  describe("#editAppointment", () => {
    beforeEach(() => {
      seller.appointToPostId(floristPost.id, appointmentDate1);
    });

    context("when appointment has created with wrong postId", () => {
      it("should change associated postId", () => {
        seller.editAppointment(
          floristPost.id,
          appointmentDate1,
          seniorFloristPost.id,
          appointmentDate1
        );

        expect(seller.appointments).toHaveLength(1);
        expect(seller.appointments[0].date).toEqual(
          startOfDay(appointmentDate1)
        );
        expect(seller.getPostIdAtDate()).toBe(seniorFloristPost.id);
      });
    });

    context("when appointment has created with wrong date", () => {
      it("should change associated date", () => {
        seller.editAppointment(
          floristPost.id,
          appointmentDate1,
          floristPost.id,
          appointmentDate2
        );
        expect(seller.appointments).toHaveLength(1);
        expect(seller.getPostIdAtDate(appointmentDate1)).toEqual(undefined);
        expect(seller.getPostIdAtDate(appointmentDate2)).toBe(floristPost.id);
      });
    });
  });

  describe("#seniority", () => {
    beforeEach(() => {
      seller.appointToPostId(floristPost.id, appointmentDate2);
    });

    context("when seller have appointments", () => {
      it("should count seniority of seller in months without departures", () => {
        expect(seller.seniority(appointmentDate3)).toBe(2);
      });
      // it("should count seniority of seller in months with departures", () => {
      //   seller.takeQuit());
      //   expect(seller.seniority().toBe(0));
      // });
      it("should throw error before seller's appointment", () => {
        try {
          seller.seniority(appointmentDate1);
        } catch (e) {
          expect(e.details).toEqual([
            "Seniority can not be count before seller's appointment"
          ]);
        }
      });
    });
  });
});
