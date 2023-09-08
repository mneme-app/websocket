import { model, Schema } from "mongoose";
import PermissionSchema from "./PermissionSchema.js";

// Should add option to link to videos/images instead of text
// Captions will be required in those cases

// Don't forget to validate at least one source ID

const NoteSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 256,
    },
    sources: [
      {
        type: Schema.Types.ObjectId,
        ref: "source",
      },
    ],
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    permissions: PermissionSchema,
  },
  {
    timestamps: true,
  }
);

NoteSchema.set("toJSON", {
  virtuals: true,
});

export default model("note", NoteSchema);
