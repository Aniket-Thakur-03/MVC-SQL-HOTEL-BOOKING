import sequelize from "../dbconnection.js";
import { Location } from "../Models/location.model.js";
import { Room } from "../Models/room.model.js";
export const createLocation = async (req, res) => {
  try {
    const { loactionData } = req.body;
    console.log(loactionData);
    const { username } = req.user;
    Location.create({
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
    return res.status(200).json({ message: "location created" });
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
  const transaction = await sequelize.transaction();
  try {
    const allLocations = await Location.findAll({
      where: { isActive: true },
      transaction: transaction,
    });
    if (allLocations.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "No locations exist" });
    } else {
      const obj = await Promise.all(
        allLocations.map(async (location) => {
          const checkRoomAtLocation = await Room.findAll({
            where: { location_id: location.location_id, state: "active" },
            transaction: transaction,
          });
          if (checkRoomAtLocation.length === 0) {
            return null;
          } else {
            return {
              location_id: location.location_id,
              location_name: location.location_name,
              city: location.city,
              pincode: location.pincode,
            };
          }
        })
      );
      const obj1 = obj.filter((item) => item !== null);
      await transaction.commit();
      return res.status(200).json({ locations: obj1 });
    }
  } catch (error) {
    await transaction.rollback();
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
  const transaction = await sequelize.transaction();
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
    // console.log(
    //   locationname,
    //   address,
    //   country,
    //   state,
    //   city,
    //   pincode,
    //   phoneno,
    //   isActive
    // );
    const { username } = req.user;
    const findLocation = await Location.findByPk(id, {
      transaction: transaction,
    });
    if (!findLocation) {
      await transaction.rollback();
      return res.status(400).json({ message: "Location dosen't exist" });
    }
    if (locationname) findLocation.location_name = locationname;
    if (address) findLocation.address = address;
    if (country) findLocation.country = country;
    if (state) findLocation.state = state;
    if (city) findLocation.city = city;
    if (pincode) findLocation.pincode = pincode;
    if (phoneno) findLocation.phoneno = phoneno;
    if (isActive) {
      const checkRoomAtLocation = await Room.findAll({
        where: { location_id: id },
        transaction: transaction,
      });
      if (checkRoomAtLocation.length > 0) {
        findLocation.isActive = isActive;
      } else {
        await transaction.rollback();
        return res.status(400).json({
          message: "Please add atleast one room before making location active",
        });
      }
    }
    if (!isActive) {
      findLocation.isActive = isActive;
      await Room.update(
        { state: "inactive", updated_by: username },
        { where: { location_id: id }, transaction: transaction }
      );
    }

    findLocation.updated_by = username;
    await findLocation.save({ transaction: transaction });
    await transaction.commit();
    return res.status(200).json({ message: "Location updated" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.json({ message: error.message });
  }
};
