const setupProctorSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join:exam', (examId) => {
      socket.join(`exam:${examId}`);
      console.log(`Socket ${socket.id} joined exam:${examId}`);
    });

    socket.on('leave:exam', (examId) => {
      socket.leave(`exam:${examId}`);
    });

    socket.on('proctor:heartbeat', (data) => {
      socket.to(`exam:${data.examId}`).emit('proctor:heartbeat', {
        studentId: data.studentId,
        timestamp: new Date(),
      });
    });

    socket.on('proctor:alert', (data) => {
      io.to(`exam:${data.examId}`).emit('proctor:alert', {
        studentId: data.studentId,
        activityType: data.activityType,
        severity: data.severity,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default setupProctorSocket;
