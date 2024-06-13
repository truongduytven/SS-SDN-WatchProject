const { Watch, Brand, Member, Comment } = require('../models/allModel')

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
            const memberId = req.session.memberId;
            var existingComment = false;
            watch.comments.forEach(comment => {
                if (comment.author._id.toString() === memberId ) {
                    existingComment = true;
                }
            })
            const brandData = await Brand.find({})
            if (!watch) {
                return res.status(404).send('Watch not found')
            }
            res.render('watchDetail', {
                title: `Details of ${watch.watchName}`,
                watchData: watch,
                watchID: req.params.id,
                brandData: brandData,
                existingComment,
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
    async addWatch(req, res) {
        try {
            const { watchName, image, price, Automatic, watchDescription, brand } = req.body;

            // Validate inputs
            if (!watchName || !image || !price || !watchDescription || !brand) {
                return res.status(400).send('All fields are required');
            }

            // Create a new watch
            const newWatch = new Watch({
                watchName,
                image,
                price,
                Automatic: Automatic === 'on',
                watchDescription,
                brand,
            });

            await newWatch.save();

            res.redirect('/watches');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
    async updateWatch(req, res) {
        try {
            const { id } = req.params;
            const { watchName, image, price, Automatic, watchDescription, brand } = req.body;

            // Validate inputs
            if (!watchName || !image || !price || !watchDescription || !brand) {
                return res.status(400).send('All fields are required');
            }

            // Find and update the watch
            const watch = await Watch.findById(id);
            if (!watch) {
                return res.status(404).send('Watch not found');
            }

            watch.watchName = watchName;
            watch.image = image;
            watch.price = price;
            watch.Automatic = Automatic === 'on';
            watch.watchDescription = watchDescription;
            watch.brand = brand;

            await watch.save();

            res.redirect(`/watches/${id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
    async deleteWatch(req, res) {
        try {
            const { id } = req.params;
            const watch = await Watch.findByIdAndDelete(id);
            if (!watch) {
                return res.status(404).send('Watch not found');
            }
            res.redirect('/watches')
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
    async addComment(req, res) {
        const watchId = req.params.id;
        const { content, rating } = req.body;
        const memberId = req.session.memberId;
        try {
            const watch = await Watch.findById(watchId);

            const newComment = new Comment({
                content,
                rating,
                author: memberId
            });

            watch.comments.push(newComment);
            await newComment.save();
            await watch.save();

            res.redirect(`/watches/${watchId}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message);
        }
    }
}

module.exports = new watchController()