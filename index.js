import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended : true}));

// Main route
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// home route
app.get("/home", (req, res) => {
    res.render("home.ejs", { blogList: blogList });
});


// Initiate empty blog list
let blogList = [];

// Post request
app.post("/home", (req, res) =>{
    const blogTitle = req.body.blogTitle;
    const blogDescription  = req.body.blogDes;
    //Adding to blog list
    blogList.push({
        id: genID(),
        title: blogTitle,
        description: blogDescription,
    });

    res.render("home.ejs", {blogList: blogList});
});

// Blog details page rendered
app.get("/blogDetails/:id", (req, res) => {
    const blogId = req.params.id;
    const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
    res.render("blogDetails.ejs", {
      blogDetails: blogDetails,
    });
});

// Edit form route
app.get("/edit/:id", (req, res) => {
    const blogId = req.params.id;
    const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
    
    if (!blogDetails) {
        return res.status(404).send("<h1>Blog not found</h1>");
    }

    res.render("edit.ejs", {
        blogDetails: blogDetails,
    });
});

// Edit option
app.post("/edit/:id", (req, res) => {
    const blogId = req.params.id;
    const editBlog = blogList.findIndex((blog) => blog.id === parseInt(blogId));

    if (editBlog === -1) {
        return res.send("<h1>Something went wrong</h1>");
    }

    // Update the blog details
    const updatedTitle = req.body.blogTitle;
    const updatedDescription = req.body.blogDes;

    blogList[editBlog].title = updatedTitle;
    blogList[editBlog].description = updatedDescription;

    res.redirect("/home");
});

// Delete option
app.post("/delete/:id", (req, res) => {
    const blogId = req.params.id;
    blogList = blogList.filter((blog) => blog.id !== parseInt(blogId));
    res.redirect("/home");
});

//ID generator
function genID (){
    return Math.floor(Math.random() * 10000);
}

// Start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});