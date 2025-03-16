const mongoose = require('mongoose');

// Define the schema for storing form submissions
const formSubmissionSchema = new mongoose.Schema(
  {
    submissionData: {
      type: Map,
      of: String, // You can define a Map of any data type here, like String, Number, etc.
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
  }
);

// Create and export the Mongoose model
const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = FormSubmission;
