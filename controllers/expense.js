const TransactionSchema= require("../models/TransactionModel")
const Transaction = require("../models/TransactionModel");
exports.addExpense = async (req, res) => {
    const {userId} = req.params;
    console.log(" esto es user id:", userId)
    const {title, amount, category, description, date} = req.body

    const expense = new TransactionSchema({
        title,
        amount,
        category,
        description,
        type: "Expense",
        date,
        userId
    })
    try {
        //validations
        if(!title || !category  || !date){
            return res.status(400).json({error: 'All fields are required!'})
        }
        await expense.save() 
       res.status(200).json({message: 'Expense Added'})
    } catch (error){
        if (error.name === 'ValidationError') {
            // Handle the specific error message for invalid currency amount
            if (error.errors.amount && error.errors.amount.message === 'Invalid currency amount') {
              return res.status(400).json({ error: 'Invalid currency amount provided' });
            }
        }
        res.status(500).json(error => res.status(500).json({error:'Server error '}))
    }

    console.log(expense)
}

exports.getExpense = async (req, res) =>{
    const {userId} = req.params;
    try {
        const expenses = await TransactionSchema.find({userId, type: "Expense"}).sort({createdAt: -1})

        res.status(200).json(expenses)
    } catch (error){
        res.status(500).json({message: 'Server Error'})
    }
}


exports.deleteExpense = async (req, res) =>{
    const {id} = req.params;
    TransactionSchema.findByIdAndDelete(id)
        .then((expense) =>{
            res.status(200).json({message: 'Expense Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}
exports.updateExpense = async (req, res) =>{
    const data = req.body;
    const updateFields = {};
  
    // Build the update object with the modified fields
    if (data.title) updateFields.title = data.title;
    if (data.amount) updateFields.amount = data.amount;
    if (data.category) updateFields.category = data.category;
    if (data.description) updateFields.description = data.description;
    if (data.date) updateFields.date = data.date;
  
    Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    )
      .then(updatedExpense => {
        console.log('Expense updated: ', updatedExpense);
        res.status(200).send('Expense update finished');
      })
      .catch(error => {
        res.status(400).json({ error: 'Error while updating the expense.' });
      });
  };