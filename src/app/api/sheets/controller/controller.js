const {
    getGoogleSheetClient,
    SHEET_ID,
} = require("../../../../providers/gapi/google-api");
const Scheduler = require("../../../../providers/scheduler/scheduler");
const { userDoAttandend } = require("../../../../utility/attandend/attandend");
const {
    resSuccess,
} = require("../../../../utility/response-handlers/success/response-success");
const prisma = require("../../../../providers/database/client");
const { decryptText } = require("../../../../utility/encription/encription");

exports.rosterPageList = async (req, res, next) => {
    try {
        const sheets = await getGoogleSheetClient();

        const response = await sheets.spreadsheets.get({
            spreadsheetId: SHEET_ID,
        });

        const sheetTitles = response.data.sheets.map(
            (sheet) => sheet.properties.title
        );

        return resSuccess({
            res,
            title: "Success getting sheet name",
            data: sheetTitles,
        });
    } catch (error) {
        next(error);
    }
};

exports.rosterPersonnelList = async (req, res, next) => {
    const { tabName } = req.params;
    try {
        const sheets = await getGoogleSheetClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${tabName}!A:B`,
        });

        const cleanData = response.data.values.filter((v) => isNumber(v[0]));
        return resSuccess({
            res,
            title: "Success getting personnel name",
            data: cleanData,
        });
    } catch (error) {
        next(error);
    }
};

exports.generateSchedulersPreview = async (req, res, next) => {
    const {
        personnel_number,
        personnel_name,
        tab_name: tabName,
        random_max_time: randomMaxTime = 8,
    } = req.body;

    const personnelRow = Number(personnel_number) + 3;
    const schedulers = [];
    const [_, monthName, year] = String(tabName).split(" ");
    const month = convertMonthToNumber(monthName);

    try {
        const sheets = await getGoogleSheetClient();
        const schedule = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${tabName}!G${personnelRow}:AK${personnelRow}`,
        });
        const date = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${tabName}!G2:AK2`,
        });
        const personnel = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${tabName}!A${personnelRow}:D${personnelRow}`,
        });

        const position = personnel.data.values[0][2];

        if (String(position).toUpperCase() === "L2") {
            const shiftPeriods = schedule.data.values[0];
            const dateOfShifts = date.data.values[0];

            for (let i = 0; i < shiftPeriods.length; i++) {
                const shift = shiftPeriods[i];
                const date = dateOfShifts[i];
                const dateObj = new Date();
                dateObj.setDate(date);

                if (String(shift).toUpperCase() == "S2") {
                    const minutes = getRandomMinutes(randomMaxTime);

                    const waktuAbsenMasuk = new Date(
                        year,
                        month,
                        date,
                        20,
                        minutes,
                        0
                    );

                    const waktuAbsenPulang = new Date();
                    waktuAbsenPulang.setDate(waktuAbsenMasuk.getDate() + 1);
                    waktuAbsenPulang.setHours(8);
                    waktuAbsenPulang.setMinutes(minutes);

                    // console.log(
                    //     `Absen Masuk S2: WITEL - APRIL ${date} 2024 Pukul 8 Malam`
                    // );

                    schedulers.push({
                        keterangan_absen: "absen_masuk",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenMasuk,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                        },
                    });

                    // console.log(
                    //     `Absen Pulang S2: WITEL - APRIL ${
                    //         Number(date) + 1
                    //     } 2024 Pukul 8 Pagi`
                    // );

                    schedulers.push({
                        keterangan_absen: "absen_pulang",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenPulang,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                            aktivitas: getRandomActivityL2(),
                        },
                    });
                }

                // Jika Tanngal Absen Adalah WeekDay maka absen masuk di SMR dan Pulang di WItel
                if (
                    String(shift).toUpperCase() == "S1" &&
                    !(dateObj.getDay() == 0 || dateObj.getDay() == 6)
                ) {
                    const minutes = getRandomMinutes(randomMaxTime);

                    const waktuAbsenMasuk = new Date(
                        year,
                        month,
                        date,
                        8,
                        minutes,
                        0
                    );
                    const waktuAbsenPulang = new Date(
                        year,
                        month,
                        date,
                        20,
                        minutes,
                        0
                    );
                    // console.log(
                    //     `Absen Masuk S1: SMR - APRIL ${date} 2024 Pukul 8 Pagi`
                    // );
                    schedulers.push({
                        keterangan_absen: "absen_masuk",
                        lokasi_absen: "SMR",
                        tanggal_absen: waktuAbsenMasuk,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.1499495, 106.8880579",
                            alamat: "Jalan Mitra Sunter Boulevard, RW 11, Sunter Jaya, Tanjung Priok, North Jakarta, Special Capital Region of Jakarta, Java, 14350, Indonesia",
                            state: "Sunter Jaya",
                            provinsi: "Special Capital Region of Jakarta",
                        },
                    });

                    // console.log(
                    //     `Absen Pulang S1: WITEL - APRIL ${Number(
                    //         date
                    //     )} 2024 Pukul 8 Malam`
                    // );
                    schedulers.push({
                        keterangan_absen: "absen_pulang",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenPulang,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                            aktivitas: getRandomActivityL2(),
                        },
                    });
                }

                // Jika Tanngal Absen Adalah WeekEnd maka absen masuk di Witel dan Pulang juga WItel
                if (
                    String(shift).toUpperCase() == "S1" &&
                    (dateObj.getDay() == 0 || dateObj.getDay() == 6)
                ) {
                    const minutes = getRandomMinutes(randomMaxTime);

                    const waktuAbsenMasuk = new Date(
                        year,
                        month,
                        date,
                        8,
                        minutes,
                        0
                    );
                    const waktuAbsenPulang = new Date(
                        year,
                        month,
                        date,
                        20,
                        minutes,
                        0
                    );
                    // console.log(
                    //     `Absen Masuk S1: WITEL - APRIL ${date} 2024 Pukul 8 Pagi`
                    // );
                    schedulers.push({
                        keterangan_absen: "absen_masuk",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenMasuk,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                        },
                    });

                    // console.log(
                    //     `Absen Pulang S1: WITEL - APRIL ${Number(
                    //         date
                    //     )} 2024 Pukul 8 Malam`
                    // );
                    schedulers.push({
                        keterangan_absen: "absen_pulang",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenPulang,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                            aktivitas: getRandomActivityL2(),
                        },
                    });
                }
            }
        }

        if (String(position).toUpperCase() === "L1") {
            const shiftPeriods = schedule.data.values[0];
            const dateOfShifts = date.data.values[0];

            for (let i = 0; i < shiftPeriods.length; i++) {
                const shift = shiftPeriods[i];
                const date = dateOfShifts[i];
                const dateObj = new Date();
                dateObj.setDate(date);

                if (String(shift).toUpperCase() == "S2") {
                    const minutes = getRandomMinutes(randomMaxTime);

                    const waktuAbsenMasuk = new Date(
                        year,
                        month,
                        date,
                        20,
                        minutes,
                        0
                    );

                    const waktuAbsenPulang = new Date();
                    waktuAbsenPulang.setDate(waktuAbsenMasuk.getDate() + 1);
                    waktuAbsenPulang.setHours(8);
                    waktuAbsenPulang.setMinutes(minutes);

                    // console.log(
                    //     `Absen Masuk S2: WITEL - APRIL ${date} 2024 Pukul 8 Malam`
                    // );

                    schedulers.push({
                        keterangan_absen: "absen_masuk",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenMasuk,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                        },
                    });

                    // console.log(
                    //     `Absen Pulang S2: WITEL - APRIL ${
                    //         Number(date) + 1
                    //     } 2024 Pukul 8 Pagi`
                    // );

                    schedulers.push({
                        keterangan_absen: "absen_pulang",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenPulang,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                            aktivitas: getRandomActivityL1(),
                        },
                    });
                }

                if (String(shift).toUpperCase() == "S1") {
                    const minutes = getRandomMinutes(randomMaxTime);

                    const waktuAbsenMasuk = new Date(
                        year,
                        month,
                        date,
                        8,
                        minutes,
                        0
                    );
                    const waktuAbsenPulang = new Date(
                        year,
                        month,
                        date,
                        20,
                        minutes,
                        0
                    );
                    // console.log(
                    //     `Absen Masuk S1: SMR - APRIL ${date} 2024 Pukul 8 Pagi`
                    // );
                    schedulers.push({
                        keterangan_absen: "absen_masuk",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenMasuk,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                        },
                    });

                    // console.log(
                    //     `Absen Pulang S1: WITEL - APRIL ${Number(
                    //         date
                    //     )} 2024 Pukul 8 Malam`
                    // );
                    schedulers.push({
                        keterangan_absen: "absen_pulang",
                        lokasi_absen: "WITEL",
                        tanggal_absen: waktuAbsenPulang,
                        data: {
                            via: "WFO",
                            kondisi: "Sehat",
                            lokasi: "-6.117492, 106.893084",
                            alamat: "Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia",
                            state: "",
                            provinsi: "Daerah Khusus Jakarta",
                            aktivitas: getRandomActivityL1(),
                        },
                    });
                }
            }
        }

        return resSuccess({
            res,
            title: "Success creating scheduler preview",
            data: {
                personnel_name: personnel_name,
                shift_month: tabName,
                schedulers: schedulers,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.setSchedulers = async (req, res, next) => {
    console.log("Set Schedulers Function");
    try {
        const { schedule } = req.body;
        const currentDate = new Date();
        const bulkData = [];
        const responseData = [];
        const userData = await prisma.user.findUnique({
            where: { id: req.userId },
        });

        if (userData == null || userData == undefined) {
            throw new Error(
                "Cant find user, maybe user was remove from system"
            );
        }

        // Remove Esisting Task
        const existingTask = await prisma.$queryRaw`
            SELECT * FROM "Scheduler" s WHERE 
            EXTRACT(MONTH FROM s.task_time) = EXTRACT(MONTH FROM CURRENT_DATE) 
            AND EXTRACT(YEAR FROM s.task_time) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND s."userId" = ${userData.id}
        `;

        for (const key in existingTask) {
            const task = existingTask[key];
            Scheduler.removeTask(task.task_id);
        }

        for (let i = 0; i < schedule.length; i++) {
            const scheduleData = schedule[i];
            const scheduleDatetime = new Date(scheduleData.tanggal_absen);
            const attandendType = scheduleData.keterangan_absen;
            const schedulePayload = scheduleData.data;

            if (scheduleDatetime > currentDate) {
                const taskId = Scheduler.setTask(scheduleDatetime, async () => {
                    userDoAttandend({
                        attandendType: attandendType,
                        attandendData: schedulePayload,
                        loginData: {
                            username: userData.eofficeUsername,
                            password: decryptText(userData.eofficePassword),
                        },
                    });
                });

                bulkData.push({
                    task_data: {
                        keterangan_absen: attandendType,
                        eofficeUsername: userData.eofficeUsername,
                        eofficePassword: userData.eofficePassword,
                        schedulePayload: schedulePayload,
                    },
                    task_id: taskId,
                    task_time: scheduleDatetime,
                    userId: userData.id,
                });

                responseData.push({
                    task_id: taskId,
                    task_time: scheduleDatetime,
                });
            }
        }

        // Hapus scheduler milik user yang sedang login dan spesific
        await prisma.$queryRawUnsafe(
            `
        DELETE FROM "Scheduler" s 
        WHERE s."userId" = $1 AND
        EXTRACT(MONTH FROM s.task_time) = EXTRACT(MONTH FROM CURRENT_DATE) 
        AND EXTRACT(YEAR FROM s.task_time) = EXTRACT(YEAR FROM CURRENT_DATE)`,
            userData.id
        );

        await prisma.scheduler.createMany({ data: bulkData });

        return resSuccess({
            res,
            title: "Success creating scheduler",
            data: responseData,
        });
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
};

exports.wakeUpSchedulers = async () => {
    try {
        const data = await prisma.$queryRaw`
            SELECT * FROM "Scheduler" s WHERE 
            EXTRACT(MONTH FROM s.task_time) = EXTRACT(MONTH FROM CURRENT_DATE) 
            AND EXTRACT(YEAR FROM s.task_time) = EXTRACT(YEAR FROM CURRENT_DATE);
        `;
        const currentDate = new Date();

        for (let i = 0; i < data.length; i++) {
            const scheduleDatetime = new Date(data[i].task_time);
            const attandendType = data[i].task_data.keterangan_absen;
            const schedulePayload = data[i].task_data.schedulePayload;
            const eofficeUsername = data[i].task_data.eofficeUsername;
            const eofficePassword = data[i].task_data.eofficePassword;

            if (scheduleDatetime > currentDate) {
                Scheduler.setTask(
                    scheduleDatetime,
                    async () => {
                        userDoAttandend({
                            attandendType: attandendType,
                            attandendData: schedulePayload,
                            loginData: {
                                username: eofficeUsername,
                                password: decryptText(eofficePassword),
                            },
                        });
                    },
                    data[i].task_id
                );
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        await prisma.$disconnect();
    }
};

function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function convertMonthToNumber(monthName) {
    const months = {
        januari: 0,
        februari: 1,
        maret: 2,
        april: 3,
        mei: 4,
        juni: 5,
        juli: 6,
        agustus: 7,
        september: 8,
        oktober: 9,
        november: 10,
        desember: 11,
    };

    // Ubah nama bulan menjadi huruf kecil untuk memudahkan pencocokan
    const lowerCaseMonth = String(monthName).toLowerCase();

    // Periksa apakah nama bulan ada dalam daftar bulan
    if (months.hasOwnProperty(lowerCaseMonth)) {
        return months[lowerCaseMonth];
    } else {
        // Jika tidak ada, kembalikan null
        return null;
    }
}

function getRandomActivityL2() {
    const activities = [
        "Solving Ticket",
        "Update Database",
        "Update Data",
        "Solving Ticket dan update data",
        "Respond to user inquiries",
        "Provide technical assistance to users",
        "Monitor system performance",
        "Support processes",
    ];
    const randIndex = Math.floor(Math.random() * activities.length);
    return activities[randIndex];
}

function getRandomActivityL1() {
    const activities = [
        "Solving Ticket",
        "Solving Ticket dan update data",
        "Respond to user inquiries",
        "Respond to user problem",
        "Guide user to solve problem",
        "Provide technical assistance to users",
        "Monitor system performance",
        "Support processes",
    ];
    const randIndex = Math.floor(Math.random() * activities.length);
    return activities[randIndex];
}

function getRandomMinutes(max) {
    if (max > 60) {
        return Math.floor(Math.random() * (60 + 1));
    }
    const randomMinutes = Math.floor(Math.random() * (max + 1));
    return randomMinutes;
}
