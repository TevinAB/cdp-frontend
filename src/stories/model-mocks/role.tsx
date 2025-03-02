/*
  title?: ROLE_TITLE;
  start_datetime?: Date;
  end_datetime?: Date;
  person?: Person;
  person_ref?: string;
  body?: Body;
  body_ref?: string;
  seat?: Seat;
  seat_ref?: string;
  external_source_id?: string;
*/
import { ROLE_TITLE } from "../../models/util/RoleUtilities";
import { basicBody } from "./body";
import { basicSeat } from "./seat";
const ten_years_councilmember = {
  title: ROLE_TITLE.COUNCILMEMBER,
  start_datetime: new Date("1/1/2010"),
  person_ref: "person-test-id",
  seat: basicSeat,
  seat_ref: "fake-ten_years_councilmember-id",
  external_source_id: "fake-role-external-id",
  body: basicBody,
};

const recent_chair = {
  title: ROLE_TITLE.CHAIR,
  start_datetime: new Date("1/1/2020"),
  person_ref: "person-test-id",
  seat: basicSeat,
  seat_ref: "fake-recent_chair-id",
  external_source_id: "fake-role-external-id",
  body: basicBody,
};

const expired_chair = {
  title: ROLE_TITLE.CHAIR,
  start_datetime: new Date("1/1/2018"),
  end_datetime: new Date("1/1/2020"),
  person_ref: "person-test-id",
  seat: basicSeat,
  seat_ref: "fake-recent_chair-id",
  external_source_id: "fake-role-external-id",
  body: basicBody,
};

export { ten_years_councilmember, recent_chair, expired_chair };
