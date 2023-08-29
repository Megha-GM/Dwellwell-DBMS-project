const express = require("express");
const path = require("path")
const app = express();
const mysql = require("./connection").con
const port = 3000
const hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', './view')

app.use(express.static(path.join(__dirname, "frontend")))

app.use(express.static(path.join(__dirname,"Images")))
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/dashboard", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/home", (req, res) => {
    res.render("home")
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/owner",(req,res)=>{
    const {EmailID,Password} = req.query
    let qry2 = "select * from signup where emailid=? and password=?"
    mysql.query(qry2,[EmailID,Password],(err,results)=>
    {
        if (err) {
            console.log(err)
            res.send("<script>alert('Error occured');window.history.back();</script>")
        }
        if(results.length<=0)
        {
            res.send("<script>alert('You are not registered!');window.history.back();</script>")
        }
        else
        {
            res.render("ownerpage")
        }
    })
})

app.get("/tenantpage",(req,res)=>{
    const {EmailID,Password} = req.query
    let qry2 = "select * from signup where emailid=? and password=?"
    mysql.query(qry2,[EmailID,Password],(err,results)=>
    {
        if (err) {
            console.log(err)
            res.send("<script>alert('Error occured');window.history.back();</script>")
        }
        if(results.length<=0)
        {
            res.send("<script>alert('You are not registered!');window.history.back();</script>")
        }
        else
        {
            res.render("tenantpage")
        }
    })
})

app.get("/signupinfo", (req, res) => {
    //fetching data from signup
    const { Name, EmailID, ContactNumber, Password, ConfirmPassword } = req.query
    let qry = "insert into signup values(?,?,?,?,?)"
    mysql.query(qry, [Name, EmailID, ContactNumber, Password, ConfirmPassword], (err, results) => {
        if (err) {
            console.log(err)
            res.send("<script>alert('Password and Confirm password do not match or email entered is invalid.Please check if the data entered is correct.');window.history.back();</script>")
        } else if (req.query.Password === req.query.ConfirmPassword) {
            if (results.affectedRows > 0) {
                res.send("<script>alert('Database updated');window.history.back();</script>")
            }
        } else {
            res.send("<script>alert('Password and Confirm password do not match');window.history.back();</script>")
        }
    })
}
)

app.get("/users", (req, res) => {
    const { Rooms, Locality, BuiltArea } = req.query;
    let qry4 = "SELECT * FROM owner o, property p WHERE o.pid=p.pid AND p.pid IN (SELECT pid FROM property WHERE Rooms=? AND Locality=? AND BuiltArea=?)";
    mysql.query(qry4, [Rooms, Locality, BuiltArea], (err, rows, fields) => {
    res.render("users.hbs", {
    title: "User Details",
    items: rows,
    });
    });
    });

app.get("/owneradd",(req,res)=>
{
    const{Name,PID,Email,Contact,PPID,Locality,BuiltArea,Rooms,Rent,Facing,PPPID,PropertyAge,Availability,Bathrooms,Parking,FloorNumber, Balcony,PropertyType,PPPPID,BachelorsOrFamily,VegOrNonVeg,MaintainanceCharge} = req.query
    let qry3 = "Call insert_o(?,?,?,?)"
    mysql.query(qry3,[Name,PID,Email,Contact],(err,results)=>{
        if(err)
        {
            console.log(err)
            res.send("<script>alert('Error occured');window.history.back();</script>")
        }
        else
        {
            if(results.affectedRows > 0)
            {
                res.send("<script>alert('Database updated');window.history.back();</script>")
            }
            else
            {
                res.send("<script>alert('Database not updated');window.history.back();</script>")
            }
        }
    })
    let qry4 = "insert into property values (?,?,?,?,?,?)"
    mysql.query(qry4,[PPID,Locality,BuiltArea,Rooms,Rent,Facing],(err,results)=>{
        if(err)
        {
            console.log(err)
            res.send("<script>alert('Error occured');window.history.back();</script>")
        }
        else
        {
            if(results.affectedRows > 0)
            {
                res.send("<script>alert('Database updated');window.history.back();</script>")
            }
            else
            {
                res.send("<script>alert('Database not updated');window.history.back();</script>")
            }
        }
    })
    let qry5 = "insert into propertydetails values (?,?,?,?,?,?,?)"
    mysql.query(qry5,[PPPID,PropertyAge,Availability,Bathrooms,Parking,FloorNumber,Balcony,PropertyType],(err,results)=>{
        if(err)
        {
            console.log(err)
            res.send("<script>alert('Error occured');window.history.back();</script>")
        }
        else
        {
            if(results.affectedRows > 0)
            {
                res.send("<script>alert('Database updated');window.history.back();</script>")
            }
            else
            {
                res.send("<script>alert('Database not updated');window.history.back();</script>")
            }
        }
    })
    let qry6 = "insert into specifications values (?,?,?,?)"
    mysql.query(qry6,[PPPPID,BachelorsOrFamily,VegOrNonVeg,MaintainanceCharge],(err,results)=>{
        if(err)
        {
            console.log(err)
            res.send("<script>alert('Error occured');window.history.back();</script>")
        }
        else
        {
            if(results.affectedRows > 0)
            {
                res.send("<script>alert('Database updated');window.history.back();</script>")
            }
            else
            {
                res.send("<script>alert('Database not updated');window.history.back();</script>")
            }
        }
    })
})

app.listen(port, (req, res) => {
    console.log(`Server is running at http://localhost:${port}`)
});

