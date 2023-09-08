import { Schema } from "mongoose";
import User from "./User.js";

// validator needs to use the group listed for that admin
/**
 * @param {any} value
 */
async function verifyAdmin(value) {
  const user = await User.findById(value);
  if (!user) return false;
  // @ts-ignore
  return user.roles.includes("admin");
}

const fromField = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: "group"
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
})

const NotificationSchema = new Schema({
  from: {
    type: fromField,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    enum: {
      values: [
        "Response required: Notice of violation",
        "A group has invited you to join them!",
      ],
    },
  },
  message: {
    type: String,
  },
});

export default NotificationSchema;
