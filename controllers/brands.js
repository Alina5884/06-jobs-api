const { StatusCodes } = require('http-status-code');
const Brand = require('../models/Brand');
const { BadRequestError, NotFoundError } = require('../errors')


const getAllBrands = async ( req, res) => {
    const brands = await Brand.find({ createdBy: req.user.userId }).sort({ name: 1 });
    res.status(StatusCodes.OK).json({ brands, count: brands.length})
};

const getBrand = async ( req, res) => {
    const { user: { userId }, params: { id: brandId } } = req;

    const brand = await Brand.findOne({ 
        _id: brandId, createdBy: userId
    });
    if (!brand) {
        throw new NotFoundError(`No brand with id ${brandId}`)
    };
    res.status(StatusCodes.OK).json({ brand })
};

const createBrand = async ( req, res) => {
    req.body.createdBy = req.user.userId;
    const brand = await Brand.create(req.body);
    res.status(StatusCodes.CREATED).json({ brand })
};

const updateBrand = async ( req, res) => {
    const { 
        body: { name, category, description, logo, website },
        user: { userId }, 
        params: { id: brandId } 
    } = req;

    if (name === "" || category === "" || description === "" || logo === "" || website === "") {
        throw new BadRequestError('Fields cannot be empty')
    }
    const brand = await Brand.findByIdAndUpdate({ 
        _id: brandId, createdBy: userId }, 
        req.body, 
        { new: true, runValidators: true }
    );
    if (!brand) {
        throw new NotFoundError(`No brand with id ${brandId}`)
    };
    res.status(StatusCodes.OK).json({ brand })
};

const deleteBrand = async ( req, res) => {
    const { user: { userId }, params: { id: brandId } } = req;
    const brand = await Brand.findByIdAndDelete({ 
        _id: brandId, createdBy: userId
    });
    if (!brand) {
        throw new NotFoundError(`No brand with id ${brandId}`)
    };
    res.status(StatusCodes.OK).send()


};


module.exports = {
    getAllBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand
};