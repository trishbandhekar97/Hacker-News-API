const axios = require('axios');
const client = require('../../db/redis');

exports.comments = async (req, res) => {
  const id = req.params.id;

  const url = `${process.env.BASE_URL}/item/${id}.json?print=pretty`;

  let commentIds = [];
  let comments = [];
  let replyCount = 0;

  await axios
    .get(url)
    .then((response) => {
      commentIds = response.data.kids;
    })
    .catch((err) => {
      console.log(err);
    });

  for (commentId in commentIds) {
    await axios
      .get(
        `${process.env.BASE_URL}/item/${commentIds[commentId]}.json?print=pretty`
      )
      .then((response) => {
        comments.push(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  for (comment in comments) {
    replyCount = 0;
    if (comments[comment].kids !== undefined) {
      for (kid in comments[comment].kids) {
        await axios
          .get(
            `${process.env.BASE_URL}/item/${comments[comment].kids[kid]}.json?print=pretty`
          )
          .then((resp) => {
            replyCount +=
              resp.data.kids === undefined ? 0 : resp.data.kids.length;
          })
          .catch((err) => {
            console.log(err);
          });
      }

      comments[comment].replies = comments[comment].kids.length + replyCount;
    } else {
      comments[comment].replies = 0;
    }
  }

  comments.sort((a, b) => {
    return b.replies - a.replies;
  });

  comments = comments.slice(0, 10);

  comments.map(async (comment) => {
    delete comment.replies;
  });

  for (comment in comments) {
    user = await axios.get(
      `${process.env.BASE_URL}/user/${comment.by}.json?print=pretty`
    );
    comments[comment].hnAge =
      new Date().getFullYear() -
      new Date(user.data.created * 1000).getFullYear();
  }

  client.setex(id, 600, JSON.stringify(comments));

  res.json({
    success: true,
    data: comments,
    count: comments.length,
  });
};
