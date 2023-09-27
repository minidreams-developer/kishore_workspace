const mongoose = require('mongoose');
const express = require('express');

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String }
  })
  
  const model = new mongoose.model('model',userSchema);

  module.exports = model;