function validate({ name, username, email, password }) {
    const errors = {};
  
    // Email pattern for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  
    // Password pattern for validation
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
  
    if (!name) {
      errors.name = "Full name must be entered.";
    }
  
    if (!username) {
      errors.username = "Username must be entered.";
    }
  
    if (!email) {
      errors.email = "Email must be entered.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Invalid email.";
    }
  
    if (!password) {
      errors.password = "Password must be entered.";
    } else if (!passwordPattern.test(password)) {
      errors.password = "Invalid password.";
    }
  
    return errors;
  }
  
  export default validate;
  