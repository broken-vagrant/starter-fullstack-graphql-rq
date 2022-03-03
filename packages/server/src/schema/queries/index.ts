import { objectType } from "nexus";
import postQueryDef from "./post";
import userQueryDef from "./user";

const Query = objectType({
  name: 'Query',
  definition(t) {
    postQueryDef(t)
    userQueryDef(t)
  }
})
export default Query;