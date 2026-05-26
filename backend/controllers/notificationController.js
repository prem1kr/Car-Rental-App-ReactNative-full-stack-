import notificationModel from '../models/notificationModel.js'

export const AddNotification = async (req, res) => {
    try {
        const { title, message } = req.body;
        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Please fill all fields' });
        }

        const newNotification = await notificationModel.create({
            title,
            message
        });
        return res.status(201).json({ success: true, message: 'Notification added successfully', newNotification });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}


export const GetNotification = async (req, res) => {
    try {
        const notifications = await notificationModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: 'notification fetched successfully', notifications });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}


export const MarkedRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await notificationModel.findByIdAndUpdate(id,
            { read: true }, { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        return res.status(200).json({ success: true, message: 'Notification marked as read', notification });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}


export const DeleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await notificationModel.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        return res.status(200).json({ success: true, message: 'Notification deleted successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: true, message: 'Server Error', error: error.message });
    }
}