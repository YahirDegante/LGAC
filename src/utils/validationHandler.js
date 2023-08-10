const validateError = (error) => {
  switch (error.message) {
    case 'Email not found':
      return { code: 404, message: 'Email not found' };
    case 'Incorrect password':
      return { code: 400, message: 'Incorrect password' };
      case 'Passwords dont match':
        return { code: 400, message: 'Passwords dont match' };
    case 'Users not found':
      return { code: 404, message: 'Users not found' };
    case 'User not active':
      return { code: 400, message: 'Inactive user' };
    case 'User already registered':
      return { code: 400, message: 'User already registered' };
    case 'num_control error':
      return { code: 400, message: 'Control number already registered' };
    case 'cvu error':
      return { code: 400, message: 'CVU number already registered' };
    case 'email error':
      return { code: 400, message: 'Institutional email already registered' };
    case 'Missing fields':
      return { code: 400, message: 'Missing fields' };
    case 'Role not valid':
      return { code: 400, message: 'Invalid role' };
    case 'Invalid role':
      return { code: 400, message: 'This user is not authorized to perform this action' };
    case 'Research line not found':
      return { code: 404, message: 'Research line not found' };
    case 'MulterError: Unexpected field':
      return { code: 400, message: 'Unexpected field' };
    case 'Invalid file':
      return { code: 400, message: 'Only PDF files are allowed' };
    case 'Exceeded limit':
      return { code: 400, message: 'File size must be less than 10MB' };
    case 'Documents not found':
      return { code: 404, message: 'Documents not found' };
    case 'Assignred theses not found':
      return { code: 404, message: 'Assignred theses not found' };
    case 'Thesis already assigned':
      return { code: 400, message: 'This student already has a thesis assigned' };
    case 'Assignred thesis not active':
      return { code: 400, message: 'Inactive assignred thesis' };
    case 'Already exists research line':
      return { code: 400, message: 'Research line already exists' };
      case 'External advisors not found':
        return { code: 404, message: 'External advisors not found' };
    default:
      return { code: 500, message: 'Internal server error' };
  }
};

module.exports = {
  validateError,
};
