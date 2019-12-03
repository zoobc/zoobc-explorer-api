const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const { upsertMany, encrypt, decrypt } = require('../utils');

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      uniqueCaseInsensitive: true,
      required: [true, 'Email required!'],
      validate: [isEmail, 'No valid email address provided.'],
    },
    password: { type: String, trim: true, required: [true, 'Password required!'] },
    role: { type: String, default: 'Admin', enum: ['Superadmin', 'Admin'], required: [true, 'Role required!'] },
    token: { type: String },
    tokenExpired: { type: Date },
    status: { type: String, default: 'Active', enum: ['Active', 'Disable'], required: [true, 'Status required!'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: [false, 'Created By required!'] },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  },
  { timestamps: true },
  { toJSON: { virtuals: true } }
);

schema.plugin(upsertMany);

schema.statics.findByEmail = async function(email) {
  const user = await this.findOne({ email });

  return user;
};

schema.statics.findByToken = async function(token) {
  const hash = await this.findOne({ token });

  return hash;
};

schema.pre('save', async function() {
  if (this.role !== 'Superadmin') {
    this.password = await this.generatePasswordHash();
  }
});

schema.methods.generatePasswordHash = async function() {
  return await encrypt(this.password);
};

schema.methods.validatePassword = async function(password) {
  return (await decrypt(this.password.trim())) === password.trim();
};

module.exports = mongoose.model('User', schema);
