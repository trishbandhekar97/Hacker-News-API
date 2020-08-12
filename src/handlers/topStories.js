const Story = require('../models/Story');

const axios = require('axios');
const client = require('../../db/redis');

exports.topStories = async (req, res) => {
  await axios
    .get(`${process.env.BASE_URL}/topstories.json?print=pretty`)
    .then(async (response) => {
      topStoriesId = response.data;

      let i = 0,
        n = 0;
      let stories = [];

      while (i < topStoriesId.length) {
        await axios
          .get(
            `${process.env.BASE_URL}/item/${topStoriesId[i]}.json?print=pretty`
          )
          .then((data) => {
            if (data.data.type === 'story') {
              stories.push(data.data);
              n++;
            }
          });

        i++;

        if (n === 10) {
          break;
        }
      }
      stories.sort((a, b) => {
        return b.score - a.score;
      });

      stories.map((story) => {
        delete story.descendants;
        delete story.kids;
        delete story.type;
      });

      for (story in stories) {
        if (!(await Story.findOne({ id: stories[story].id }))) {
          await Story.create(stories[story]);
        }
      }

      client.setex('topStories', 600, JSON.stringify(stories));

      res.json({
        success: true,
        count: stories.length,
        data: stories,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
