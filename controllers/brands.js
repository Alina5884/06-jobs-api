const { StatusCodes } = require('http-status-codes');
const Brand = require('../models/Brand');
const { BadRequestError, NotFoundError } = require('../errors')


const getAllBrands = async ( req, res) => {
    const queryObject = { createdBy: req.user.userId };

    if (req.query.ecoFriendly) {
        queryObject.ecoFriendly = req.query.ecoFriendly === "true"
    };

    if (req.query.nonToxic) {
        queryObject.nonToxic = req.query.ecoFriendly === "true"
    };

    if (req.query.plasticFree) {
        queryObject.plasticFree = req.query.ecoFriendly === "true"
    };

    if (req.query.veganCrueltyFree) {
        queryObject.veganCrueltyFree = req.query.ecoFriendly === "true"
    };

    const brands = await Brand.find(queryObject).sort({ name: 1 });
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