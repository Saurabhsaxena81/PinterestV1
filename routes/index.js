const express = require("express");
const router = express.Router();
const postModel = require("./posts");
const userModel = require("./users");
const passport = require("passport");
const upload = require("./multer");
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});
router.get("/register", function (req, res, next) {
  res.render("index");
});

router.get("/feed", function (req, res, next) {
  res.render("feed");
});
router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(404).send("no files available");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });

    const post = await postModel.create({
      image: req.file.filename,
      postText: req.body.filecaption,
      user: user._id,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
    // jo file upload hui hai use save karo as a post and uska post id user ko do and post ko userid do
  }
);

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  console.log(user);
  res.render("profile", { user });
});

router.post("/register", function (req, res) {
  const { username, email, fullname, password } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel
    .register(userData, password)
    .then(() => {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/"); // Redirect to registration page on error
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
// router.get("/logout", function (req, res) {
//   req.logout(); // Logout the user
//   res.redirect("/register");
// });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;

// router.get("/alluserposts", async function (req, res, next) {
//   let user = await userModel
//     .findOne({
//       _id: "65f41167a38f0c01eff2e325",
//     })
//     .populate("posts"); //to get data of the real post
//   res.send(user);
// });
// router.get("/createuser", async function (req, res, next) {
//   let createduser = await userModel.create({
//     username: "saurabh",
//     password: "saurabh",
//     posts: [],
//     // Default profile picture filename
//     email: "saurabh@male.com",
//     fullname: "saurabh saxena",
//   });
//   res.send(createduser);
// });
// router.get("/createpost", async function (req, res, next) {
//   let createdpost = await postModel.create({
//     postText: "Hello kaise ho saare ",
//     user: "65f41167a38f0c01eff2e325",
//   });
//   let user = await userModel.findOne({ _id: "65f41167a38f0c01eff2e325" });
//   user.posts.push(createdpost._id);
//   await user.save();

//   res.send("done ");
// });
// module.exports = router;
