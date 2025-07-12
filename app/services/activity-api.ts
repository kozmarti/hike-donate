import fetchFromApi from "./api-client";
import { Activity } from "../entities/Activity";

export async function createActivity(data: Activity): Promise<Activity> {
  return fetchFromApi<Activity>("activities", {
    method: "POST",
    body: data,
  });
}