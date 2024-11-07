const { decode, encode } = require("node-base64-image");
const shortUniqueId = require("short-unique-id");

const imageSaver = async (req, res, next) => {
  const uId = new shortUniqueId({ length: 10 });
  // console.log(req?.body);

  try {
    const { imageb64, name } = req?.body;

    const options = {
      string: true,
      headers: {
        "User-Agent": "server",
      },
    };

    const imageEncode = await encode(imageb64, options);

    const uniqueId = uId.rnd();
    const freshName = name.toLowerCase().replaceAll(" ", "");

    const imagePath = `students/${freshName + uniqueId}`;

    await decode(imageEncode, {
      fname: `./public/${imagePath}`,
      ext: "jpg",
    });

    req.body.savedImageUrl = `${imagePath}.jpg`;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = imageSaver;
