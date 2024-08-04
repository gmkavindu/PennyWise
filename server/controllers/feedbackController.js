const Feedback = require('../models/Feedback');
const User = require('../models/User');
// Create or update feedback
exports.postFeedback = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('name email');
    let feedback = await Feedback.findOne({ userId });

    if (feedback) {
      // If feedback already exists, append the new message
      feedback.messages.push({ content: message });
    } else {
      // If feedback does not exist, create a new record
      feedback = new Feedback({
        userId,
        name: user.name,
        email: user.email,
        messages: [{ content: message }],
      });
    }

    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get all feedbacks
exports.getFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authentication middleware
    const feedbacks = await Feedback.find({ userId }); // Fetch feedbacks for the user
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feedbacks' });
  }
};

