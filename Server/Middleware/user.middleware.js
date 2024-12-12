function validateEmail(email) {
  const emailformat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailformat.test(email);
}
function validatePassword(password) {
  if (password.length < 8) {
    return "Password must be 8 characters";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain atleast 1 lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain atleast 1 Uppercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must contain atleast 1 number";
  }
  if (!/[@$#%*&?]/.test(password)) {
    return "Password must contain atleast 1 special character (@,$,#,%,*,&,?)";
  }
  return "Password correct";
}
export const userCreateCheck = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Incomplete information" });
  }
  if (typeof username !== "string" || username.length < 4) {
    return res.status(400).json({ message: "Incorrect username format" });
  }
  if (typeof email !== "string" || !validateEmail(email)) {
    return res.status(400).json({ message: "Incorrect email format" });
  }
  const pstring = validatePassword(password);
  if (typeof password !== "string" || pstring !== "Password correct") {
    return res.status(400).json({ message: `${pstring}` });
  }
  next();
};

export const loginInfoCheck = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Incomplete Information" });
  }
  if (typeof email !== "string" || !validateEmail(email)) {
    return res.status(400).json({ message: "Incorrect email format" });
  }
  const pstring = validatePassword(password);
  if (typeof password !== "string" || pstring !== "Password correct") {
    return res.status(400).json({ message: `${pstring}` });
  }
  next();
};

export const userUpdateCheck = (req, res, next) => {
  const { newusername, newpassword, fullName, phoneNo, password } = req.body;
  if (newusername) {
    if (newusername.length < 4) {
      return res.status(400).json({ message: "Incorrect username format" });
    }
  }
  if (newpassword) {
    const pstring = validatePassword(newpassword);
    if (pstring == !"Password correct") {
      return res.status(400).json({ message: `${pstring}` });
    }
    if (newpassword === password) {
      return res
        .status(400)
        .json({
          message: "Password is same as before, change it or don't enter it",
        });
    }
  }
  if (fullName && !/^[a-zA-Z ]+$/.test(fullName)) {
    return res
      .status(400)
      .json({ message: "full name must be composed of letters and spaces" });
  }
  if (phoneNo && !/^\d{10}$/.test(phoneNo)) {
    return res
      .status(400)
      .json({ message: "Phone no must be exactly of 10 digits" });
  }
  next();
};

export const verifypassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password not sent" });
  } else {
    const pstring = validatePassword(password);
    if (pstring !== "Password correct") {
      return res.status(400).json({ message: `${pstring}` });
    } else next();
  }
};
