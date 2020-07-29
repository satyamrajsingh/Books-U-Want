const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);


//virtual field that sets the hashed password,and also returns the password using get
userSchema.virtual("password")
.set(function(password){
    this._password=password;
    this.salt=uuidv1();
    this.hashed_password=this.encryptPassword(password);
})
.get(function(){
    return this._password
})

userSchema.methods={

    //Basically 2 methods are defined,1 simple authentication and other to encrypt the recieved password using crypto which is then used in virtual field
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);