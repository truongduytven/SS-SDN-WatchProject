const { Watch, Brand, Member } = require('../models/allModel')

class watchController {
    async getAll(req, res) {
        try {
            const watches = await Watch.find({}).populate('brand');
            const brand = await Brand.find({})
            const membername = req.session.membername;
            res.render('listwatch', {
                title: 'List of Watches',
                watchData: watches,
                brandData: brand,
                membername,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message)
        }
    }
    async getDetail(req, res) {
        try {
            const watch = await Watch.findById(req.params.id).populate('brand').populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    model: 'Member'
                }
            });
            if (!watch) {
                return res.status(404).send('Watch not found')
            }
            res.render('watchDetail', {
                title: `Details of ${watch.watchName}`,
                watchData: watch,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
    async search(req, res) {
        try {
            const query = req.query.watchName;
            const watches = await Watch.find({ watchName: new RegExp(query, 'i') }).populate('brand');
            const membername = req.session.membername;
            const brand = await Brand.find({});
            res.render('listwatch', {
                title: 'Search Results',
                watchData: watches,
                membername,
                brandData: brand,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }

    async filter(req, res) {
        try {
            const brandId = req.query.brand;
            const watches = await Watch.find({ brand: brandId }).populate('brand');
            const brand = await Brand.find({});
            const membername = req.session.membername;
            res.render('listwatch', {
                title: 'Filtered Watches',
                watchData: watches,
                brandData: brand,
                membername,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
}

module.exports = new watchController()