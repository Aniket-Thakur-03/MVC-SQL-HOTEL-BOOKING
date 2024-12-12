import { City } from "../Models/city.model.js";

export const addCity = async (req, res) => {
  try {
    const { city_name, city_std_code, isActive, state_id } = req.body;
    console.log(city_name, city_std_code, isActive, state_id);
    const { username } = req.user;
    const checkcity = await City.findOne({
      where: { city_std_code: city_std_code },
    });
    if (checkcity) {
      return res.status(400).json({ message: "City already exists" });
    }
    const newcity = await City.create({
      city_std_code: city_std_code,
      state_id: Number(state_id),
      city_name: city_name,
      isActive: isActive,
      created_by: username,
      updated_by: username,
    });
    let obj = {
      city_name: newcity.city_name,
      city_std_code: newcity.city_std_code,
    };
    return res.status(200).json({ message: "city created", city: obj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const readCity = async (req, res) => {
  try {
    const { id } = req.params;
    const cities = await City.findAll({ where: { state_id: Number(id) } });
    if (cities.length === 0) {
      return res.status(204).json({ message: "No cities added" });
    }
    return res.status(200).json({ cities: cities });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const readCityUser = async (req, res) => {
  try {
    const { id } = req.params;
    const cities = await City.findAll({
      where: { state_id: Number(id), isActive: true },
    });
    if (cities.length === 0) {
      return res.status(204).json({ message: "No cities added" });
    }
    return res.status(200).json({ cities: cities });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editCity = async (req, res) => {
  try {
    const { city_name, city_std_code, isActive } = req.body;
    const { id } = req.params;
    const { username } = req.user;
    console.log(city_name, city_std_code, isActive);
    const findcity = await City.findByPk(Number(id));
    if (!findcity) {
      return res.status(400).json({ message: "City doesn't exist" });
    }
    if (city_name !== findcity.city_name) {
      findcity.city_name = city_name;
    }
    if (city_std_code !== findcity.city_std_code) {
      findcity.city_std_code = city_std_code;
    }
    findcity.isActive = isActive;
    findcity.updated_by = username;
    await findcity.save();
    return res.status(200).json({ message: "City Updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const activeUpdateCity = async (req, res) => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;
    const checkCity = await City.findByPk(id);
    checkCity.isActive = isActive;
    await checkCity.save();
    return res.status(200).json({
      message: `${isActive == true ? "Active" : "Inactive"} state set`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const checkCity = await City.findByPk(id);
    if (!checkCity) {
      return res.status(400).json({ message: "City doesn't exist" });
    }
    await checkCity.destroy();
    return res.status(200).json({ message: "City Deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getCityId = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await City.findByPk(Number(id));
    return res.status(200).json({ city: country });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
