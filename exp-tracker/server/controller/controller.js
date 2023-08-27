const model = require('../models/model');

async function create_Categories(req, res) {
    const Create = new model.Categories({
        type: "Investment",
        color: "#FCBE44"
    });

    try {
        await Create.save();
        return res.json(Create);
    } catch (err) {
        return res.status(400).json({ message: `Error while creating categories ${err}` });
    }
}

async function get_Categories(req, res) {
    try {
        const data = await model.Categories.find({});
        const filter = data.map(v => ({ type: v.type, color: v.color }));
        return res.json(filter);
    } catch (err) {
        return res.status(400).json({ message: `Error while getting categories ${err}` });
    }
}

async function create_Transaction(req, res) {
    if (!req.body) return res.status(400).json({ message: "Post HTTP Data not Provided" });
    const { name, type, amount } = req.body;

    const create = new model.Transaction({
        name,
        type,
        amount,
        date: new Date()
    });

    try {
        await create.save();
        return res.json(create);
    } catch (err) {
        return res.status(400).json({ message: `Error while creating transaction ${err}` });
    }
}

async function get_Transaction(req, res) {
    try {
        const data = await model.Transaction.find({});
        return res.json(data);
    } catch (err) {
        return res.status(400).json({ message: `Error while getting transactions ${err}` });
    }
}

async function delete_Transaction(req, res) {
    if (!req.body) return res.status(400).json({ message: "Request body not Found" });

    try {
        await model.Transaction.deleteOne(req.body);
        return res.json("Record Deleted...!");
    } catch (err) {
        return res.status(400).json({ message: "Error while deleting Transaction Record" });
    }
}

async function get_Labels(req, res) {
    try {
        const result = await model.Transaction.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: 'type',
                    foreignField: "type",
                    as: "categories_info"
                }
            },
            {
                $unwind: "$categories_info"
            }
        ]);

        const data = result.map(v => ({
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info['color']
        }));

        res.json(data);
    } catch (error) {
        res.status(400).json("Lookup Collection Error");
    }
}

module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
};