let express         = require('express'),
    mongoose        = require('mongoose')
    bodyParser      = require('body-parser'),
    engines         = require('consolidate'), // npm install nunjucks
    assert          = require('assert'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    app             = express();

//APP CONFIG
 mongoose.connect('mongodb://test:test@ds163340.mlab.com:63340/heroku_ssbbj5hb');
app.engine("html", engines.nunjucks) // dont forget to install nunjucks
app.set("view engine", "html")
app.set("views", __dirname + '/views')
app.use(express.static("public"));
app.use(express.static("semantic"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); // this line follows bodyParser() instantiations
app.use(methodOverride("_method"));
app.set('port', (process.env.PORT || 5000));


// MONGOOSE/MODEL CONFIG
let recipeSchema = mongoose.Schema({
  title: String, // or could be written as {type: String}
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
})
let Recipe = mongoose.model('recipe', recipeSchema);

recipe.create({
  title: "Chilli Beans",
  image: "http://img.taste.com.au/eii6jtFD/w720-h480-cfill-q80/taste/2016/11/smokey-chilli-beans-83839-1.jpeg",
  body: "Recipe goes here"
})

// RESTFUL ROUTES

//1. INDEX
app.get("/", (req,res) => {
res.send("heroku app working!")
//  res.redirect("/recipes")
})

app.get("/recipes", (req,res) => {
  Recipe.find({}, (err, recipes) => {
    if(err) console.log(err);
    res.render("index", {recipes:recipes})
  })
})

// 2. NEW

app.get("/recipes/new",(req,res) => {
  //show new recipe form
  res.render("new")
})

// 3. CREATE
app.post("/recipes",(req,res) => {
  // create a new recipe, then redirect
//  new recipe({ name: 'Silence' });
Recipe.create({
  title:  req.body.title,
  image:  req.body.image,
  body:   req.sanitize(req.body.body)

})

// show all recipes
  res.redirect("/recipes")
})

// 4. SHOW
app.get("/recipes/:id",(req,res) => {
  let id =req.params.id;

   Recipe.findById(id, (err, recipe) => {
     res.render("recipe", {recipe:recipe})
   })
})

// 5. EDIT
app.get("/recipes/:id/edit",(req,res) => {
  let id =req.params.id;
  Recipe.findById(id, (err, recipe) => {
    console.log(recipe)
    res.render("edit", {recipe:recipe})
  })
})

// 6. UPDATE

app.put("/recipes/:id", (req,res) => {

  console.log(req.body)
// let id =req.params.id;
//
// let title = req.body.title;
// let image = req.body["image-url"];
// let body = req.body.body;

  Recipe.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, updatedrecipe) {
    if(err) {res.redirect('/recipes')}
    res.redirect("/recipes/" + req.params.id)

  });

})




//7. DESTROY
app.delete("/recipes/:id", (req,res)=> {

  Recipe.remove({ "_id": req.params.id }, function (err) {
    if (err) return handleError(err);
    // removed!
  });


res.redirect("/recipes")

})







// LISTEN
// app.listen(3000, () => {
//   console.log("server listening on port 3000")
// })
// heroku:

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
