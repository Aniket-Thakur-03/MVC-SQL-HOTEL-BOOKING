import { Location } from "../Models/location.model.js";

export const createLocation = async (req, res) => {
  try {
    const { loactionData } = req.body;
    console.log(loactionData);
    const { username } = req.user;
    const newLocation = await Location.create({
      location_name: loactionData.locationname,
      address: loactionData.address,
      country: loactionData.country,
      state: loactionData.state,
      city: loactionData.city,
      pincode: loactionData.pincode,
      phoneno: loactionData.phoneno,
      isActive: loactionData.isActive,
      created_by: username,
      updated_by: username,
    });
    return res
      .status(200)
      .json({ message: "location created", location: newLocation.location_id });
  } catch (error) {
    console.error(error);
    return res.json({ message: error.message });
  }
};

export const getLocation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const Locations = await Location.findByPk(id);
    if (!Locations) {
      return res.status(400).json({ message: "No location exist" });
    } else return res.status(200).json({ location: Locations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getLocations = async (req, res) => {
  try {
    const allLocations = await Location.findAll({ where: { isActive: true } });
    if (allLocations.length === 0) {
      return res.status(400).json({ message: "No locations exist" });
    } else return res.status(200).json({ locations: allLocations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getLocationsAdmin = async (req, res) => {
  try {
    const allLocations = await Location.findAll();
    if (allLocations.length === 0) {
      return res.status(400).json({ message: "No locations exist" });
    } else return res.status(200).json({ locations: allLocations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editLocation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      locationname,
      address,
      country,
      state,
      city,
      pincode,
      phoneno,
      isActive,
    } = req.body;
    console.log(
      locationname,
      address,
      country,
      state,
      city,
      pincode,
      phoneno,
      isActive
    );
    const { username } = req.user;
    const findLocation = await Location.findByPk(id);
    if (!findLocation) {
      return res.status(400).json({ message: "Location dosen't exist" });
    }
    if (locationname) findLocation.location_name = locationname;
    if (address) findLocation.address = address;
    if (country) findLocation.country = country;
    if (state) findLocation.state = state;
    if (city) findLocation.city = city;
    if (pincode) findLocation.pincode = pincode;
    if (phoneno) findLocation.phoneno = phoneno;
    findLocation.isActive = isActive;
    findLocation.updated_by = username;
    await findLocation.save();
    return res.status(200).json({ message: "Location updated" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};
