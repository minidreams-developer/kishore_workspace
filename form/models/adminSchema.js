const mongoose = require("mongoose");
const express = require('express');


const adminSchema = new mongoose.Schema({
    email: {
        type : String,
        required : true 
    },
    password: {
        type : String,
        required : true 
    },
    role: {
        type : String,
        default: "admin"
    }
});

const adminModel = mongoose.model('admin', adminSchema);

module.exports = adminModel;