function Validation(username, password) {
    let errors = {
      username: null, // Initialize with no errors
      password: null, // Initialize with no errors
    };

    
    if (!username) {
      errors.username = "Username must be entered.";
    }
  
    if (!password) {
      errors.password = "Password must be entered.";
    }
  
    return errors;
  }
  
  export default Validation;
  