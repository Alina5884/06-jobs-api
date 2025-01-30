const express = require('express');
const router = express.Router();

const { 
    getAllBrands, 
    getBrand, 
    createBrand, 
    updateBrand, 
    deleteBrand } = require('../controllers/brands');

router.route('/').post(createBrand).get(getAllBrands);
router.route('/:id').get(getBrand).delete(deleteBrand).patch(updateBrand);


module.exports = router;