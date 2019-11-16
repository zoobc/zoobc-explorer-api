const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema(
  {
    email: { type: String, trim: true, lowercase: true, unique: true, uniqueCaseInsensitive: true, required: [true, 'Email required!'] },
    password: { type: String, trim: true, required: [true, 'Password required!'] },
    role: { type: String, default: 'Admin', enum: ['Superadmin', 'Admin'], required: [true, 'Role required!'] },
    resetToken: { type: String },
    resetExpired: { type: Date },
    status: { type: String, enum: ['Active', 'Disable'], required: [true, 'Status required!'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: [false, 'Created By required!'] },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  },
  { timestamps: true },
  { toJSON: { virtuals: true } }
);

schema.plugin(upsertMany);
module.exports = mongoose.model('Users', schema);
