const {overtime_history:overtimeHistoryModel} = require('../models');

const createHistory = async(data) => {
    await overtimeHistoryModel.create({
        user_id:data.user_id,
        overtime_task_id:data.overtime_task_id,
        description:data.description
    })
}

module.exports = {
    createHistory
}