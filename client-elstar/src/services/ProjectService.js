import ApiService from "./ApiService";

export async function apiGetProjectCalendar() {
  return ApiService.fetchData({
    url: "/projects",
    method: "get",
  });
}
