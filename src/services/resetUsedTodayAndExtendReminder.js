const cron = require("node-cron");
const Medicine = require("../models/medicineModel");

// Function to reset 'usedToday' field and handle 'reminder' extension
const resetUsedTodayAndExtendReminder = async () => {
    try {
        const medicines = await Medicine.find({});

        const now = new Date();

        medicines.forEach(async (medicine) => {
            medicine.usedToday = false;

            // Check if 'reminder' needs to be extended
            if (medicine.reminder && now >= medicine.reminder) {
                // Preserve the time part of the reminder
                const reminderTime =
                    medicine.reminder.getTime() % (24 * 60 * 60 * 1000); // Time part in milliseconds
                const newReminderDate = new Date(medicine.reminder);
                newReminderDate.setDate(newReminderDate.getDate() + 1); // Extend by one day
                newReminderDate.setTime(
                    newReminderDate.getTime() -
                        (newReminderDate.getTime() % (24 * 60 * 60 * 1000)) +
                        reminderTime
                ); // Add back the time part

                medicine.reminder = newReminderDate;
            }
            await medicine.save();
        });

        console.log("Reset usedToday and reminder update completed.");
    } catch (error) {
        console.error(
            "Error resetting usedToday and extending reminder:",
            error
        );
    }
};

// Schedule the job to run at midnight every day
cron.schedule('0 0 * * *', resetUsedTodayAndExtendReminder);
// cron.schedule("*/2 * * * *", resetUsedTodayAndExtendReminder);

console.log("Scheduled job to reset usedToday and extend reminder.");
