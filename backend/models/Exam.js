import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 1,
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 0,
  },
  passingMarks: {
    type: Number,
    required: true,
    min: 0,
  },
  instructions: {
    type: String,
    maxlength: 2000,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  endsAt: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);
