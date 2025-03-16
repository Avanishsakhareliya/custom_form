
const express = require('express');
const FormSubmission = require('../models/formSubmission');

const router = express.Router();

router.get('/get', async (req, res) => {
  try {
    res.json("get form success");
  } catch (error) {
    res.json(error);

  }
})


router.post('/submit',  async (req, res) => {
  try {
    const { submissionData } = req.body;
    if (!submissionData || typeof submissionData !== 'object') {
      return res.status(400).json({ message: 'Invalid form data' });
    }
    const newSubmission = new FormSubmission({
      submissionData,
    });

    await newSubmission.save();

    res.status(200).json({
      message: 'Form data submitted successfully',
      data: newSubmission,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting form', error: error.message });
  }
});


module.exports = router;
