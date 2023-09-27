const mongoose = require('mongoose');
const express = require('express');

const formSchema = new mongoose.Schema({
    name: String,
    description: String,
    teamName: String,
    numMembers: Number,
    location: String,
    college: String,
    phoneNumber: String,
  });
  
  const FormModel = mongoose.model("Form", formSchema);

  module.exports = FormModel;