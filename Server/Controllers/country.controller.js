import { response } from "express";
import { Country } from "../Models/country.model.js";

export const addCountry = async (req, res) => {
  try {
    const { country_iso_code, country_name, isActive } = req.body;
    if (isActive) {
      if (isActive == "false") isActive = false;
      if (isActive == "true") isActive = true;
    }
    const { username } = req.user;
    const checkCountry = await Country.findOne({
      where: { country_iso_code: country_iso_code },
    });
    if (checkCountry) {
      return res.status(400).json({ message: "Country already exists" });
    } else {
      const newCountry = await Country.create({
        country_iso_code: country_iso_code,
        country_name: country_name,
        isActive: isActive,
        created_by: username,
        updated_by: username,
      });
      let obj = {
        country_name: newCountry.country_name,
        country_iso_code: newCountry.country_iso_code,
      };
      return res
        .status(200)
        .json({ message: "Country added successfully", country: obj });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const readCountry = async (req, res) => {
  try {
    const countries = await Country.findAll();
    if (countries.length === 0) {
      return res.status(204).json({ message: "No Countries added" });
    }
    return res.status(200).json({ countries: countries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const readCountryUser = async (req, res) => {
  try {
    const countries = await Country.findAll({ where: { isActive: true } });
    if (countries.length === 0) {
      return res.status(204).json({ message: "No Countries added" });
    }
    return res.status(200).json({ countries: countries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editCountry = async (req, res) => {
  try {
    const { country_name, country_iso_code, isActive } = req.body;
    const { id } = req.params;
    const { username } = req.user;
    // console.log(newname, newcode, isActive);
    if (isActive) {
      if (isActive == "false") isActive = false;
      if (isActive == "true") isActive = true;
    }
    const findCountry = await Country.findByPk(Number(id));
    if (!findCountry) {
      return res.status(400).json({ message: "Country doesn't exist" });
    }
    if (country_name !== findCountry.country_name) {
      findCountry.country_name = country_name;
    }

    if (country_iso_code !== findCountry.country_iso_code) {
      findCountry.country_iso_code = country_iso_code;
    }
    findCountry.isActive = isActive;
    findCountry.updated_by = username;
    await findCountry.save();
    return res.status(200).json({ message: "Country Updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const activeUpdate = async (req, res) => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;
    const checkCountry = await Country.findByPk(id);
    checkCountry.isActive = isActive;
    await checkCountry.save();
    return res.status(200).json({
      message: `${isActive == true ? "Active" : "Inactive"} state set`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const checkCountry = await Country.findByPk(id);
    if (!checkCountry) {
      return res.status(400).json({ message: "Country doesn't exist" });
    }
    await checkCountry.destroy();
    return res.status(200).json({ message: "Country Deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getCountryId = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(Number(id));
    return res.status(200).json({ country: country });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
