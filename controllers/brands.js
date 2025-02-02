const { StatusCodes } = require('http-status-codes');
const Brand = require('../models/Brand');
const { BadRequestError, NotFoundError } = require('../errors')


const getAllBrands = async ( req, res) => {
    const brands = await Brand.find({ createdBy: req.user.userId }).sort('name');
    res.status(StatusCodes.OK).json({ brands, count: brands.length})
};

const getBrand = async ( req, res) => {
    res.send('Get brand')
};

const createBrand = async ( req, res) => {
    req.body.createdBy = req.user.userId;
    const brand = await Brand.create(req.body);
    res.status(StatusCodes.CREATED).json({ brand })
};

const updateBrand = async ( req, res) => {
    res.send('Update brand')
};

const deleteBrand = async ( req, res) => {
    res.send('Delete brand')
};


module.exports = {
    getAllBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand
};