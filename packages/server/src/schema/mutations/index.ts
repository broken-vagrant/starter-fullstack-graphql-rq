import { objectType } from "nexus";
import postMutationDef from "./post";
import userMutationDef from "./user";

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    userMutationDef(t)
    postMutationDef(t)
  }
})

export default Mutation;