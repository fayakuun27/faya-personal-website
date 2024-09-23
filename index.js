const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json");
const upload = require("./middlewares/upload-file");

const sequelize = new Sequelize(config.development);

const projectModel = require("./models").project;
const userModel = require("./models").user;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "my-session",
    secret: "ewVsqWOyeb",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());

app.get("/", home);
app.get("/add-project", addProjectView);
app.post("/add-project", upload.single("image"), addProject);
app.get("/delete-project/:id", deleteProject);
app.get("/edit-project/:id", editProjectView);
app.post("/edit-project/:id", upload.single("image"), editProject);
app.get("/contact", contact);
app.get("/testimonials", testimonial);
app.get("/project-detail/:id", projectDetail);

app.get("/login", loginView);
app.get("/register", registerView);

app.post("/register", register);
app.post("/login", login);
app.get("/logout", logout);

function logout(req, res) {
  req.session.user = null;
  res.redirect("/");
}

function loginView(req, res) {
  const user = req.session.user;
  if (user) return res.redirect("/");
  res.render("login");
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // cek email user apakah ada di database
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      req.flash("error", "Email / password salah!");
      return res.redirect("/login");
    }

    // cek password apakah valid dengan password yang sudah di hash
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      req.flash("error", "Email / password salah!");
      return res.redirect("/login");
    }

    req.session.user = user;

    req.flash("success", "Login berhasil!");

    res.redirect("/");
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.redirect("/");
  }
}

function registerView(req, res) {
  const user = req.session.user;

  if (user) return res.redirect("/");
  res.render("register");
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    req.flash("success", "Register berhasil! Silahkan login");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", "Register gagal! Email sudah digunakan");
    res.redirect("/register");
  }
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = Math.abs(end - start);
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Hitung selisih hari
  const monthsDiff = Math.floor(daysDiff / 30); // Kira-kira hitung bulan
  const daysRemaining = daysDiff % 30;

  if (monthsDiff == 0) {
    if (daysDiff == 0) {
      return `0 days`;
    } else if (daysDiff == 1) {
      return `1 day`;
    } else {
      return `${daysRemaining} days`;
    }
  } else if (monthsDiff == 1) {
    if (daysDiff == 0) {
      return `1 month`;
    } else if (daysDiff == 1) {
      return `1 month and 1 day`;
    } else {
      return `1 month and ${daysRemaining} days`;
    }
  } else {
    if (daysDiff == 0) {
      return `${monthsDiff} months`;
    } else if (daysDiff == 1) {
      return `${monthsDiff} months and 1 days`;
    } else {
      return `${monthsDiff} months and ${daysRemaining} days`;
    }
  }
}

async function home(req, res) {
  const user = req.session.user;
  const result = await projectModel.findAll({
    include: [
      {
        model: userModel,
      },
    ],
  });

  for (let i = 0; i < result.length; i++) {
    result[i].duration = calculateDuration(
      result[i].startDate,
      result[i].finishDate
    );
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i].description.length > 35) {
      result[i].description = result[i].description.slice(0, 35) + "..."; // Tampilkan hanya sebagian deskripsi
    }
  }

  res.render("index", { data: result, user });
}

async function deleteProject(req, res) {
  const { id } = req.params;

  let result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  if (!result) return res.render("not-found");

  await projectModel.destroy({
    where: {
      id: id,
    },
  });
  res.redirect("/");
}

async function addProject(req, res) {
  const { projectName, startDate, finishDate, description, technologies } =
    req.body;
  const imagePath = req.file.path;
  const userId = req.session.user.id;

  await projectModel.create({
    projectName: projectName,
    startDate: startDate,
    finishDate: finishDate,
    description: description,
    technologies: technologies,
    image: imagePath,
    userId: userId,
  });

  res.redirect("/");
}

async function editProjectView(req, res) {
  const user = req.session.user;
  if (user) return res.redirect("/login");
  const { id } = req.params;

  const result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  if (!result) return res.render("not-found");

  res.render("edit-project", { data: result });
}

async function editProject(req, res) {
  const { id } = req.params;
  const { projectName, startDate, finishDate, description, technologies } =
    req.body;
  const imagePath = req.file.path;
  const project = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  if (!project) return res.render("not-found");

  project.projectName = projectName;
  project.startDate = startDate;
  project.finishDate = finishDate;
  project.description = description;
  project.technologies = technologies;
  project.image = imagePath;

  await project.save();

  res.redirect("/");
}

function addProjectView(req, res) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }

  res.render("add-project");
}

function contact(req, res) {
  res.render("contact");
}

function testimonial(req, res) {
  res.render("testimonials");
}

async function projectDetail(req, res) {
  const { id } = req.params;
  const result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  result.duration = calculateDuration(result.startDate, result.finishDate);
  result.dateRange = `${new Date(result.startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} - ${new Date(result.finishDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  if (!result) return res.render("not-found");
  res.render("project-detail", { data: result });
}

app.listen(port, () => {
  console.log("Server is running on PORT :", port);
});
