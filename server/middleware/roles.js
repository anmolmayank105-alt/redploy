const { requireRole } = require('./auth');

// Role-based access control middleware
const roles = {
  admin: ['admin'],
  alumni: ['admin', 'alumni'],
  student: ['admin', 'alumni', 'student'],
  any: ['admin', 'alumni', 'student']
};

// Pre-configured role middleware functions
const requireAdmin = requireRole(roles.admin);
const requireAlumni = requireRole(roles.alumni);
const requireStudent = requireRole(roles.student);
const requireAnyRole = requireRole(roles.any);

// Custom role checker function
const checkRole = (allowedRoles) => {
  return requireRole(allowedRoles);
};

module.exports = {
  requireAdmin,
  requireAlumni,
  requireStudent,
  requireAnyRole,
  checkRole,
  roles
};