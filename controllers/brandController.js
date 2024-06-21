const { Watch, Brand } = require('../models/allModel')

class brandController {
    async getAllBrand(req, res) {
        try {
            const brand = await Brand.find({}).sort('brandName')
            const membername = req.session.membername;
            res.render('listbrand', {
                title: 'List of Brands',
                brandData: brand,
                membername,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
    async addNewBrand(req, res) {
        try {
            const { brandName } = req.body;

            // Validate inputs
            if (!brandName) {
                req.flash('error','Please enter a brand name')
                return res.redirect('brands');
            }

            // Create a new watch
            const newBrand = new Brand({
                brandName,
            });

            await newBrand.save();
            req.flash('success_msg', 'Successfully added brand')
            res.redirect('/brands');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
    async updateBrand(req, res) {
        try {
            const { brandName } = req.body;
            const { id } = req.params;

            if (!brandName) {
                return res.status(400).send('Brand name is required');
            }

            const brand = await Brand.findByIdAndUpdate(id, { brandName });

            if (!brand) {
                return res.status(404).send('Brand not found');
            }

            res.redirect('/brands');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
    
    async deleteBrand(req, res) {
        try {
            const { id } = req.params;

            const brand = await Brand.findByIdAndDelete(id);

            if (!brand) {
                return res.status(404).send('Brand not found');
            }

            res.redirect('/brands');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
}

module.exports = new brandController()