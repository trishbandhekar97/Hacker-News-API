const Story = require('../models/Story');

exports.pastStories = async (req, res) => {
  try {
    const stories = await Story.find();

    return res.json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    return res.json({
      success: 'false',
      error: 'Server Error',
    });
  }
};
