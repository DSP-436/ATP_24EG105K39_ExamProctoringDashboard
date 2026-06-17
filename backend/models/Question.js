import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
    index: true,
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: 1000,
  },
  questionType: {
    type: String,
    enum: ['mcq', 'true_false', 'short_answer'],
    required: true,
  },
  options: [{
    type: String,
    maxlength: 500,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    min: 1,
  },
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
