const Event = require('../models/Event');

// Create a new event (admin only)
const createEvent = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;
    
    const { 
      title, 
      description, 
      date, 
      location, 
      maxAttendees, 
      registrationDeadline, 
      eventType 
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, date, and location are required'
      });
    }

    // Validate date is in the future
    const eventDate = new Date(date);
    if (eventDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be in the future'
      });
    }

    // Validate registration deadline if provided
    if (registrationDeadline) {
      const regDeadline = new Date(registrationDeadline);
      if (regDeadline >= eventDate) {
        return res.status(400).json({
          success: false,
          message: 'Registration deadline must be before event date'
        });
      }
    }

    const newEvent = new Event({
      title,
      description,
      date: eventDate,
      location,
      collegeId,
      createdBy: adminUser._id,
      maxAttendees: maxAttendees || null,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      eventType: eventType || 'other'
    });

    const savedEvent = await newEvent.save();
    
    // Populate college and creator info
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate('collegeId', 'name')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
};

// Get all events for the admin's college
const getEvents = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;

    const events = await Event.find({ collegeId })
      .populate('createdBy', 'name email')
      .sort({ date: 1 }); // Sort by date ascending

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

// Delete an event (admin only)
const deleteEvent = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;
    const { eventId } = req.params;

    // Find and verify event belongs to same college
    const event = await Event.findOne({ 
      _id: eventId, 
      collegeId 
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or access denied'
      });
    }

    // Check if event has registrations
    if (event.registeredAttendees && event.registeredAttendees.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete event with ${event.registeredAttendees.length} registered attendees`
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
};

// Update an event (admin only)
const updateEvent = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;
    const { eventId } = req.params;
    
    const { 
      title, 
      description, 
      date, 
      location, 
      maxAttendees, 
      registrationDeadline, 
      eventType,
      isActive 
    } = req.body;

    // Find and verify event belongs to same college
    const event = await Event.findOne({ 
      _id: eventId, 
      collegeId 
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or access denied'
      });
    }

    // Validate date if provided
    if (date) {
      const eventDate = new Date(date);
      if (eventDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Event date must be in the future'
        });
      }
    }

    // Update event fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (location) updateData.location = location;
    if (maxAttendees !== undefined) updateData.maxAttendees = maxAttendees;
    if (registrationDeadline) updateData.registrationDeadline = new Date(registrationDeadline);
    if (eventType) updateData.eventType = eventType;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId, 
      updateData, 
      { new: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent
};