import cookie from "js-cookie";

export const cookieSetting = {
  get: (name: string) => cookie.get(name),
  set: (name: string, token: string) =>
    cookie.set(name, token, { expires: 1 / 24 }),
  clear: (name: string) => cookie.remove(name),
};

export const getDateOfPresent = () => {
  const dates = new Date();
  const years = dates.getFullYear();
  const months = ("0" + (1 + dates.getMonth())).slice(-2);
  const days = ("0" + dates.getDate()).slice(-2);
  return days + "-" + months + "-" + years;
};
