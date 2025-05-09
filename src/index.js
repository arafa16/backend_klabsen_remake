const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const fileUpload = require('express-fileupload')
const SequelizeStore = require('connect-session-sequelize');
const db = require('./models/index.js');

const auth_router = require('./routes/auth.route.js');
const reset_password_router = require('./routes/reset_password.route.js');
const user_router = require('./routes/user.route.js');
const bank_router = require('./routes/bank.route.js');
const contact_emergency = require('./routes/contact_emergency.route.js');
const gander = require('./routes/gander.route.js');
const group = require('./routes/group.route.js');
const golongan_darah = require('./routes/golongan_darah.route.js');
const jabatan = require('./routes/jabatan.route.js');
const pelanggaran = require('./routes/pelanggaran.route.js');
const pendidikan = require('./routes/pendidikan.route.js');
const penempatan = require('./routes/penempatan.route.js');
const status = require('./routes/status.route.js');
const status_inout = require('./routes/status_inout.route.js');
const status_koreksi = require('./routes/status_koreksi.route.js');
const status_perkawinan = require('./routes/status_perkawinan.route.js');
const tipe_absen = require('./routes/tipe_absen.route.js');
const tipe_event = require('./routes/tipe_event.route.js');
const tipe_notification = require('./routes/tipe_notification.route.js');
const tipe_pendapatan = require('./routes/tipe_pendapatan.route.js');
const event = require('./routes/event.route.js');
const email = require('./routes/email.route.js');
const data_email = require('./routes/data_email.route.js');
const mesin_absen = require('./routes/mesin_absen.route.js');
const periode_kerja = require('./routes/periode_kerja.route.js');
const privilege = require('./routes/privilege.route.js');
const slider = require('./routes/slider.route.js');
const status_email = require('./routes/status_email.route.js');
const jam_operasional_group = require('./routes/jam_operasional_group.route.js');
const jam_operasional = require('./routes/jam_operasional.route.js');
const in_out = require('./routes/in_out.route.js');
const pendapatan = require('./routes/pendapatan.route.js');
const koreksi = require('./routes/koreksi.route.js');
const perhitungan = require('./routes/perhitungan.route.js');
const history_koreksi = require('./routes/history_koreksi.route.js');
const notification = require('./routes/notification.route.js');
const user_relate = require('./routes/user_relate.route.js');
const overtime_task_status = require('./routes/overtime_task_status.route.js');
const overtime_report_status = require('./routes/overtime_report_status.route.js');
const overtime_report = require('./routes/overtime_report.route.js');
const overtime_task = require('./routes/overtime_task.route.js');

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db:db.sequelize
});


app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store:store,
    cookie: {
        secure: 'auto',
        expires: 1000 * 60 * 60 * process.env.SESS_EXPIRES
    }
}))

app.use(cors({
    credentials: true,
    origin: [process.env.LINK_FRONTEND]
}));

app.use(express.json());
app.use(fileUpload());

//setup public folder
app.use(express.static('public'));

//router
app.use('/auth', auth_router);
app.use('/reset', reset_password_router);
app.use('/user', user_router);
app.use('/bank', bank_router);
app.use('/contact_emergency', contact_emergency);
app.use('/gander', gander);
app.use('/group', group);
app.use('/golongan_darah', golongan_darah);
app.use('/jabatan', jabatan);
app.use('/pelanggaran', pelanggaran);
app.use('/pendidikan', pendidikan);
app.use('/penempatan', penempatan);
app.use('/status', status);
app.use('/status_inout', status_inout);
app.use('/status_koreksi', status_koreksi);
app.use('/status_perkawinan', status_perkawinan);
app.use('/tipe_Absen', tipe_absen);
app.use('/tipe_event', tipe_event);
app.use('/tipe_notification', tipe_notification);
app.use('/tipe_pendapatan', tipe_pendapatan);
app.use('/event', event);
app.use('/email', email);
app.use('/data_email', data_email);
app.use('/mesin_absen', mesin_absen);
app.use('/periode_kerja', periode_kerja);
app.use('/privilege', privilege);
app.use('/slider', slider);
app.use('/status_email', status_email);
app.use('/jam_operasional_group', jam_operasional_group);
app.use('/jam_operasional', jam_operasional);
app.use('/in_out', in_out);
app.use('/pendapatan', pendapatan);
app.use('/koreksi', koreksi);
app.use('/perhitungan', perhitungan);
app.use('/history_koreksi', history_koreksi);
app.use('/notification', notification);
app.use('/user_relate', user_relate);
app.use('/overtime_task_status', overtime_task_status);
app.use('/overtime_report_status', overtime_report_status);
app.use('/overtime_report', overtime_report);
app.use('/overtime_task', overtime_task);

app.listen(process.env.BACKEND_PORT, ()=>{
    console.log(`server running at port ${process.env.BACKEND_PORT}`);
});
