import ApolloClient from "apollo-boost";
import { API_URL } from "./constants";

export const apolloclient = new ApolloClient({
  uri: API_URL,
});