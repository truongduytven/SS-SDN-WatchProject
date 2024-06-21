const { Watch, Brand, Member, Comment } = require('../models/allModel')
const isValidUrl = (url) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!urlPattern.test(url);
};
const { ObjectId } = require('mongodb');

function isValidObjectId(id) {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}
class watchController {
    async getAll(req, res) {
        try {
            const watches = await Watch.find({}).populate('brand');
            const brand = await Brand.find({});
            res.render('listwatch', {
                title: 'List of Watches',
                watchData: watches,
                brandData: brand,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error: ' + error.message)
        }
    }
    async getDetail(req, res) {
        try {
            const watchId = req.params.id;
            if(!isValidObjectId(watchId)) {
                req.flash('error', 'Watch is not valid');
                return res.redirect('/watches')
            }
            const watch = await Watch.findById(watchId).populate('brand').populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    model: 'Member'
                }
            });
            const user = res.locals.user;
            var existingComment = false;
            if (watch.comments.length > 0) {
                watch.comments.forEach(comment => {
                    if (comment.author._id.toString() === user._id.toString()) {
                        existingComment = true;
                    }
                })
            }
            
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
            if (!brandId) {
                req.flash('error', 'Please enter a brand');
                return res.redirect('/watches')
            }
            if(!isValidObjectId(brandId)) {
                req.flash('error', 'Brand is not valid');
                return res.redirect('/watches')
            }
            const watches = await Watch.find({ brand: brandId }).populate('brand');
            const brand = await Brand.find({});
            res.render('listwatch', {
                title: 'Filtered Watches',
                watchData: watches,
                brandData: brand,
            });
        } catch(error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
}
    async addWatch(req, res) {
    try {
        const { watchName, image, price, Automatic, watchDescription, brand } = req.body;

        // Validate inputs
        if (!watchName || !image || !price || !watchDescription || !brand) {
            req.flash('error', 'Please full fill when add new watch');
            return res.redirect('/watches');
        }
        const findWatch = await Watch.findOne({ watchName: watchName })
        if (findWatch) {
            req.flash('error', 'Watch already exists');
            return res.redirect('/watches');
        }

        if (price < 1) {
            req.flash('error', 'Price must be larger than 1');
            return res.redirect('/watches');
        }
        if (!isValidUrl(image)) {
            req.flash('error', 'Invalid URL')
            return res.redirect('/watches');
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
        req.flash('success_msg', 'Watch added successfully');
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
            req.flash('error', 'Please full fill when add new watch');
            return res.redirect(`/watches/${id}`);
        }

        const findWatch = await Watch.findOne({ watchName: watchName })
        if (findWatch) {
            req.flash('error', 'Watch already exists');
            return res.redirect('/watches');
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
        req.flash('success_msg', 'Update watch added successfully');
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
        req.flash('success_msg', 'Delete watch successfully');
        res.redirect('/watches')
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
}
    async addComment(req, res) {
    const watchId = req.params.id;
    const { content, rating } = req.body;
    const user = res.locals.user;
    try {
        const watch = await Watch.findById(watchId);
        var existingComment = false;
        if (watch.comments.length > 0) {
            watch.comments.forEach(comment => {
                if (comment.author._id.toString() === user._id.toString()) {
                    existingComment = true;
                }
            })
        }
        if (existingComment) {
            req.flash('error_msg', 'You already have a comment in this watch')
            return res.redirect(`/watches/${watchId}`)
        }
        const newComment = new Comment({
            content,
            rating,
            author: user._id,
        });
        watch.comments.push(newComment);
        await watch.save();
        req.flash('success_msg', 'Comment added successfully')
        res.redirect(`/watches/${watchId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
}
}

module.exports = new watchController()