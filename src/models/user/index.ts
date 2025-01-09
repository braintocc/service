import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    subscription: {
      level: String
    },
    sources:{},
    destinations: {},
    mappings:[]
  },
  {
    methods:{
    }
  }
);

export type User = mongoose.InferSchemaType<typeof userSchema>;
export const User = mongoose.model('User', userSchema);