const mongoose = require('mongoose');

const { Schema } = mongoose;

const QuestionsSchema = new Schema({
  questionText: { type : String, required: true},
  inputType: String,
  categoryId: String,
  isActive: { type: String, default: "1"}
});



mongoose.model('Questions', QuestionsSchema);
