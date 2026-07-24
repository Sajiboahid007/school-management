import express from "express";
import cors from "cors";

import roleRouter from "./routes/role.js";
import schoolInformationRouter from "./routes/schoolInformation.js";
import departmentRouter from "./routes/department.js";
import userRouter from "./routes/user.js";
import teacherRouter from "./routes/teacher.js";
import studentRouter from "./routes/student.js";
import classRouter from "./routes/class.js";
import subjectRouter from "./routes/subject.js";
import classScheduleRouter from "./routes/classSchedule.js";
import admissionRouter from "./routes/admission.js";
import attendanceRouter from "./routes/attendance.js";
import examRouter from "./routes/exam.js";
import examsResultRouter from "./routes/examsResult.js";
import feeManagementRouter from "./routes/feeManagement.js";
import messageRouter from "./routes/message.js";
import notificationRouter from "./routes/notification.js";
import loginRouter from "./routes/login.js";

const app = express();

app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());

// Register All API Routers under /api
app.use("/api", loginRouter);
app.use("/api", roleRouter);
app.use("/api", schoolInformationRouter);
app.use("/api", departmentRouter);
app.use("/api", userRouter);
app.use("/api", teacherRouter);
app.use("/api", studentRouter);
app.use("/api", classRouter);
app.use("/api", subjectRouter);
app.use("/api", classScheduleRouter);
app.use("/api", admissionRouter);
app.use("/api", attendanceRouter);
app.use("/api", examRouter);
app.use("/api", examsResultRouter);
app.use("/api", feeManagementRouter);
app.use("/api", messageRouter);
app.use("/api", notificationRouter);

app.listen(3200, () => {
    console.log("Server is running on port 3200");
});
