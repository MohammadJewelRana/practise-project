import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";


const userSchema=new  Schema<TUser>({
    id:{type:String,required:true},
    password:{type:String,required:true},
    needsPasswordChange:{type:Boolean, default:true},
    role:{type:String, enum:['student','faculty','student']},
    status:{type:String, enum:['in-progress','blocked']} , 
    isDeleted:{type:Boolean,default:false},
 
},
{
    timestamps:true
}
)


userSchema.pre('save', async function (next) {
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_round),
    );
    next();
  });
  
  // set '' after saving password
  userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
  });


export const User=model<TUser>('User',userSchema)



