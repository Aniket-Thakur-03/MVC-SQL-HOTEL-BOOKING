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
  const pstring = () => validatePassword(password);
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
  const { newusername, newpassword } = req.body;
  newusername
    ? newusername.length < 4
      ? res
          .status(400)
          .json({ message: "Username should be atleast 4 characters" })
      : null
    : null;
  newpassword
    ? validatePassword(newpassword) !== "Password correct"
      ? res.status(400).json({ message: `${validatePassword(newpassword)}` })
      : null
    : null;
  next();
};
