import { Types } from 'mongoose';
export interface HolidayQueryOptions {
    schoolId: Types.ObjectId | string;
    dateKey: string;
    timezone?: string;
    grade?: number;
    section?: string;
}
export declare const findHolidayEventsForClass: (options: HolidayQueryOptions) => Promise<(import("mongoose").FlattenMaps<import("../event/event.interface").IEventDocument> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const isHolidayForClassOnDate: (options: HolidayQueryOptions) => Promise<boolean>;
//# sourceMappingURL=holiday-utils.d.ts.map