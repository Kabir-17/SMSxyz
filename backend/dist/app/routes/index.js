"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_1 = __importDefault(require("../config"));
const router = (0, express_1.Router)();
const organization_route_1 = require("../modules/organization/organization.route");
const school_route_1 = require("../modules/school/school.route");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const student_route_1 = require("../modules/student/student.route");
const teacher_route_1 = require("../modules/teacher/teacher.route");
const superadmin_route_1 = require("../modules/superadmin/superadmin.route");
const class_route_1 = require("../modules/class/class.route");
const homework_route_1 = require("../modules/homework/homework.route");
const admin_route_1 = require("../modules/admin/admin.route");
const parent_route_1 = require("../modules/parent/parent.route");
const subject_route_1 = require("../modules/subject/subject.route");
const academic_calendar_route_1 = require("../modules/academic-calendar/academic-calendar.route");
const schedule_route_1 = require("../modules/schedule/schedule.route");
const event_route_1 = require("../modules/event/event.route");
const accountant_route_1 = require("../modules/accountant/accountant.route");
const fee_route_1 = __importDefault(require("../modules/fee/fee.route"));
const accountantFee_route_1 = __importDefault(require("../modules/fee/accountantFee.route"));
const autoattend_route_1 = require("../modules/attendance/autoattend.route");
const absence_sms_route_1 = require("../modules/attendance/absence-sms.route");
const assessment_route_1 = require("../modules/assessment/assessment.route");
const messaging_route_1 = require("../modules/messaging/messaging.route");
const moduleRoutes = [
    {
        path: "/attendance",
        route: autoattend_route_1.autoAttendRoutes,
    },
    {
        path: "/attendance",
        route: absence_sms_route_1.adminAbsenceSmsRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/superadmin",
        route: superadmin_route_1.superadminRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.adminRoutes,
    },
    {
        path: "/organizations",
        route: organization_route_1.organizationRoutes,
    },
    {
        path: "/schools",
        route: school_route_1.schoolRoutes,
    },
    {
        path: "/users",
        route: user_route_1.userRoutes,
    },
    {
        path: "/students",
        route: student_route_1.StudentRoutes,
    },
    {
        path: "/teachers",
        route: teacher_route_1.TeacherRoutes,
    },
    {
        path: "/parents",
        route: parent_route_1.parentRoutes,
    },
    {
        path: "/classes",
        route: class_route_1.classRoutes,
    },
    {
        path: "/homework",
        route: homework_route_1.homeworkRoutes,
    },
    {
        path: "/assessments",
        route: assessment_route_1.assessmentRoutes,
    },
    {
        path: "/subjects",
        route: subject_route_1.SubjectRoutes,
    },
    {
        path: "/calendar",
        route: academic_calendar_route_1.AcademicCalendarRoutes,
    },
    {
        path: "/schedules",
        route: schedule_route_1.ScheduleRoutes,
    },
    {
        path: "/events",
        route: event_route_1.EventRoutes,
    },
    {
        path: "/accountants",
        route: accountant_route_1.AccountantRoutes,
    },
    {
        path: "/fees",
        route: fee_route_1.default,
    },
    {
        path: "/accountant-fees",
        route: accountantFee_route_1.default,
    },
    {
        path: "/messaging",
        route: messaging_route_1.messagingRoutes,
    },
];
router.get("/config", (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            timezone: config_1.default.school_timezone,
        },
    });
});
moduleRoutes.forEach((route) => router.use(route.path, route.route));
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "School Management System API is running!",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map