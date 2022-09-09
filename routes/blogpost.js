const express = require("express");
const router = express.Router();
const BlogPost = require("../models/blogpost.model");
const middleware = require("../middleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + ".jpg");
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});

router
  .route("/add/coverImage/:id")
  .patch(middleware.checkToken, upload.single("file"), (req, res) => {
    BlogPost.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          coverImage: req.file.path,
        },
      },
      { new: true },
      (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
      }
    );
  });

  router
  .route("/update/likes/:id")
  .patch((req, res) => {
    console.log(req.body+' Reached ');
    console.log(req.body.like+"likes");
    var currentlikes = 0;
    BlogPost.findById(req.params.id, function(err,result){result.like = result.like + 1; result.share = 1; result.save().then((result) => {
      res.json({ data: result["_id"] });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    }); console.log(result.like+"   "+currentlikes);});
    // BlogPost.findById(req.params.id, function(err,result){ result.save(); console.log(result.like+"   "+currentlikes);});

    // BlogPost.findOneAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $set: {
    //       // coverImage: req.file.path,

    //       like: currentlikes,
    //     },
    //   },
    //   { new: true },
    //   (err, result) => {
    //     if (err) return res.json(err);
    //     return res.json(result);s
    //   }
    // );
  });

  router
  .route("/update/deleteLikes/:id")
  .patch((req, res) => {
    console.log(req.body+' Reached ');
    console.log(req.body.like+"likes");
    var currentlikes = 0;
    BlogPost.findById(req.params.id, function(err,result){result.like = result.like - 1; result.share = 0; result.save().then((result) => {
      res.json({ data: result["_id"] });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    }); console.log(result.like+"   "+currentlikes); });
    // BlogPost.findById(req.params.id, function(err,result){ result.save(); console.log(result.like+"   "+currentlikes);});

    // BlogPost.findOneAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $set: {
    //       // coverImage: req.file.path,
    //       like: currentlikes,
    //     },
    //   },
    //   { new: true },
    //   (err, result) => {
    //     if (err) return res.json(err);
    //     return res.json(result);
    //   }
    // );
  });

router.route("/get/likes/:id").get(middleware.checkToken, (req, res) => {
  BlogPost.findById(req.params.id, function(err, result){if (err){
    console.log(err);
}
else{
    console.log("Result : ", result.like);
    res.json(result);
}});    
  // var dba = BlogPost.find(element => element._id == req.params.id);
  //   if(dba) { console.log(dba.like + "this");}
  //   else {res.sendStatus(404);}
});

router.route("/Add").post(middleware.checkToken, (req, res) => {
  const blogpost = BlogPost({
    username: req.decoded.username,
    title: req.body.title,
    body: req.body.body,
  });
  blogpost
    .save()
    .then((result) => {
      res.json({ data: result["_id"] });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
});

router.route("/getOwnBlog").get(middleware.checkToken, (req, res) => {
  BlogPost.find({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
});

router.route("/getOtherBlog").get(middleware.checkToken, (req, res) => {
  BlogPost.find({ username: { $ne: '' } }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
});

router.route("/delete/:id").delete(middleware.checkToken, (req, res) => {
  BlogPost.findOneAndDelete(
    {
      $and: [{ username: req.decoded.username }, { _id: req.params.id }],
    },
    (err, result) => {
      if (err) return res.json(err);
      else if (result) {
        console.log(result);
        return res.json("Blog deleted");
      }
      return res.json("Blog not deleted");
    }
  );
});

module.exports = router;