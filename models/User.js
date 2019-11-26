const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { upsertMany } = require('../utils');

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
    password: { type: String, trim: true, required: [true, 'Password required!'], minlength: 7, maxlength: 42 },
    role: { type: String, default: 'Admin', enum: ['Superadmin', 'Admin'], required: [true, 'Role required!'] },
    // resetToken: { type: String },
    // resetExpired: { type: Date },
    status: { type: String, default: 'Active', enum: ['Active', 'Disable'], required: [true, 'Status required!'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: [false, 'Created By required!'] },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  },
  { timestamps: true },
  { toJSON: { virtuals: true } }
);

schema.plugin(upsertMany);

schema.statics.findByEmail = async function(email) {
  const user = await this.findOne({
    email,
  });

  return user;
};

schema.pre('save', async function() {
  this.password = await this.generatePasswordHash();
});

schema.methods.generatePasswordHash = async function() {
  return await bcrypt.hash(this.password, 10);
};

schema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', schema);
