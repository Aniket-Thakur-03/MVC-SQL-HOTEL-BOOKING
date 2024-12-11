import { State } from "../Models/state.model.js";

export const addState = async (req, res) => {
  try {
    let { state_code, state_name, isActive, country_id } = req.body;
    const { username } = req.user;
    const checkState = await State.findOne({
      where: { state_code: state_code },
    });
    console.log(req.body);
    if (checkState) {
      return res.status(400).json({ message: "State already exists" });
    }
    const newState = await State.create({
      state_code: state_code,
      country_id: Number(country_id),
      state_name: state_name,
      isActive: isActive,
      created_by: username,
      updated_by: username,
    });
    let obj = {
      state_name: newState.state_name,
      state_code: newState.state_code,
    };
    return res.status(200).json({ message: "State created", state: obj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const readState = async (req, res) => {
  try {
    const { id } = req.params;
    const states = await State.findAll({
      where: { country_id: Number(id) },
    });
    if (states.length === 0) {
      return res.status(204).json({ message: "No states added" });
    }
    return res.status(200).json({ states: states });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const readStateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const states = await State.findAll({
      where: { country_id: Number(id), isActive: true },
    });
    if (states.length === 0) {
      return res.status(204).json({ message: "No states added" });
    }
    return res.status(200).json({ states: states });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editState = async (req, res) => {
  try {
    let { state_name, state_code, isActive } = req.body;
    const { id } = req.params;
    const { username } = req.user;
    console.log(req.body);
    const findState = await State.findByPk(Number(id));
    if (!findState) {
      return res.status(400).json({ message: "State doesn't exist" });
    }
    if (state_code !== findState.state_code) findState.state_code = state_code;
    if (state_name !== findState.state_name) findState.state_name = state_name;
    findState.isActive = isActive;
    findState.updated_by = username;
    await findState.save();
    return res.status(200).json({ message: "State Updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const activeUpdateState = async (req, res) => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;
    const checkState = await State.findByPk(id);
    checkState.isActive = isActive;
    await checkState.save();
    return res.status(200).json({
      message: `${isActive == true ? "Active" : "Inactive"} state set`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    const checkState = await State.findByPk(id);
    if (!checkState) {
      return res.status(400).json({ message: "State doesn't exist" });
    }
    await checkState.destroy();
    return res.status(200).json({ message: "State Deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
