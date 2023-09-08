import { Schema } from "mongoose";

const PermissionSchema = new Schema({
  allRead: { type: Boolean, default: false },
  allWrite: { type: Boolean, default: false },
  usersRead: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  usersWrite: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  groupsRead: [
    {
      type: Schema.Types.ObjectId,
      ref: "group",
    },
  ],
  groupsWrite: [
    {
      type: Schema.Types.ObjectId,
      ref: "group",
    },
  ],
});

export default PermissionSchema;
