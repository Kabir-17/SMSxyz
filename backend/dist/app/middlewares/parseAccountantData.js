"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAccountantData = void 0;
const parseAccountantData = (req, res, next) => {
    try {
        const accountantData = { ...req.body };
        const jsonFields = [
            'experience',
            'qualifications',
            'address',
            'emergencyContact',
            'salary',
            'responsibilities',
            'certifications',
            'isActive'
        ];
        jsonFields.forEach(field => {
            if (accountantData[field] && typeof accountantData[field] === 'string') {
                try {
                    accountantData[field] = JSON.parse(accountantData[field]);
                }
                catch (error) {
                    console.error(`Failed to parse ${field}:`, error);
                }
            }
        });
        if (accountantData.qualifications && Array.isArray(accountantData.qualifications)) {
            accountantData.qualifications = accountantData.qualifications.map((qual) => ({
                ...qual,
                year: typeof qual.year === 'string' ? parseInt(qual.year, 10) : qual.year
            }));
        }
        if (accountantData.experience && typeof accountantData.experience.totalYears === 'string') {
            accountantData.experience.totalYears = parseInt(accountantData.experience.totalYears, 10);
        }
        if (accountantData.isActive && typeof accountantData.isActive === 'string') {
            accountantData.isActive = accountantData.isActive === 'true';
        }
        if (accountantData.salary) {
            if (typeof accountantData.salary.basic === 'string') {
                accountantData.salary.basic = parseFloat(accountantData.salary.basic);
            }
            if (typeof accountantData.salary.allowances === 'string') {
                accountantData.salary.allowances = parseFloat(accountantData.salary.allowances);
            }
            if (typeof accountantData.salary.deductions === 'string') {
                accountantData.salary.deductions = parseFloat(accountantData.salary.deductions);
            }
        }
        req.body = accountantData;
        next();
    }
    catch (error) {
        console.error("Error in parseAccountantData middleware:", error);
        next(error);
    }
};
exports.parseAccountantData = parseAccountantData;
//# sourceMappingURL=parseAccountantData.js.map