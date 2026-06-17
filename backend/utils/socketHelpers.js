export const emitProctorEvent = (io, examId, data) => {
  io.to(`exam:${examId}`).emit('proctor:event', data);
};

export const emitStudentStatus = (io, examId, studentId, status) => {
  io.to(`exam:${examId}`).emit('proctor:student-status', { studentId, status });
};

export const emitProctorAlert = (io, examId, alert) => {
  io.to(`exam:${examId}`).emit('proctor:alert', alert);
};
