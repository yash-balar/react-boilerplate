import { z } from "zod";
import { registrationFieldsSchema } from "./register.schema";

export const profileSchema = registrationFieldsSchema
  .omit({ role: true })
  .extend({ profilePicture: z.string() });
