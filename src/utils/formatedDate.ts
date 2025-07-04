import moment from "moment";

export function formatedDate(date: Date | null | undefined | string) {
  // return moment(date).format('YYYY-MM-DDTHH:mm:ss')
  return moment(date).format("YYYY-MM-DD");
}
