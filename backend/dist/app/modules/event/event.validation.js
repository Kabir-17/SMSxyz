"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventValidation = void 0;
const zod_1 = require("zod");
const createEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
        description: zod_1.z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
        date: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
        time: zod_1.z.string().optional(),
        location: zod_1.z.string().max(200, 'Location cannot exceed 200 characters').optional(),
        type: zod_1.z.enum(['academic', 'extracurricular', 'administrative', 'holiday', 'exam', 'meeting', 'announcement', 'other'], {
            errorMap: () => ({ message: 'Type must be one of: academic, extracurricular, administrative, holiday, exam, meeting, announcement, other' })
        }),
        targetAudience: zod_1.z.object({
            roles: zod_1.z.array(zod_1.z.enum(['admin', 'teacher', 'student', 'parent'])).min(1, 'At least one role must be selected'),
            grades: zod_1.z.array(zod_1.z.number().min(1).max(12)).optional(),
            sections: zod_1.z.array(zod_1.z.string()).optional(),
            specific: zod_1.z.array(zod_1.z.string()).optional()
        }),
        isActive: zod_1.z.boolean().optional().default(true)
    })
});
const updateEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').optional(),
        description: zod_1.z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
        date: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format').optional(),
        time: zod_1.z.string().optional(),
        location: zod_1.z.string().max(200, 'Location cannot exceed 200 characters').optional(),
        type: zod_1.z.enum(['academic', 'extracurricular', 'administrative', 'holiday', 'exam', 'meeting', 'announcement', 'other']).optional(),
        targetAudience: zod_1.z.object({
            roles: zod_1.z.array(zod_1.z.enum(['admin', 'teacher', 'student', 'parent'])).min(1, 'At least one role must be selected'),
            grades: zod_1.z.array(zod_1.z.number().min(1).max(12)).optional(),
            sections: zod_1.z.array(zod_1.z.string()).optional(),
            specific: zod_1.z.array(zod_1.z.string()).optional()
        }).optional(),
        isActive: zod_1.z.boolean().optional()
    })
});
const getEventsSchema = zod_1.z.object({
    query: zod_1.z.object({
        type: zod_1.z.enum(['academic', 'extracurricular', 'administrative', 'holiday', 'exam', 'meeting', 'announcement', 'other']).optional(),
        startDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid start date format').optional(),
        endDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date format').optional(),
        grade: zod_1.z.string().transform((val) => parseInt(val)).refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12').optional(),
        section: zod_1.z.string().optional(),
        page: zod_1.z.string().transform((val) => parseInt(val)).refine((val) => val > 0, 'Page must be greater than 0').optional().default('1'),
        limit: zod_1.z.string().transform((val) => parseInt(val)).refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100').optional().default('20'),
        isActive: zod_1.z.string().transform((val) => val === 'true').optional()
    })
});
const getEventByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Event ID is required')
    })
});
exports.eventValidation = {
    createEventSchema,
    updateEventSchema,
    getEventsSchema,
    getEventByIdSchema
};
//# sourceMappingURL=event.validation.js.map