const { Watch, Brand } = require('../models/allModel')

class watchController {
    async getAll(req, res) {
        try {
            const watches = await Watch.find({}).populate('brand');
            res.render('listwatch', {
                title: 'List of Watches',
                watchData: watches,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message)
        }
    }
    async getDetail(req, res) {
        try {
            const watch = await Watch.findById(req.params.id).populate('brand');
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
}

module.exports = new watchController()