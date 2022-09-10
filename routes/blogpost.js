const express = require("express");
const router = express.Router();
const BlogPost = require("../models/blogpost.model");
const middleware = require("../middleware");
const multer = require('multer');


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.params.id + ".jpg");
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 6,
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
      cb(null, req.decoded.username + ".jpg");
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
};

const upload = multer({ storage: storage ,

  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  fileFilter: fileFilter,

});

router.route("/get/coverImage/:id").get(middleware.checkToken, (req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('imagesPage', { items: items });
      }
  });
});

// router.route("/add/coverImage/:id").patchImage(middleware.checkToken, upload.single('image'), (req, res, next) => {
  
  // var obj = {
  //     name: req.body.name,
  //     desc: req.body.desc,
  //     img: {
  //         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
  //         contentType: 'image/png'
  //     }
  // }
  // imgModel.create(obj, (err, item) => {
  //     if (err) {
  //         console.log(err);
  //     }
  //     else {
  //         // item.save();
  //         res.redirect('/');
  //     }
  // });

//   BlogPost.findOneAndUpdate(
//     { _id: req.params.id },
//     {
//       $set: {
//         coverImage: {
//                   data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//                   contentType: 'image/png'
//               }
//       },
//     },
//     { new: true },
//     (err, result) => {
//       if (err) return res.json(err);
//       return res.json(result);
//     }
//   );

// });

router
  .route("/add/coverImage/:id")
  .patch(middleware.checkToken, upload.single("img"), (req, res) => {
    BlogPost.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          coverImage: req.img.path,
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
  .patch(async (req, res) => {
    console.log(req.body+' Reached ');
    console.log(req.body.like+"likes");
    var currentlikes = 0;
    var result = await BlogPost.findById(req.params.id);
    result.like = result.like + 1;
    result.share = 1; 
    await result.save(); 
    res.json(result);
    //   .then((result) => {
    //   res.json({ data: result["_id"] });
    // })
    // .catch((err) => {
    //   console.log(err), res.json({ err: err });
    // }
    // ); 
    console.log(result.like+"   "+currentlikes);

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

  // router
  // .route("/update/likedOrNot/:id")
  // .patch((req, res) => {
  //   // console.log(req.body+' Reached ');
  //   // console.log(req.body.like+"likes");
  //   // var currentlikes = 0;
  //   var result = BlogPost.findById(req.params.id);
  //   result.share = req.share; 
  //   result.save(); 
  //   res.json(result);
  //   //   .then((result) => {
  //   //   res.json({ data: result["_id"] });
  //   // })
  //   // .catch((err) => {
  //   //   console.log(err), res.json({ err: err });
  //   // }
  //   // ); 
  //   // console.log(result.like+"   "+currentlikes);
  // });

  // router.route("/get/likedOrNot/:id").get((req, res) => {
  //   BlogPost.findById(req.params.id, function(err, result){if (err){
  //     console.log(err);
  // }
  // else{
  //     console.log("Result", result.like);
  //     res.json(result);
  // }});    
  //   // var dba = BlogPost.find(element => element._id == req.params.id);
  //   //   if(dba) { console.log(dba.like + "this");}
  //   //   else {res.sendStatus(404);}
  // });

  router
  .route("/update/deleteLikes/:id")
  .patch(async (req, res) => {
    console.log(req.body+' Reached ');
    console.log(req.body.like+"likes");
    var currentlikes = 0;
    var result= await BlogPost.findById(req.params.id);
    result.like = result.like - 1; 
    result.share = 0; 
    await result.save(); 
    res.json(result);
      //   .then((result) => {
      //   res.json({ data: result["_id"] });
      // })
      // .catch((err) => {
      //   console.log(err), res.json({ err: err });
      // }); 
    console.log(result.like+"   "+currentlikes); 
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

router.route("/get/likes/:id").get((req, res) => {
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
