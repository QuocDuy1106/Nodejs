import express from "express";
const getHomePage = (req, res) => {
    return res.render("home", { data: { title: 'Home page', page: 'main'} })
}
export default getHomePage