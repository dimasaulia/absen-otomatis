const {
  getGoogleSheetClient,
  SHEET_ID,
} = require('../../../../providers/gapi/google-api');
const Scheduler = require('../../../../providers/scheduler/scheduler');
const { userDoAttandend } = require('../../../../utility/attandend/attandend');
const {
  resSuccess,
} = require('../../../../utility/response-handlers/success/response-success');
const prisma = require('../../../../providers/database/client');
const { decryptText } = require('../../../../utility/encription/encription');

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
      title: 'Success getting sheet name',
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
      title: 'Success getting personnel name',
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
    random_max_time: randomMaxTime = 5,
  } = req.body;

  const personnelRow = Number(personnel_number) + 3;
  const schedulers = [];
  const [_, monthName, year] = String(tabName).split(' ');
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

    // Handel L2OH
    if (String(position).toUpperCase() === 'OH') {
      const shiftPeriods = schedule.data.values[0];
      const dateOfShifts = date.data.values[0];

      for (let i = 0; i < shiftPeriods.length; i++) {
        const shift = shiftPeriods[i];
        const date = dateOfShifts[i];
        const dateObj = new Date();
        dateObj.setDate(date);

        if (String(shift).toUpperCase() == 'OH') {
          const minutes = getRandomMinutes(randomMaxTime);

          const waktuAbsenMasuk = new Date(year, month, date, 20, minutes, 0);

          const waktuAbsenPulang = new Date();
          waktuAbsenPulang.setDate(waktuAbsenMasuk.getDate() + 1);
          waktuAbsenPulang.setHours(8);
          waktuAbsenPulang.setMinutes(minutes);

          // console.log(
          //     `Absen Masuk S2: WITEL - APRIL ${date} 2024 Pukul 8 Malam`
          // );

          schedulers.push({
            keterangan_absen: 'absen_masuk',
            lokasi_absen: 'BELLA TERRA',
            tanggal_absen: waktuAbsenMasuk,
            data: generateRandomLocationBellaTerra(''),
          });

          // console.log(
          //     `Absen Pulang S2: WITEL - APRIL ${
          //         Number(date) + 1
          //     } 2024 Pukul 8 Pagi`
          // );

          schedulers.push({
            keterangan_absen: 'absen_pulang',
            lokasi_absen: 'BELLA TERRA',
            tanggal_absen: waktuAbsenPulang,
            data: generateRandomLocationBellaTerra(getRandomActivityL2()),
          });
        }
      }
    }

    // Handel L2
    if (String(position).toUpperCase() === 'L2') {
      const shiftPeriods = schedule.data.values[0];
      const dateOfShifts = date.data.values[0];

      for (let i = 0; i < shiftPeriods.length; i++) {
        const shift = shiftPeriods[i];
        const date = dateOfShifts[i];
        const dateObj = new Date();
        dateObj.setDate(date);

        if (String(shift).toUpperCase() == 'S2') {
          const minutes = getRandomMinutes(randomMaxTime);

          const waktuAbsenMasuk = new Date(year, month, date, 20, minutes, 0);

          const waktuAbsenPulang = new Date();
          waktuAbsenPulang.setDate(waktuAbsenMasuk.getDate() + 1);
          waktuAbsenPulang.setHours(8);
          waktuAbsenPulang.setMinutes(minutes);

          // console.log(
          //     `Absen Masuk S2: WITEL - APRIL ${date} 2024 Pukul 8 Malam`
          // );

          schedulers.push({
            keterangan_absen: 'absen_masuk',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenMasuk,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
            },
          });

          // console.log(
          //     `Absen Pulang S2: WITEL - APRIL ${
          //         Number(date) + 1
          //     } 2024 Pukul 8 Pagi`
          // );

          schedulers.push({
            keterangan_absen: 'absen_pulang',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenPulang,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
              aktivitas: getRandomActivityL2(),
            },
          });
        }

        // Jika Tanngal Absen Adalah WeekDay maka absen masuk di SMR dan Pulang di WItel
        if (
          String(shift).toUpperCase() == 'S1' &&
          !(dateObj.getDay() == 0 || dateObj.getDay() == 6)
        ) {
          const minutes = getRandomMinutes(randomMaxTime);

          const waktuAbsenMasuk = new Date(year, month, date, 8, minutes, 0);
          const waktuAbsenPulang = new Date(year, month, date, 20, minutes, 0);
          // console.log(
          //     `Absen Masuk S1: SMR - APRIL ${date} 2024 Pukul 8 Pagi`
          // );
          schedulers.push({
            keterangan_absen: 'absen_masuk',
            lokasi_absen: 'SMR',
            tanggal_absen: waktuAbsenMasuk,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.1499495, 106.8880579',
              alamat:
                'Jalan Mitra Sunter Boulevard, RW 11, Sunter Jaya, Tanjung Priok, North Jakarta, Special Capital Region of Jakarta, Java, 14350, Indonesia',
              state: 'Sunter Jaya',
              provinsi: 'Special Capital Region of Jakarta',
            },
          });

          // console.log(
          //     `Absen Pulang S1: WITEL - APRIL ${Number(
          //         date
          //     )} 2024 Pukul 8 Malam`
          // );
          schedulers.push({
            keterangan_absen: 'absen_pulang',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenPulang,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
              aktivitas: getRandomActivityL2(),
            },
          });
        }

        // Jika Tanngal Absen Adalah WeekEnd maka absen masuk di Witel dan Pulang juga WItel
        if (
          String(shift).toUpperCase() == 'S1' &&
          (dateObj.getDay() == 0 || dateObj.getDay() == 6)
        ) {
          const minutes = getRandomMinutes(randomMaxTime);

          const waktuAbsenMasuk = new Date(year, month, date, 8, minutes, 0);
          const waktuAbsenPulang = new Date(year, month, date, 20, minutes, 0);
          // console.log(
          //     `Absen Masuk S1: WITEL - APRIL ${date} 2024 Pukul 8 Pagi`
          // );
          schedulers.push({
            keterangan_absen: 'absen_masuk',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenMasuk,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
            },
          });

          // console.log(
          //     `Absen Pulang S1: WITEL - APRIL ${Number(
          //         date
          //     )} 2024 Pukul 8 Malam`
          // );
          schedulers.push({
            keterangan_absen: 'absen_pulang',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenPulang,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
              aktivitas: getRandomActivityL2(),
            },
          });
        }
      }
    }

    if (String(position).toUpperCase() === 'L1') {
      const shiftPeriods = schedule.data.values[0];
      const dateOfShifts = date.data.values[0];

      for (let i = 0; i < shiftPeriods.length; i++) {
        const shift = shiftPeriods[i];
        const date = dateOfShifts[i];
        const dateObj = new Date();
        dateObj.setDate(date);

        if (String(shift).toUpperCase() == 'S2') {
          const minutes = getRandomMinutes(randomMaxTime);

          const waktuAbsenMasuk = new Date(year, month, date, 20, minutes, 0);

          const waktuAbsenPulang = new Date();
          waktuAbsenPulang.setDate(waktuAbsenMasuk.getDate() + 1);
          waktuAbsenPulang.setHours(8);
          waktuAbsenPulang.setMinutes(minutes);

          // console.log(
          //     `Absen Masuk S2: WITEL - APRIL ${date} 2024 Pukul 8 Malam`
          // );

          schedulers.push({
            keterangan_absen: 'absen_masuk',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenMasuk,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
            },
          });

          // console.log(
          //     `Absen Pulang S2: WITEL - APRIL ${
          //         Number(date) + 1
          //     } 2024 Pukul 8 Pagi`
          // );

          schedulers.push({
            keterangan_absen: 'absen_pulang',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenPulang,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
              aktivitas: getRandomActivityL1(),
            },
          });
        }

        if (String(shift).toUpperCase() == 'S1') {
          const minutes = getRandomMinutes(randomMaxTime);

          const waktuAbsenMasuk = new Date(year, month, date, 8, minutes, 0);
          const waktuAbsenPulang = new Date(year, month, date, 20, minutes, 0);
          // console.log(
          //     `Absen Masuk S1: SMR - APRIL ${date} 2024 Pukul 8 Pagi`
          // );
          schedulers.push({
            keterangan_absen: 'absen_masuk',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenMasuk,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
            },
          });

          // console.log(
          //     `Absen Pulang S1: WITEL - APRIL ${Number(
          //         date
          //     )} 2024 Pukul 8 Malam`
          // );
          schedulers.push({
            keterangan_absen: 'absen_pulang',
            lokasi_absen: 'WITEL',
            tanggal_absen: waktuAbsenPulang,
            data: {
              via: 'WFO',
              kondisi: 'Sehat',
              lokasi: '-6.117492, 106.893084',
              alamat:
                'Transjakarta Busway Koridor 10, 12, RW 06, Kebon Bawang, Tanjung Priok, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14320, Indonesia',
              state: '',
              provinsi: 'Daerah Khusus Jakarta',
              aktivitas: getRandomActivityL1(),
            },
          });
        }
      }
    }

    return resSuccess({
      res,
      title: 'Success creating scheduler preview',
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

exports.generateSchedulersOHPreview = async (req, res, next) => {
  try {
    const {
      random_min_time: randomMinTime = 0,
      random_max_time: randomMaxTime = 5,
      position = 'L2',
    } = req.body;

    const location = 'BELLA TERRA';

    const schedulers = [];
    for (let i = 1; i <= getMaxDateOfCurrentMonth(); i++) {
      const minutes = getRandomMinutes(randomMinTime, randomMaxTime);
      const now = new Date();
      const year = now.getFullYear(); // Mengambil tanggal
      const month = now.getMonth();

      const waktuAbsenMasuk = new Date(year, month, i, 8, minutes, 0);
      const waktuAbsenPulang = new Date(year, month, i, 20, minutes, 0);

      schedulers.push({
        keterangan_absen: 'absen_masuk',
        lokasi_absen: location,
        tanggal_absen: waktuAbsenMasuk,
        data: generateRandomLocationBellaTerra(''),
      });

      schedulers.push({
        keterangan_absen: 'absen_pulang',
        lokasi_absen: location,
        tanggal_absen: waktuAbsenPulang,
        data: generateRandomLocationBellaTerra(
          String(position).toUpperCase() === 'L2'
            ? getRandomActivityL2()
            : String(position).toUpperCase() === 'DEV'
            ? getRandomActivityDEV()
            : String(position).toUpperCase() === 'QA'
            ? getRandomActivityQa()
            : getRandomActivityL2()
        ),
      });
    }

    return resSuccess({
      res,
      title: 'Success creating scheduler preview',
      data: {
        schedulers: schedulers,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.setSchedulers = async (req, res, next) => {
  console.log('Set Schedulers Function');
  try {
    const { schedule } = req.body;
    const currentDate = new Date();
    const bulkData = [];
    const responseData = [];
    const userData = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (userData == null || userData == undefined) {
      throw new Error('Cant find user, maybe user was remove from system');
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
      title: 'Success creating scheduler',
      data: responseData,
    });
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

exports.setOfficeHourSchedulers = async (req, res, next) => {};

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
    'Solving Ticket',
    'Update Database',
    'Update Data',
    'Bug Fixing',
    'Bug Tracing',
    'Solving Ticket dan update data',
    'Respond to user inquiries',
    'Provide technical assistance to users',
    'Monitor system performance',
    'Support processes',
  ];
  const randIndex = Math.floor(Math.random() * activities.length);
  return activities[randIndex];
}

function getRandomActivityDEV() {
  const activities = [
    'Refactor Code',
    'Debuging',
    'Bug Fixing',
    'Collaborate with team to develop new feature',
    'Monitor application logs',
    'API development',
    'Optimize legacy code',
    'Create technical specifications',
    'Deploy updates',
    'Review system performance metrics',
  ];
  const randIndex = Math.floor(Math.random() * activities.length);
  return activities[randIndex];
}

function getRandomActivityL1() {
  const activities = [
    'Solving Ticket',
    'Solving Ticket dan update data',
    'Respond to user inquiries',
    'Respond to user problem',
    'Guide user to solve problem',
    'Provide technical assistance to users',
    'Monitor system performance',
    'Support processes',
  ];
  const randIndex = Math.floor(Math.random() * activities.length);
  return activities[randIndex];
}

function getRandomActivityQa() {
  const activities = [
    'Testing task Enhancement di Sprint',
    'Testing task BUGFIX di Sprint',
    'Testing task NEW FEATURE di Sprint',
    'Testing task Enhancement di Sprint',
    'Testing task BUGFIX di Adhoc',
    'Testing task NEW FEATURE di Adhoc',
    'Testing task BUGFIX di Hotfix',
    'Membuat Skenario yg ada di Sprint',
    'Membuat Skenario yg ada di Adhoc',
    'Membuat Skenario yg ada di Hotfix',
  ];
  const randIndex = Math.floor(Math.random() * activities.length);
  return activities[randIndex];
}

function getRandomMinutes(min = 0, max = 5) {
  if (min > max) {
    throw new Error(
      'Nilai minimum tidak boleh lebih besar dari nilai maksimum'
    );
  }
  const randomMinutes = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomMinutes;
}

function generateRandomLocationBellaTerra(activity) {
  const randomLocationId = Math.floor(Math.random() * 50);
  const randomLocation = randomLocationsBellaTerra[randomLocationId];

  return {
    via: 'WFS',
    kondisi: 'Sehat',
    lokasi: randomLocation,
    alamat:
      'Jalan Kirana Avenue, RW 01, Kelapa Gading Timur, Kelapa Gading, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14240, Indonesia',
    state: 'Kelapa Gading Timur',
    provinsi: 'Daerah Khusus Jakarta',
    keterangan: '',
    aktivitas: activity ?? '',
  };
}

function generateRandomLocationTamansariPrama(activity) {
  const randomLocationId = Math.floor(Math.random() * 50);
  const randomLocation = randomLocationsTamansariPrama[randomLocationId];

  return {
    via: 'WFS',
    kondisi: 'Sehat',
    lokasi: randomLocation,
    alamat:
      'Bank Central Asia, Jalan KH. Wahid Hasyim, RW 04, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Jawa, 10350, Indonesia',
    state: 'Gondangdia',
    provinsi: 'Daerah Khusus Ibukota Jakarta',
    keterangan: '',
    aktivitas: activity ?? '',
  };
}

function getMaxDateOfCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // Bulan saat ini (0-11)

  // Buat tanggal untuk tanggal 1 bulan berikutnya
  const nextMonth = new Date(year, month + 1, 1);
  // Kurangi satu hari dari tanggal tersebut
  const maxDate = new Date(nextMonth - 1);

  return maxDate.getDate();
}

const randomLocationsBellaTerra = [
  '-6.174241140255721,106.893897862740270',
  '-6.174241140255721,106.893897862740273',
  '-6.174241140255721,106.893897862740276',
  '-6.174241140255721,106.893897862740279',
  '-6.174241140255721,106.893897862740282',
  '-6.174241140255721,106.893897862740285',
  '-6.174241140255721,106.893897862740288',
  '-6.174241140255721,106.893897862740291',
  '-6.174241140255721,106.893897862740294',
  '-6.174241140255721,106.893897862740297',
  '-6.174241140255721,106.893897862740300',
  '-6.174241140255721,106.893897862740303',
  '-6.174241140255721,106.893897862740306',
  '-6.174241140255721,106.893897862740309',
  '-6.174241140255721,106.893897862740312',
  '-6.174241140255721,106.893897862740315',
  '-6.174241140255721,106.893897862740318',
  '-6.174241140255721,106.893897862740321',
  '-6.174241140255721,106.893897862740324',
  '-6.174241140255721,106.893897862740327',
  '-6.174241140255721,106.893897862740330',
  '-6.174241140255721,106.893897862740333',
  '-6.174241140255721,106.893897862740336',
  '-6.174241140255721,106.893897862740339',
  '-6.174241140255721,106.893897862740342',
  '-6.174241140255721,106.893897862740345',
  '-6.174241140255721,106.893897862740348',
  '-6.174241140255721,106.893897862740351',
  '-6.174241140255721,106.893897862740354',
  '-6.174241140255721,106.893897862740357',
  '-6.174241140255721,106.893897862740360',
  '-6.174241140255721,106.893897862740363',
  '-6.174241140255721,106.893897862740366',
  '-6.174241140255721,106.893897862740369',
  '-6.174241140255721,106.893897862740372',
  '-6.174241140255721,106.893897862740375',
  '-6.174241140255721,106.893897862740378',
  '-6.174241140255721,106.893897862740381',
  '-6.174241140255721,106.893897862740384',
  '-6.174241140255721,106.893897862740387',
  '-6.174241140255721,106.893897862740390',
  '-6.174241140255721,106.893897862740393',
  '-6.174241140255721,106.893897862740396',
  '-6.174241140255721,106.893897862740399',
  '-6.174241140255721,106.893897862740402',
  '-6.174241140255721,106.893897862740405',
  '-6.174241140255721,106.893897862740408',
  '-6.174241140255721,106.893897862740411',
  '-6.174241140255721,106.893897862740414',
  '-6.174241140255721,106.893897862740417',
  '-6.174242808460579,106.893899747491371',
];

const randomLocationsTamansariPrama = [
  '-6.186946101527,106.827664375305',
  '-6.186946873521,106.827664985412',
  '-6.186946201836,106.827664292837',
  '-6.186946998221,106.827664517964',
  '-6.186946579421,106.827664153674',
  '-6.186946452738,106.827664879120',
  '-6.186946302184,106.827664721098',
  '-6.186946843205,106.827664943702',
  '-6.186946665124,106.827664381029',
  '-6.186946193487,106.827664527891',
  '-6.186946384712,106.827664982374',
  '-6.186946258947,106.827664603918',
  '-6.186946907215,106.827664205109',
  '-6.186946832574,106.827664756103',
  '-6.186946154381,106.827664487192',
  '-6.186946876509,106.827664341203',
  '-6.186946402193,106.827664901876',
  '-6.186946211658,106.827664782130',
  '-6.186946753624,106.827664519607',
  '-6.186946596318,106.827664130984',
  '-6.186946307458,106.827664372518',
  '-6.186946479283,106.827664893104',
  '-6.186946639478,106.827664412958',
  '-6.186946155379,106.827664519470',
  '-6.186946891270,106.827664830124',
  '-6.186946743028,106.827664725193',
  '-6.186946394165,106.827664381759',
  '-6.186946239876,106.827664593127',
  '-6.186946914782,106.827664409283',
  '-6.186946531287,106.827664902183',
  '-6.186946281392,106.827664157023',
  '-6.186946673291,106.827664584203',
  '-6.186946817635,106.827664327891',
  '-6.186946543217,106.827664475091',
  '-6.186946298547,106.827664803092',
  '-6.186946105823,106.827664948382',
  '-6.186946402919,106.827664681204',
  '-6.186946739581,106.827664527398',
  '-6.186946186273,106.827664931718',
  '-6.186946532765,106.827664248093',
  '-6.186946314675,106.827664985371',
  '-6.186946709413,106.827664352479',
  '-6.186946825731,106.827664193842',
  '-6.186946293641,106.827664983102',
  '-6.186946452879,106.827664310527',
  '-6.186946378195,106.827664710391',
  '-6.186946792618,106.827664132978',
  '-6.186946902741,106.827664873095',
  '-6.186946157439,106.827664420874',
  '-6.186946619528,106.827664791208',
];
